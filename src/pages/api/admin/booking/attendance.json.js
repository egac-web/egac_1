import { getSupabaseAdmin, appendEnquiryEvent, createInviteForEnquiry, markInviteSent } from '../../../../lib/supabase';
import { sendInviteEmail } from '../../../../lib/resend';

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const auth = await import('../../../../lib/admin-auth').then(m => m.ensureAdmin(request, locals));
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const body = await request.json();
    const { booking_id, status, note, send_membership_link } = body || {};
    if (!booking_id || !['attended', 'no_show'].includes(status)) return new Response(JSON.stringify({ ok: false, error: 'Invalid payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

    // Use centralized helper which prefers RPC and falls back to safe queries
    let booking = null;
    try {
      const { getBookingById } = await import('../../../../lib/supabase');
      booking = await getBookingById(booking_id, env);
      if (!booking) return new Response(JSON.stringify({ ok: false, error: 'Booking not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.error('Booking fetch error', e);
      return new Response(JSON.stringify({ ok: false, error: `Booking fetch failed: ${e.message}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Capture related enquiry for later use
    const enquiry = booking.enquiry || null;

    // update booking status and optional note using helper
    let updated;
    try {
      const { updateBookingStatus } = await import('../../../../lib/supabase');
      updated = await updateBookingStatus(booking_id, status, note, env);
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message || String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
        const enq = enquiry || {};
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
    // Use the enquiry already fetched and attached to booking
    const enq = enquiry || {};
    const slot = booking.slot || '';
    const session_date = booking.session_date || '';
    const coachMessage = `Attended: ${enq.name || ''} (${enq.email || ''}, ${enq.phone || ''}) — ${session_date} ${slot} — Please record in Presli per EA criteria.`;
    responsePayload.coachMessage = coachMessage;

    // Optionally include a CSV row suitable for manual Presli import
    responsePayload.presliCSV = `${enq.name || ''},${enq.email || ''},${enq.phone || ''},${session_date},${slot}`;

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Attendance endpoint error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}