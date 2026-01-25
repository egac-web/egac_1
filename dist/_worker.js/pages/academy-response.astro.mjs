globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, r as renderTemplate } from '../chunks/astro/server_BcA0Y13i.mjs';
import { g as getAcademyInvitationByToken, u as updateAcademyInvitationResponse } from '../chunks/supabase_DDVehETI.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_CjgTivB9.mjs';

const prerender = false;
async function GET({ request, locals, url }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const token = url.searchParams.get("token");
    const response = url.searchParams.get("response");
    if (!token || !response || !["yes", "no"].includes(response)) {
      return new Response(
        `<!doctype html><html><head><title>Invalid Request</title></head><body><h1>Invalid Request</h1><p>Missing or invalid parameters.</p></body></html>`,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }
    const invitation = await getAcademyInvitationByToken(token, env);
    if (!invitation) {
      return new Response(
        `<!doctype html><html><head><title>Invalid Token</title></head><body><h1>Invalid Token</h1><p>This invitation link is not valid.</p></body></html>`,
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }
    if (invitation.response) {
      const previousResponse = invitation.response === "yes" ? "Yes, still interested" : "No longer interested";
      return new Response(
        `<!doctype html><html><head><title>Already Responded</title><style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;text-align:center}h1{color:#145FBA}</style></head><body><h1>✅ Already Responded</h1><p>You have already responded to this invitation with: <strong>${previousResponse}</strong></p><p>If you need to change your response, please contact the membership secretary.</p></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }
    await updateAcademyInvitationResponse(token, response, env);
    const message = response === "yes" ? "✅ Thank you! We have recorded your interest in the EGAC Academy. We will be in touch with more details soon." : "❌ Thank you for letting us know. We have recorded that you are no longer interested.";
    return new Response(
      `<!doctype html><html><head><title>Response Recorded</title><style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;text-align:center}h1{color:#145FBA}.success{background:#dcffe8;border:2px solid #10b981;padding:20px;border-radius:8px;margin:20px 0}</style></head><body><h1>Academy Invitation Response</h1><div class="success"><p style="font-size:18px;margin:0">${message}</p></div><p>You can now close this window.</p></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    console.error("Academy response error", err);
    return new Response(
      `<!doctype html><html><head><title>Error</title></head><body><h1>Error</h1><p>An error occurred processing your response. Please contact the membership secretary.</p></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}
const $$AcademyResponse = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "/home/eddie/athletics/egac_1/src/pages/academy-response.astro", void 0);
const $$file = "/home/eddie/athletics/egac_1/src/pages/academy-response.astro";
const $$url = "/academy-response";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  default: $$AcademyResponse,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
