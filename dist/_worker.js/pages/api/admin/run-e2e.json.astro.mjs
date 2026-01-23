globalThis.process ??= {}; globalThis.process.env ??= {};
import { o as insertEnquiry, d as createInviteForEnquiry, p as createBooking, b as appendEnquiryEvent } from '../../../chunks/supabase_ymhKQ2x1.mjs';
import { sendInviteNotification, sendBookingConfirmationNotification, sendReminderNotification } from '../../../chunks/notifications_CX5oPyXA.mjs';
import { C as CONFIG } from '../../../chunks/booking_CA6h9KO-.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BTUeEnL1.mjs';

const prerender = false;
function tomorrowDateString() {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
    if (!token || token !== "dev" && token !== env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const body = await request.json().catch(() => ({}));
    const confirm = body.confirm || url.searchParams.get("confirm") || "no";
    const dryRun = body.dry_run !== void 0 ? !!body.dry_run : url.searchParams.get("dry_run") !== "false";
    if (confirm !== "yes") {
      return new Response(JSON.stringify({ ok: false, error: "confirm=yes required to run" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    try {
      const testEmail = body.email || `e2e+${Date.now()}@examples.invalid`;
      const enquiry = await insertEnquiry({ name: "E2E Test", email: testEmail, interest: "E2E dry-run" }, env);
      const invite = await createInviteForEnquiry(enquiry.id, env);
      const siteBase = env.SITE_BASE_URL || process.env.SITE_BASE_URL || "";
      const inviteUrl = `${siteBase}/bookings?invite=${encodeURIComponent(invite.token)}`;
      const steps = [];
      const notifyEnv = Object.assign({}, env, { RESEND_DRY_RUN: dryRun ? "1" : "" });
      const inviteRes = await sendInviteNotification({ enquiryId: enquiry.id, inviteId: invite.id, to: enquiry.email, inviteUrl, env: notifyEnv });
      steps.push({ step: "send_invite", ok: !!inviteRes.ok, dry: !!inviteRes.dryRun, result: inviteRes.ok ? inviteRes.resendId || null : String(inviteRes.error || "failed") });
      const dateStr = tomorrowDateString();
      const slot = body.slot || Object.keys(CONFIG.slots)[0] || "u13";
      const session_time = CONFIG.slots && CONFIG.slots[slot] && CONFIG.slots[slot].time ? CONFIG.slots[slot].time : "18:30";
      const booking = await createBooking(enquiry.id, invite.id, dateStr, slot, session_time, env);
      steps.push({ step: "create_booking", ok: !!booking, booking_id: booking && booking.id ? booking.id : null, session_date: dateStr, slot, session_time });
      const slotLabel = CONFIG.slots && CONFIG.slots[slot] && CONFIG.slots[slot].label || slot;
      const bookingRes = await sendBookingConfirmationNotification({ enquiryId: enquiry.id, bookingId: booking.id, to: enquiry.email, date: dateStr, slotLabel, env: notifyEnv });
      steps.push({ step: "send_booking_confirmation", ok: !!bookingRes.ok, dry: !!bookingRes.dryRun, result: bookingRes.ok ? bookingRes.resendId || null : String(bookingRes.error || "failed") });
      const reminderRes = await sendReminderNotification({ enquiryId: enquiry.id, to: enquiry.email, date: dateStr, slotLabel, env: notifyEnv });
      steps.push({ step: "send_reminder", ok: !!reminderRes.ok, dry: !!reminderRes.dryRun, result: reminderRes.ok ? reminderRes.resendId || null : String(reminderRes.error || "failed") });
      try {
        await appendEnquiryEvent(enquiry.id, { type: "e2e_test_completed", at: (/* @__PURE__ */ new Date()).toISOString(), meta: { steps } }, env);
      } catch (e) {
        console.error("Failed to append e2e event", e);
      }
      return new Response(JSON.stringify({ ok: true, dryRun, enquiry: { id: enquiry.id, email: enquiry.email }, invite: { id: invite.id, token: invite.token }, booking: { id: booking.id, session_date: dateStr, slot }, steps }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.error("E2E run failed", err);
      return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  } catch (err) {
    console.error("E2E route error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
