globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as supabase, f as getActiveAgeGroups, h as getSystemConfigAll, i as updateSystemConfig, j as createAgeGroup, k as updateAgeGroup } from '../../../chunks/supabase_BK1iFgLr.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_rSKK_bSn.mjs';

const prerender = false;
async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
    console.debug("Config GET - token present:", !!token, "tokenPreview:", token ? token.substring(0, 4) + "..." : "none");
    console.debug("Config GET - SUPABASE_URL present:", !!env.SUPABASE_URL, "SERVICE_ROLE present:", !!env.SUPABASE_SERVICE_ROLE_KEY);
    if (!token || token !== "dev" && token !== env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Config GET missing Supabase env vars - SUPABASE_URL:", !!env.SUPABASE_URL, "SERVICE_ROLE:", !!env.SUPABASE_SERVICE_ROLE_KEY);
      return new Response(JSON.stringify({ ok: false, error: "Missing Supabase credentials (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.debug("Config GET - supabase exports:", Object.keys(supabase).join(", "));
    console.debug("Config GET - getActiveAgeGroups type:", typeof getActiveAgeGroups, "getSystemConfigAll type:", typeof getSystemConfigAll);
    const ageGroups = await getActiveAgeGroups(env);
    const systemConfig = await getSystemConfigAll(env);
    return new Response(
      JSON.stringify({ ok: true, ageGroups: ageGroups || [], systemConfig: systemConfig || {} }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    console.error("Config GET error", err && err.stack ? err.stack : err);
    const urlDbg = new URL(request.url);
    const requestToken = request.headers.get("x-admin-token") || urlDbg.searchParams.get("token");
    if (requestToken === "dev") {
      return new Response(JSON.stringify({ ok: false, error: String(err && err.message ? err.message : "Server error") }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
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
    const token = request.headers.get("x-admin-token") || url.searchParams.get("token");
    if (!token || token !== "dev" && token !== env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const { action } = body;
    if (action === "update_system") {
      let updates = {};
      if (body.academy_max_age !== void 0) updates.academy_max_age = body.academy_max_age;
      if (body.weeks_ahead_booking !== void 0)
        updates.weeks_ahead_booking = body.weeks_ahead_booking;
      for (const k of Object.keys(updates)) {
        await updateSystemConfig(k, String(updates[k]), env);
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (action === "create_age_group") {
      const { code, label, min_age, max_age, session_day, session_time, capacity } = body;
      if (!code || !label || min_age === void 0 || !session_day || !session_time) {
        return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      const newAgeGroup = await createAgeGroup(
        {
          code,
          label,
          min_age,
          max_age: max_age || null,
          session_day,
          session_time,
          capacity: capacity || 2,
          active: true
        },
        env
      );
      return new Response(JSON.stringify({ ok: true, ageGroup: newAgeGroup }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (action === "update_age_group") {
      const { id, code, label, min_age, max_age, session_day, session_time, capacity, active } = body;
      if (!id) {
        return new Response(JSON.stringify({ ok: false, error: "Age group ID required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      let updates = {};
      if (code !== void 0) updates.code = code;
      if (label !== void 0) updates.label = label;
      if (min_age !== void 0) updates.min_age = min_age;
      if (max_age !== void 0) updates.max_age = max_age;
      if (session_day !== void 0) updates.session_day = session_day;
      if (session_time !== void 0) updates.session_time = session_time;
      if (capacity !== void 0) updates.capacity = capacity;
      if (active !== void 0) updates.active = active;
      await updateAgeGroup(id, updates, env);
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
    console.error("Config POST error", err && err.stack ? err.stack : err);
    const urlDbg = new URL(request.url);
    const requestToken = request.headers.get("x-admin-token") || urlDbg.searchParams.get("token");
    if (requestToken === "dev") {
      return new Response(JSON.stringify({ ok: false, error: String(err && err.message ? err.message : "Server error") }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
