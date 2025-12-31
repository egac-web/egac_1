globalThis.process ??= {}; globalThis.process.env ??= {};
import { getSupabaseAdmin } from '../../../chunks/supabase_BuGpVBnm.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_KnGPrR4n.mjs';

async function get({ request }) {
  try {
    const token = request.headers.get("x-admin-token") || "";
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return { status: 401, body: { ok: false, error: "Unauthorized" } };
    const client = getSupabaseAdmin();
    const { data, error } = await client.from("enquiries").select("*, invites(*), bookings(*)").order("created_at", { ascending: false }).limit(200);
    if (error) return { status: 500, body: { ok: false, error: error.message } };
    return { status: 200, body: { ok: true, enquiries: data } };
  } catch (err) {
    console.error("Admin enquiries error", err);
    return { status: 500, body: { ok: false, error: "Server error" } };
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
