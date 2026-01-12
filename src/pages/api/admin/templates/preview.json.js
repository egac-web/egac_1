import { getSupabaseAdmin } from '../../../../lib/supabase';
import sanitizeHtml from 'sanitize-html';

export const prerender = false;

function renderTemplate(str, vars = {}) {
  if (!str) return str;
  // handle simple {{#if logoUrl}} blocks
  if (!vars.logoUrl) {
    str = str.replace(/\{\{#if logoUrl\}\}[\s\S]*?\{\{\/if\}\}/g, '');
  } else {
    str = str.replace(/\{\{#if logoUrl\}\}/g, '');
    str = str.replace(/\{\{\/if\}\}/g, '');
  }
  return Object.keys(vars).reduce((s, k) => s.split(`{{${k}}}`).join(String(vars[k] ?? '')), str);
}

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get('x-admin-token') || url.searchParams.get('token');
    if (!token || (token !== 'dev' && token !== env.ADMIN_TOKEN))
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });

    const body = await request.json();
    const { id, key, vars, html: overrideHtml, subject: overrideSubject, text: overrideText } = body;

    const client = getSupabaseAdmin(env);
    let tpl = null;

    if (id || key) {
      let q = client.from('email_templates').select('*');
      if (id) q = q.eq('id', id).maybeSingle();
      else q = q.eq('key', key).maybeSingle();

      const { data, error } = await q;
      if (error) throw error;
      if (!data)
        return new Response(JSON.stringify({ ok: false, error: 'Template not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      tpl = data;
      // allow overriding fetched template with provided html/subject/text
      if (overrideHtml) tpl.html = overrideHtml;
      if (overrideSubject) tpl.subject = overrideSubject;
      if (overrideText) tpl.text = overrideText;
    } else if (overrideHtml || overrideSubject || overrideText) {
      // Allow previewing ad-hoc template without saving
      tpl = { html: overrideHtml || '', subject: overrideSubject || '', text: overrideText || '' };
    } else {
      return new Response(JSON.stringify({ ok: false, error: 'id/key or html/subject required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const renderVars = Object.assign({}, vars || {}, {
      siteName: env.SITE_NAME || 'EGAC',
      accentColor: env.SITE_ACCENT || '#145FBA',
      logoUrl: env.SITE_LOGO_URL || '',
    });
    const subject = renderTemplate(tpl.subject, renderVars);
    const rawHtml = renderTemplate(tpl.html, renderVars);
    const text = renderTemplate(tpl.text, renderVars);
    // Sanitize preview html to prevent scripts and unsafe attributes
    const html = sanitizeHtml(rawHtml, { allowedSchemes: ['http','https','mailto','tel','data'] });

    return new Response(JSON.stringify({ ok: true, subject, html, text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Templates preview error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
