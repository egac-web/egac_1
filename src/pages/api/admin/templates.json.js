import * as supabase from '../../../lib/supabase';
import sanitizeHtml from 'sanitize-html';

export const prerender = false;

export async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);

    const auth = await import('../../../lib/admin-auth').then(m => m.ensureAdmin(request, locals));
    if (!auth.ok) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Ensure Supabase credentials are available before making requests
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Templates GET missing Supabase env vars - SUPABASE_URL:', !!env.SUPABASE_URL, 'SERVICE_ROLE:', !!env.SUPABASE_SERVICE_ROLE_KEY);
      return new Response(JSON.stringify({ ok: false, error: 'Missing Supabase credentials (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const templates = await supabase.listEmailTemplates(env);
    return new Response(JSON.stringify({ ok: true, templates }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Templates GET error', err && err.stack ? err.stack : err);
    const urlDbg = new URL(request.url);
    const requestToken = request.headers.get('x-admin-token') || urlDbg.searchParams.get('token');
    if (requestToken === 'dev') {
      return new Response(JSON.stringify({ ok: false, error: String(err && err.message ? err.message : 'Server error') }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const auth = await import('../../../lib/admin-auth').then(m => m.ensureAdmin(request, locals));
    if (!auth.ok) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'create_template') {
      const { key, language, subject, html, text, active } = body;
      if (!key || !subject || !html || !text)
        return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });

      // Sanitize html before storing
      const safeHtml = sanitizeHtml(html, { allowedSchemes: ['http', 'https', 'mailto', 'tel'] });
      const safeText = sanitizeHtml(safeHtml, { allowedTags: [] });

      const tpl = await supabase.createEmailTemplate(
        {
          key,
          language: language || 'en',
          subject,
          html: safeHtml,
          text: text || safeText,
          active: active !== undefined ? !!active : true,
        },
        env
      );
      return new Response(JSON.stringify({ ok: true, template: tpl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update_template') {
      const { id, subject, html, text, language, active } = body;
      if (!id)
        return new Response(JSON.stringify({ ok: false, error: 'Template ID required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      const updates = {};
      if (subject !== undefined) updates.subject = subject;
      if (html !== undefined) updates.html = sanitizeHtml(html, { allowedSchemes: ['http', 'https', 'mailto', 'tel'] });
      if (text !== undefined) updates.text = text;
      if (language !== undefined) updates.language = language;
      if (active !== undefined) updates.active = active;
      // Ensure text exists when html supplied
      if (updates.html && !updates.text) {
        updates.text = sanitizeHtml(updates.html, { allowedTags: [] });
      }
      const tpl = await supabase.updateEmailTemplate(id, updates, env);
      return new Response(JSON.stringify({ ok: true, template: tpl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Unknown action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Templates POST error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
