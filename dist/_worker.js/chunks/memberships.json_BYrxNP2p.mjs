globalThis.process ??= {}; globalThis.process.env ??= {};
import { p as getRecentMembers, a as getSupabaseAdmin } from './supabase_DDVehETI.mjs';

async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get("x-admin-token") || url.searchParams.get("token") || "";
    if (token !== "dev" && (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN)) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    const members = await getRecentMembers(200, env);
    const client = getSupabaseAdmin(env);
    const enquiryIds = members.map((m) => m.enquiry_id).filter(Boolean);
    let enquiries = [];
    if (enquiryIds.length) {
      const { data, error } = await client.from("enquiries").select("*").in("id", enquiryIds);
      if (error) console.error("Could not load enquiries for memberships", error);
      enquiries = data || [];
    }
    const map = new Map(enquiries.map((e) => [e.id, e]));
    const membersWithEnquiry = members.map((m) => ({ ...m, enquiry: m.enquiry_id ? map.get(m.enquiry_id) : null }));
    return new Response(JSON.stringify({ ok: true, members: membersWithEnquiry }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("GET /api/admin/memberships error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

export { GET as G, _page as _ };
