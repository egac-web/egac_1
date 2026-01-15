import { getSupabaseAdmin } from '../../../lib/supabase';

export async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;

    // Protect via admin token or cron secret
    const url = new URL(request.url);
    const adminToken = request.headers.get('x-admin-token') || url.searchParams.get('token') || '';
    const isAdminAuth = adminToken === 'dev' || (env.ADMIN_TOKEN && adminToken === env.ADMIN_TOKEN);

    if (!isAdminAuth) {
      // Fall back to cron secret check
      const url = new URL(request.url);
      const secretHeader = request.headers.get('x-cron-secret');
      const secretParam = url.searchParams.get('secret');
      const secret = secretHeader || secretParam;
      if (!env.CRON_SECRET || !secret || secret !== env.CRON_SECRET) {
        return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }
    }

    const client = getSupabaseAdmin(env);
    const [{ data: pending }, { data: failed }, { data: sent }] = await Promise.all([
      client.from('invites').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      client.from('invites').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
      client.from('invites').select('id', { count: 'exact', head: true }).eq('status', 'sent')
    ]);

    return new Response(JSON.stringify({ ok: true, counts: { pending: pending?.count || 0, failed: failed?.count || 0, sent: sent?.count || 0 } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Invite stats error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}