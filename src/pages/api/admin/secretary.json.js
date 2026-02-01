import { getSupabaseAdmin } from '../../../lib/supabase';
import { ensureAdmin } from '../../../lib/admin-auth';

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);

    const auth = await ensureAdmin(request, locals);
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const body = await request.json();
    if (!body || !body.email) return new Response(JSON.stringify({ ok: false, error: 'Email required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

    const client = getSupabaseAdmin(env);
    const { data, error } = await client.from('secretaries').insert([{ email: body.email.toLowerCase(), display_name: body.display_name || null }]).select().single();
    if (error) return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
