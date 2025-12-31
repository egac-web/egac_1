globalThis.process ??= {}; globalThis.process.env ??= {};
import { getSupabaseAdmin } from '../../../chunks/supabase_BuGpVBnm.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_KnGPrR4n.mjs';

async function post({ request }) {
  try {
    const token = request.headers.get("x-admin-token") || "";
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return { status: 401, body: { ok: false, error: "Unauthorized" } };
    const body = await request.json();
    if (!body || !body.email) return { status: 400, body: { ok: false, error: "Email required" } };
    const client = getSupabaseAdmin();
    const { data, error } = await client.from("secretaries").insert([{ email: body.email.toLowerCase(), display_name: body.display_name || null }]).select().single();
    if (error) return { status: 500, body: { ok: false, error: error.message } };
    return { status: 200, body: { ok: true, secretary: data } };
  } catch (err) {
    console.error("Create secretary error", err);
    return { status: 500, body: { ok: false, error: "Server error" } };
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  post
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
