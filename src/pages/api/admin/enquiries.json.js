import { getSupabaseAdmin } from '../../../lib/supabase';

export async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get('x-admin-token') || url.searchParams.get('token') || '';
    // Allow 'dev' token in development OR match ADMIN_TOKEN
    if (token !== 'dev' && (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN)) {
      console.warn('Unauthorized admin request to /api/admin/enquiries.json - token present:', !!token, 'tokenPreview:', token ? token.substring(0, 4) + '...' : 'none');
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = getSupabaseAdmin(env);
    // Avoid embedding relationships (can fail with ambiguous relationships).
    const { data: enquiries, error: e1 } = await client
      .from('enquiries')
      .select('id, name, email, dob, note, events, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (e1) {
      console.error('Enquiries fetch error', e1);
      return new Response(JSON.stringify({ ok: false, error: e1.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ids = (enquiries || []).map((q) => q.id).filter(Boolean);
    let invites = [];
    let bookings = [];

    if (ids.length > 0) {
      const [invRes, bookRes] = await Promise.all([
        client.from('invites').select('*').in('enquiry_id', ids),
        client.from('bookings').select('*').in('enquiry_id', ids),
      ]);
      if (invRes.error) console.error('Invites fetch error', invRes.error);
      if (bookRes.error) console.error('Bookings fetch error', bookRes.error);
      invites = invRes.data || [];
      bookings = bookRes.data || [];
    }

    const enquiriesWithRelations = (enquiries || []).map((enq) => ({
      ...enq,
      invites: invites.filter((i) => i.enquiry_id === enq.id),
      bookings: bookings.filter((b) => b.enquiry_id === enq.id),
    }));

    return new Response(JSON.stringify({ ok: true, enquiries: enquiriesWithRelations }), {
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
