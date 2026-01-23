globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as getInviteByToken, w as getBookingByInvite, x as cancelBooking, b as appendEnquiryEvent } from '../../../chunks/supabase_ymhKQ2x1.mjs';
import { a as sendBookingCancellation } from '../../../chunks/resend_CZA8PHeW.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BTUeEnL1.mjs';

async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const body = await request.json();
    const { invite: inviteToken, booking_id } = body;
    if (!inviteToken || !booking_id) return new Response(JSON.stringify({ ok: false, error: "invite and booking_id required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
    const invite = await getInviteByToken(inviteToken, env);
    if (!invite) return new Response(JSON.stringify({ ok: false, error: "Invalid invite" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
    const booking = await getBookingByInvite(invite.id, env);
    if (!booking || booking.id !== booking_id) return new Response(JSON.stringify({ ok: false, error: "Booking not found for invite" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
    const cancelled = await cancelBooking(booking_id, env);
    try {
      await appendEnquiryEvent(invite.enquiry_id, { type: "booking_cancelled", booking_id, at: (/* @__PURE__ */ new Date()).toISOString() }, env);
    } catch (err) {
      console.error("append event failed", err);
    }
    if (env.RESEND_API_KEY && env.RESEND_FROM) {
      try {
        const html = `<p>Hello,</p><p>Your booking for <strong>${cancelled.session_date}</strong> has been cancelled and the slot freed for others.</p>`;
        const text = `Your booking for ${cancelled.session_date} has been cancelled.`;
        const res = await sendBookingCancellation({ apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM, to: cancelled.email || "", date: cancelled.session_date });
        try {
          await appendEnquiryEvent(invite.enquiry_id, { type: "booking_cancel_email_sent", booking_id, resend_id: res.id, at: (/* @__PURE__ */ new Date()).toISOString(), meta: res.raw }, env);
        } catch (err) {
          console.error("append event failed", err);
        }
      } catch (err) {
        console.error("Failed to send cancel email", err);
      }
    }
    return new Response(JSON.stringify({ ok: true, cancelled }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Cancel booking error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
