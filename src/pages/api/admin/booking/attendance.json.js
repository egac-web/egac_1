import { getSupabaseAdmin, appendEnquiryEvent, createInviteForEnquiry, markInviteSent } from '../../../../lib/supabase';
import { sendInviteEmail } from '../../../../lib/resend';

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const token = request.headers.get('x-admin-token') || '';
    if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
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
    const { data: booking, error: fetchErr } = await client.from('bookings').select('*, enquiry:enquiries(*)').eq('id', booking_id).maybeSingle();
    if (fetchErr) return new Response(JSON.stringify({ ok: false, error: fetchErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
    if (!booking) return new Response(JSON.stringify({ ok: false, error: 'Booking not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });

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
        const invite = await createInviteForEnquiry(enquiry_id, env);
        const membershipUrl = `${env.SITE_URL || ''}/membership?token=${invite.token}`;
        const enquiry = booking.enquiry || {};
        if (enquiry && enquiry.email) {
          try {
            const { sendInviteNotification } = await import('../../../../lib/notifications');
            await sendInviteNotification({ enquiryId: enquiry_id, inviteId: invite.id, to: enquiry.email, inviteUrl: membershipUrl, env });
            responsePayload.membership_sent = true;
          } catch (err) {
            console.error('sendInviteNotification failed for membership link', err);
            responsePayload.membership_sent = false;
            responsePayload.warning = 'Failed to send membership link';
          }
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
    const enquiry = booking.enquiry || {};
    const slot = booking.slot || '';
    const session_date = booking.session_date || '';
    const coachMessage = `Attended: ${enquiry.name || ''} (${enquiry.email || ''}, ${enquiry.phone || ''}) — ${session_date} ${slot} — Please record in Presli per EA criteria.`;
    responsePayload.coachMessage = coachMessage;

    // Optionally include a CSV row suitable for manual Presli import
    responsePayload.presliCSV = `${enquiry.name || ''},${enquiry.email || ''},${enquiry.phone || ''},${session_date},${slot}`;

    return { status: 200, body: responsePayload };
  } catch (err) {
    console.error('Attendance endpoint error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}