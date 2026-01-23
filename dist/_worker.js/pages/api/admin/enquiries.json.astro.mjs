globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as getSupabaseAdmin } from '../../../chunks/supabase_ymhKQ2x1.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BTUeEnL1.mjs';

async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get("x-admin-token") || url.searchParams.get("token") || "";
    console.log("admin-token-check", {
      receivedPreview: token ? token.substring(0, 8) + "..." : "none",
      receivedLen: token ? token.length : 0,
      adminPreview: env.ADMIN_TOKEN ? env.ADMIN_TOKEN.substring(0, 8) + "..." : "none",
      adminLen: env.ADMIN_TOKEN ? env.ADMIN_TOKEN.length : 0
    });
    if (token !== "dev" && (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN)) {
      console.warn("Unauthorized admin request to /api/admin/enquiries.json - token present:", !!token, "tokenPreview:", token ? token.substring(0, 4) + "..." : "none");
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const client = getSupabaseAdmin(env);
    const { data: enquiries, error: e1 } = await client.from("enquiries").select("id, name, email, dob, note, events, status, admin_notes, created_at").order("created_at", { ascending: false }).limit(200);
    if (e1) {
      console.error("Enquiries fetch error", e1);
      return new Response(JSON.stringify({ ok: false, error: e1.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const ids = (enquiries || []).map((q) => q.id).filter(Boolean);
    let invites = [];
    let bookings = [];
    if (ids.length > 0) {
      const [invRes, bookRes] = await Promise.all([
        client.from("invites").select("*").in("enquiry_id", ids),
        client.from("bookings").select("*").in("enquiry_id", ids)
      ]);
      if (invRes.error) console.error("Invites fetch error", invRes.error);
      if (bookRes.error) console.error("Bookings fetch error", bookRes.error);
      invites = invRes.data || [];
      bookings = bookRes.data || [];
    }
    const enquiriesWithRelations = (enquiries || []).map((enq) => ({
      ...enq,
      invites: invites.filter((i) => i.enquiry_id === enq.id),
      bookings: bookings.filter((b) => b.enquiry_id === enq.id)
    }));
    return new Response(JSON.stringify({ ok: true, enquiries: enquiriesWithRelations }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Admin enquiries error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
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
    const { action, enquiry_id, status, admin_notes } = body;
    if (action === "update_status") {
      const client = getSupabaseAdmin(env);
      const updates = {};
      if (status) updates.status = status;
      if (admin_notes !== void 0) updates.admin_notes = admin_notes;
      const { error } = await client.from("enquiries").update(updates).eq("id", enquiry_id);
      if (error) {
        console.error("Update enquiry status error", error);
        return new Response(JSON.stringify({ ok: false, error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ ok: false, error: "Unknown action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Admin enquiries POST error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
