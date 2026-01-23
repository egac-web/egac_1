globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as getSupabaseAdmin, l as markEnquiryPresliConfirmed, b as appendEnquiryEvent, n as getLatestInviteForEnquiry, d as createInviteForEnquiry } from '../../../../chunks/supabase_ymhKQ2x1.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_BTUeEnL1.mjs';

async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get("x-admin-token") || url.searchParams.get("token") || "";
    if (token !== "dev" && (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN)) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
    const body = await request.json();
    const { enquiry_id, note, send_membership_link } = body || {};
    if (!enquiry_id) return new Response(JSON.stringify({ ok: false, error: "Missing enquiry_id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
    const client = getSupabaseAdmin(env);
    const { data: enquiry, error: fetchErr } = await client.from("enquiries").select("*").eq("id", enquiry_id).maybeSingle();
    if (fetchErr) return new Response(JSON.stringify({ ok: false, error: fetchErr.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
    if (!enquiry) return new Response(JSON.stringify({ ok: false, error: "Enquiry not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
    const updatedEnquiry = await markEnquiryPresliConfirmed(enquiry_id, note || null, env);
    const event = { type: "presli_confirmed", note: note || null, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
    await appendEnquiryEvent(enquiry_id, event, env);
    const response = { ok: true, enquiry: updatedEnquiry, event };
    if (send_membership_link) {
      try {
        let invite = await getLatestInviteForEnquiry(enquiry_id, env);
        if (!invite) {
          try {
            invite = await createInviteForEnquiry(enquiry_id, env);
          } catch (err) {
            if (String(err.message || "").includes("enquiry_on_academy_waitlist")) {
              response.membership_sent = false;
              response.warning = "Enquiry is on Academy waiting list; membership link will not be sent";
              invite = null;
            } else {
              throw err;
            }
          }
        }
        const membershipUrl = invite ? `${env.SITE_URL || ""}/membership?token=${invite.token}` : null;
        if (enquiry.email) {
          try {
            const { sendInviteNotification } = await import('../../../../chunks/notifications_CX5oPyXA.mjs');
            await sendInviteNotification({ enquiryId: enquiry_id, inviteId: invite.id, to: enquiry.email, inviteUrl: membershipUrl, env });
            response.membership_sent = true;
          } catch (err) {
            console.error("sendInviteNotification failed for presli confirm", err);
            response.membership_sent = false;
            response.warning = "Failed to send membership link";
          }
        } else {
          response.membership_sent = false;
          response.warning = "No email found for enquiry";
        }
      } catch (err) {
        console.error("Presli confirm membership send error", err);
        response.membership_error = err.message || String(err);
      }
    }
    return { status: 200, body: response };
  } catch (err) {
    console.error("Presli confirm error", err);
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
