import { getSupabaseAdmin } from '../../../lib/supabase';

export async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const token = request.headers.get('x-admin-token') || '';
    if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) return { status: 401, body: { ok: false, error: 'Unauthorized' } };

    const client = getSupabaseAdmin(env);
    const { data, error } = await client.from('enquiries').select('*, invites(*), bookings(*)').order('created_at', { ascending: false }).limit(200);
    if (error) return { status: 500, body: { ok: false, error: error.message } };
    return new Response(JSON.stringify({ ok: true, enquiries: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Admin enquiries error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
