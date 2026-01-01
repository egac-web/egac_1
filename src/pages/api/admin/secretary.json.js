import { getSupabaseAdmin } from '../../../lib/supabase';

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const token = request.headers.get('x-admin-token') || '';
    if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) return { status: 401, body: { ok: false, error: 'Unauthorized' } };

    const body = await request.json();
    if (!body || !body.email) return { status: 400, body: { ok: false, error: 'Email required' } };

    const client = getSupabaseAdmin(env);
    const { data, error } = await client.from('secretaries').insert([{ email: body.email.toLowerCase(), display_name: body.display_name || null }]).select().single();
    if (error) return { status: 500, body: { ok: false, error: error.message } };
    return new Response(JSON.stringify({ ok: true, secretary: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Create secretary error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
