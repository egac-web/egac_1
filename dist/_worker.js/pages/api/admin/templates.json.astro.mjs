globalThis.process ??= {}; globalThis.process.env ??= {};
import { q as listEmailTemplates, r as createEmailTemplate, t as updateEmailTemplate } from '../../../chunks/supabase_BK1iFgLr.mjs';
import { s as sanitizeHtml } from '../../../chunks/index_BGcPWSb4.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_rSKK_bSn.mjs';

const prerender = false;
async function GET({ request, locals }) {
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
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Templates GET missing Supabase env vars - SUPABASE_URL:", !!env.SUPABASE_URL, "SERVICE_ROLE:", !!env.SUPABASE_SERVICE_ROLE_KEY);
      return new Response(JSON.stringify({ ok: false, error: "Missing Supabase credentials (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const templates = await listEmailTemplates(env);
    return new Response(JSON.stringify({ ok: true, templates }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Templates GET error", err && err.stack ? err.stack : err);
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
    if (action === "create_template") {
      const { key, language, subject, html, text, active } = body;
      if (!key || !subject || !html || !text)
        return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      const safeHtml = sanitizeHtml(html, { allowedSchemes: ["http", "https", "mailto", "tel"] });
      const safeText = sanitizeHtml(safeHtml, { allowedTags: [] });
      const tpl = await createEmailTemplate(
        {
          key,
          language: language || "en",
          subject,
          html: safeHtml,
          text: text || safeText,
          active: active !== void 0 ? !!active : true
        },
        env
      );
      return new Response(JSON.stringify({ ok: true, template: tpl }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (action === "update_template") {
      const { id, subject, html, text, language, active } = body;
      if (!id)
        return new Response(JSON.stringify({ ok: false, error: "Template ID required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      const updates = {};
      if (subject !== void 0) updates.subject = subject;
      if (html !== void 0) updates.html = sanitizeHtml(html, { allowedSchemes: ["http", "https", "mailto", "tel"] });
      if (text !== void 0) updates.text = text;
      if (language !== void 0) updates.language = language;
      if (active !== void 0) updates.active = active;
      if (updates.html && !updates.text) {
        updates.text = sanitizeHtml(updates.html, { allowedTags: [] });
      }
      const tpl = await updateEmailTemplate(id, updates, env);
      return new Response(JSON.stringify({ ok: true, template: tpl }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ ok: false, error: "Unknown action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Templates POST error", err);
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
