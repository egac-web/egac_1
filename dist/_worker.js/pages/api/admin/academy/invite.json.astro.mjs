globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as getSupabaseAdmin, c as createAcademyInvitation, m as markAcademyInvitationSent } from '../../../../chunks/supabase_BK1iFgLr.mjs';
import { sendAcademyInvitation } from '../../../../chunks/notifications_DQEtDqdD.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_rSKK_bSn.mjs';

const prerender = false;
async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get("x-admin-token") || url.searchParams.get("token") || "";
    if (token !== "dev" && (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN)) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const { enquiry_id } = body || {};
    if (!enquiry_id) {
      return new Response(JSON.stringify({ ok: false, error: "Missing enquiry_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const client = getSupabaseAdmin(env);
    const { data: enquiry, error: enquiryError } = await client.from("enquiries").select("*").eq("id", enquiry_id).maybeSingle();
    if (enquiryError || !enquiry) {
      return new Response(JSON.stringify({ ok: false, error: "Enquiry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: existing } = await client.from("academy_invitations").select("*").eq("enquiry_id", enquiry_id).maybeSingle();
    let invitation = existing;
    if (!existing) {
      invitation = await createAcademyInvitation(enquiry_id, env);
    }
    const emailResult = await sendAcademyInvitation(invitation, enquiry, env);
    if (emailResult.success) {
      await markAcademyInvitationSent(invitation.id, env);
      return new Response(
        JSON.stringify({
          ok: true,
          invitation,
          email_sent: true
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Failed to send email",
          details: emailResult.error
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  } catch (err) {
    console.error("Academy invitation error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
