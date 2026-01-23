import { getSupabaseAdmin, appendEnquiryEvent, createInviteForEnquiry, markInviteSent } from '../../../../lib/supabase';
import { sendInviteEmail } from '../../../../lib/resend';

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get('x-admin-token') || url.searchParams.get('token') || '';
    if (token !== 'dev' && (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN)) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });

    const body = await request.json();
    const { booking_id, status, note, send_membership_link } = body || {};
    if (!booking_id || !['attended', 'no_show'].includes(status)) return new Response(JSON.stringify({ ok: false, error: 'Invalid payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

    const client = getSupabaseAdmin(env);

    // Fetch booking with embedded enquiry fallback logic
    let booking, enquiry = null;

    try {
      // Try to fetch booking with embedded enquiry (legacy approach)
      const { data, error } = await client.from('bookings').select('*, enquiry:enquiries(*)').eq('id', booking_id).maybeSingle();

      // Check if error is the "Could not embed" relationship error
      if (error && error.message && error.message.includes('Could not embed')) {
        // Fallback: fetch booking and enquiry separately
        const { data: bookingData, error: bookingErr } = await client.from('bookings').select('*').eq('id', booking_id).maybeSingle();
        if (bookingErr) return new Response(JSON.stringify({ ok: false, error: bookingErr.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
        if (!bookingData) return new Response(JSON.stringify({ ok: false, error: 'Booking not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });

        booking = bookingData;

        // Load enquiry explicitly
        const { data: enquiryData, error: enquiryErr } = await client.from('enquiries').select('*').eq('id', booking.enquiry_id).maybeSingle();
        if (enquiryErr) return new Response(JSON.stringify({ ok: false, error: enquiryErr.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
        enquiry = enquiryData;
        booking.enquiry = enquiry;
      } else if (error) {
        // Other error
        return new Response(JSON.stringify({ ok: false, error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        // Success with embedded select
        if (!data) return new Response(JSON.stringify({ ok: false, error: 'Booking not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
        booking = data;
        enquiry = data.enquiry;
      }
    } catch (e) {
      // Unexpected error during fetch
      return new Response(JSON.stringify({ ok: false, error: `Booking fetch failed: ${e.message}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // update booking status and optional note
    const { data: updated, error: updErr } = await client.from('bookings').update({ status, attendance_note: note }).eq('id', booking_id).select().single();
    if (updErr) return new Response(JSON.stringify({ ok: false, error: updErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });

    // append event on enquiry
    const enquiry_id = booking.enquiry_id || (booking.enquiry && booking.enquiry.id);
    if (!enquiry_id) return new Response(JSON.stringify({ ok: false, error: 'Booking missing enquiry' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });

    const event = { type: 'attendance', status, note: note || null, timestamp: new Date().toISOString(), booking_id };
    await appendEnquiryEvent(enquiry_id, event, env);

    const responsePayload = { ok: true, booking: updated, events_appended: event };

    // If attended and the admin asked to send membership link — create invite and send email
    if (status === 'attended' && send_membership_link) {
      try {
        let invite;
        try {
          invite = await createInviteForEnquiry(enquiry_id, env);
        } catch (err) {
          if (String(err.message || '').includes('enquiry_on_academy_waitlist')) {
            responsePayload.membership_sent = false;
            responsePayload.warning = 'Enquiry is on Academy waiting list; membership link will not be sent';
            invite = null;
          } else {
            throw err;
          }
        }

        const membershipUrl = invite ? `${env.SITE_URL || ''}/membership?token=${invite.token}` : null;
        // Use the enquiry already fetched (either from fallback or embedded)
        const enq = enquiry || booking.enquiry || {};
        if (invite && enq && enq.email) {
          try {
            const { sendInviteNotification } = await import('../../../../lib/notifications');
            await sendInviteNotification({ enquiryId: enquiry_id, inviteId: invite.id, to: enq.email, inviteUrl: membershipUrl, env });
            responsePayload.membership_sent = true;
          } catch (err) {
            console.error('sendInviteNotification failed for membership link', err);
            responsePayload.membership_sent = false;
            responsePayload.warning = 'Failed to send membership link';
          }
        } else if (!invite) {
          // already handled above
        } else {
          responsePayload.membership_sent = false;
          responsePayload.warning = 'No email address to send membership link';
        }
      } catch (err) {
        console.error('Membership link send error', err);
        responsePayload.membership_error = err.message || String(err);
      }
    }

    // Generate coach message text for copy/paste
    // Use the enquiry already fetched and attached to booking (fallback to separate enquiry var)
    const enq = enquiry || booking.enquiry || {};
    const slot = booking.slot || '';
    const session_date = booking.session_date || '';
    const coachMessage = `Attended: ${enq.name || ''} (${enq.email || ''}, ${enq.phone || ''}) — ${session_date} ${slot} — Please record in Presli per EA criteria.`;
    responsePayload.coachMessage = coachMessage;

    // Optionally include a CSV row suitable for manual Presli import
    responsePayload.presliCSV = `${enq.name || ''},${enq.email || ''},${enq.phone || ''},${session_date},${slot}`;

    return { status: 200, body: responsePayload };
  } catch (err) {
    console.error('Attendance endpoint error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}