globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as getSupabaseAdmin } from '../../../chunks/supabase_BK1iFgLr.mjs';
import { sendReminderNotification } from '../../../chunks/notifications_DQEtDqdD.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_rSKK_bSn.mjs';

async function runReminderLogic(env) {
  const client = getSupabaseAdmin(env);
  const tomorrow = /* @__PURE__ */ new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().slice(0, 10);
  const { data: bookings, error } = await client.from("bookings").select("*").eq("session_date", dateStr).neq("status", "cancelled").eq("reminder_sent", false).limit(200);
  if (error) throw error;
  const results = [];
  for (const b of bookings) {
    try {
      const { data: enq } = await client.from("enquiries").select("*").eq("id", b.enquiry_id).maybeSingle();
      if (!enq) {
        results.push({ booking_id: b.id, ok: false, error: "Enquiry missing" });
        continue;
      }
      const res = await sendReminderNotification({ enquiryId: enq.id, to: enq.email, date: b.session_date, slotLabel: env && env.CONFIG && env.CONFIG.slots && env.CONFIG.slots[b.slot] ? env.CONFIG.slots[b.slot].label : b.slot, env });
      if (res.ok) {
        await client.from("bookings").update({ reminder_sent: true }).eq("id", b.id);
        results.push({ booking_id: b.id, ok: true, resend_id: res.resendId || null });
      } else {
        results.push({ booking_id: b.id, ok: false, error: String(res.error || "send_failed") });
      }
    } catch (err) {
      results.push({ booking_id: b.id, ok: false, error: String(err) });
    }
  }
  return results;
}
async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");
    if (!env.CRON_SECRET || !secret || secret !== env.CRON_SECRET) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const results = await runReminderLogic(env);
    return new Response(JSON.stringify({ ok: true, processed: results.length, results }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Send reminders error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
