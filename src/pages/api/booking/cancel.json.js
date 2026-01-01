import { getInviteByToken, getBookingByInvite, cancelBooking, appendEnquiryEvent } from '../../../lib/supabase';
import { sendBookingCancellation } from '../../../lib/resend';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { invite: inviteToken, booking_id } = body;
    if (!inviteToken || !booking_id) return { status: 400, body: { ok: false, error: 'invite and booking_id required' } };

    const invite = await getInviteByToken(inviteToken);
    if (!invite) return { status: 404, body: { ok: false, error: 'Invalid invite' } };

    const booking = await getBookingByInvite(invite.id);
    if (!booking || booking.id !== booking_id) return { status: 404, body: { ok: false, error: 'Booking not found for invite' } };

    const cancelled = await cancelBooking(booking_id);
    // append event
    try { await appendEnquiryEvent(invite.enquiry_id, { type: 'booking_cancelled', booking_id, at: new Date().toISOString() }); } catch (err) { console.error('append event failed', err); }

    // send cancel email if configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      try {
        const html = `<p>Hello,</p><p>Your booking for <strong>${cancelled.session_date}</strong> has been cancelled and the slot freed for others.</p>`;
        const text = `Your booking for ${cancelled.session_date} has been cancelled.`;
        const res = await sendBookingCancellation({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM, to: cancelled.email || '', date: cancelled.session_date });
        try { await appendEnquiryEvent(invite.enquiry_id, { type: 'booking_cancel_email_sent', booking_id, resend_id: res.id, at: new Date().toISOString(), meta: res.raw }); } catch (err) { console.error('append event failed', err); }
      } catch (err) { console.error('Failed to send cancel email', err); }
    }

    return new Response(JSON.stringify({ ok: true, cancelled }), {

      status: 200,

      headers: { 'Content-Type': 'application/json' }

    });
  } catch (err) {
    console.error('Cancel booking error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
