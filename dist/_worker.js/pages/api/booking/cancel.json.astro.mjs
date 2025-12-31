globalThis.process ??= {}; globalThis.process.env ??= {};
import { getInviteByToken, getBookingByInvite, cancelBooking, appendEnquiryEvent } from '../../../chunks/supabase_BuGpVBnm.mjs';
import { sendBookingCancellation } from '../../../chunks/resend_Cp-fLiGF.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_KnGPrR4n.mjs';

async function post({ request }) {
  try {
    const body = await request.json();
    const { invite: inviteToken, booking_id } = body;
    if (!inviteToken || !booking_id) return { status: 400, body: { ok: false, error: "invite and booking_id required" } };
    const invite = await getInviteByToken(inviteToken);
    if (!invite) return { status: 404, body: { ok: false, error: "Invalid invite" } };
    const booking = await getBookingByInvite(invite.id);
    if (!booking || booking.id !== booking_id) return { status: 404, body: { ok: false, error: "Booking not found for invite" } };
    const cancelled = await cancelBooking(booking_id);
    try {
      await appendEnquiryEvent(invite.enquiry_id, { type: "booking_cancelled", booking_id, at: (/* @__PURE__ */ new Date()).toISOString() });
    } catch (err) {
      console.error("append event failed", err);
    }
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      try {
        const html = `<p>Hello,</p><p>Your booking for <strong>${cancelled.session_date}</strong> has been cancelled and the slot freed for others.</p>`;
        const text = `Your booking for ${cancelled.session_date} has been cancelled.`;
        const res = await sendBookingCancellation({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM, to: cancelled.email || "", date: cancelled.session_date });
        try {
          await appendEnquiryEvent(invite.enquiry_id, { type: "booking_cancel_email_sent", booking_id, resend_id: res.id, at: (/* @__PURE__ */ new Date()).toISOString(), meta: res.raw });
        } catch (err) {
          console.error("append event failed", err);
        }
      } catch (err) {
        console.error("Failed to send cancel email", err);
      }
    }
    return { status: 200, body: { ok: true, cancelled } };
  } catch (err) {
    console.error("Cancel booking error", err);
    return { status: 500, body: { ok: false, error: "Server error" } };
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  post
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
