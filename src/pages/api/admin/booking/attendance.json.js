import { getSupabaseAdmin, appendEnquiryEvent, createInviteForEnquiry, markInviteSent } from '../../../../lib/supabase';
import { sendInviteEmail } from '../../../../lib/resend';

export async function post({ request }) {
  try {
    const token = request.headers.get('x-admin-token') || '';
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return { status: 401, body: { ok: false, error: 'Unauthorized' } };

    const body = await request.json();
    const { booking_id, status, note, send_membership_link } = body || {};
    if (!booking_id || !['attended', 'no_show'].includes(status)) return { status: 400, body: { ok: false, error: 'Invalid payload' } };

    const client = getSupabaseAdmin();
    const { data: booking, error: fetchErr } = await client.from('bookings').select('*, enquiry:enquiries(*)').eq('id', booking_id).maybeSingle();
    if (fetchErr) return { status: 500, body: { ok: false, error: fetchErr.message } };
    if (!booking) return { status: 404, body: { ok: false, error: 'Booking not found' } };

    // update booking status and optional note
    const { data: updated, error: updErr } = await client.from('bookings').update({ status, attendance_note: note }).eq('id', booking_id).select().single();
    if (updErr) return { status: 500, body: { ok: false, error: updErr.message } };

    // append event on enquiry
    const enquiry_id = booking.enquiry_id || (booking.enquiry && booking.enquiry.id);
    if (!enquiry_id) return { status: 500, body: { ok: false, error: 'Booking missing enquiry' } };

    const event = { type: 'attendance', status, note: note || null, timestamp: new Date().toISOString(), booking_id };
    await appendEnquiryEvent(enquiry_id, event);

    const responsePayload = { ok: true, booking: updated, events_appended: event };

    // If attended and the admin asked to send membership link — create invite and send email
    if (status === 'attended' && send_membership_link) {
      try {
        const invite = await createInviteForEnquiry(enquiry_id);
        const membershipUrl = `${process.env.SITE_URL || ''}/membership?token=${invite.token}`;
        const enquiry = booking.enquiry || {};
        if (enquiry && enquiry.email) {
          const html = `<p>Hello ${enquiry.name || ''},</p><p>Thanks for attending your taster session. To complete your membership, please complete the form: <a href="${membershipUrl}">Complete membership</a></p>`;
          const text = `Complete your membership: ${membershipUrl}`;
          await sendInviteEmail({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM, to: enquiry.email, subject: 'EGAC: Complete your membership', html, text });
          await markInviteSent(invite.id);
          const ev = { type: 'membership_link_sent', invite_id: invite.id, to: enquiry.email, timestamp: new Date().toISOString() };
          await appendEnquiryEvent(enquiry_id, ev);
          responsePayload.membership_sent = true;
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
    return { status: 500, body: { ok: false, error: 'Server error' } };
  }
}