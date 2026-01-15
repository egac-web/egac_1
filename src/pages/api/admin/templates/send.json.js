import { getSupabaseAdmin } from '../../../../lib/supabase';
import { sendInviteEmail } from '../../../../lib/resend';
import sanitizeHtml from 'sanitize-html';

export const prerender = false;

function renderTemplate(str, vars = {}) {
  if (!str) return str;
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

    if (!env.RESEND_API_KEY || !env.RESEND_FROM)
      return new Response(JSON.stringify({ ok: false, error: 'Resend not configured' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });

    const body = await request.json();
    const { id, key, to, vars } = body;
    if (!to)
      return new Response(JSON.stringify({ ok: false, error: 'to email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });

    const client = getSupabaseAdmin(env);
    let q = client.from('email_templates').select('*');
    if (id) q = q.eq('id', id).maybeSingle();
    else if (key) q = q.eq('key', key).maybeSingle();
    else
      return new Response(JSON.stringify({ ok: false, error: 'id or key required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });

    const { data: tpl, error } = await q;
    if (error) throw error;
    if (!tpl)
      return new Response(JSON.stringify({ ok: false, error: 'Template not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });

    const renderVars = Object.assign({}, vars || {}, {
      siteName: env.SITE_NAME || 'EGAC',
      accentColor: env.SITE_ACCENT || '#145FBA',
      logoUrl: env.SITE_LOGO_URL || '',
    });
    const subject = renderTemplate(tpl.subject, renderVars);
    const rawHtml = renderTemplate(tpl.html, renderVars);
    const text = renderTemplate(tpl.text, renderVars);
    // Sanitize html before sending
    const html = sanitizeHtml(rawHtml, { allowedSchemes: ['http','https','mailto','tel','data'] });

    // send
    const res = await sendInviteEmail({
      apiKey: env.RESEND_API_KEY,
      from: env.RESEND_FROM,
      to,
      subject,
      html,
      text,
    });
    return new Response(JSON.stringify({ ok: true, resendId: res.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Templates send error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
