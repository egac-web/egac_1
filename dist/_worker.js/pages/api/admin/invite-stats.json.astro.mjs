globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as getSupabaseAdmin } from '../../../chunks/supabase_ymhKQ2x1.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BTUeEnL1.mjs';

async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const adminToken = request.headers.get("x-admin-token") || url.searchParams.get("token") || "";
    const isAdminAuth = adminToken === "dev" || env.ADMIN_TOKEN && adminToken === env.ADMIN_TOKEN;
    if (!isAdminAuth) {
      const url2 = new URL(request.url);
      const secretHeader = request.headers.get("x-cron-secret");
      const secretParam = url2.searchParams.get("secret");
      const secret = secretHeader || secretParam;
      if (!env.CRON_SECRET || !secret || secret !== env.CRON_SECRET) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }
    }
    const client = getSupabaseAdmin(env);
    const [{ data: pending }, { data: failed }, { data: sent }] = await Promise.all([
      client.from("invites").select("id", { count: "exact", head: true }).eq("status", "pending"),
      client.from("invites").select("id", { count: "exact", head: true }).eq("status", "failed"),
      client.from("invites").select("id", { count: "exact", head: true }).eq("status", "sent")
    ]);
    return new Response(JSON.stringify({ ok: true, counts: { pending: pending?.count || 0, failed: failed?.count || 0, sent: sent?.count || 0 } }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Invite stats error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
