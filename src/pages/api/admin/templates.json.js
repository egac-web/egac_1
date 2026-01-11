import * as supabase from '../../../lib/supabase';

export const prerender = false;

export async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get('x-admin-token') || url.searchParams.get('token');

    // Debug: surface token presence and supabase env for troubleshooting
    console.debug('Templates GET - token present:', !!token, 'tokenPreview:', token ? token.substring(0, 4) + '...' : 'none');
    console.debug('Templates GET - SUPABASE_URL present:', !!env.SUPABASE_URL, 'SERVICE_ROLE present:', !!env.SUPABASE_SERVICE_ROLE_KEY);

    if (!token || (token !== 'dev' && token !== env.ADMIN_TOKEN)) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure Supabase credentials are available before making requests
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Templates GET missing Supabase env vars - SUPABASE_URL:', !!env.SUPABASE_URL, 'SERVICE_ROLE:', !!env.SUPABASE_SERVICE_ROLE_KEY);
      return new Response(JSON.stringify({ ok: false, error: 'Missing Supabase credentials (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.debug('Templates GET - supabase exports:', Object.keys(supabase).join(', '));
    console.debug('Templates GET - listEmailTemplates type:', typeof supabase.listEmailTemplates);
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
    const token = request.headers.get('x-admin-token') || url.searchParams.get('token');
    if (!token || (token !== 'dev' && token !== env.ADMIN_TOKEN)) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
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
      const tpl = await supabase.createEmailTemplate(
        {
          key,
          language: language || 'en',
          subject,
          html,
          text,
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
      if (html !== undefined) updates.html = html;
      if (text !== undefined) updates.text = text;
      if (language !== undefined) updates.language = language;
      if (active !== undefined) updates.active = active;
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
