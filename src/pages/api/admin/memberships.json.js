import { getSupabaseAdmin } from '../../../lib/supabase';
import { getRecentMembers } from '../../../lib/supabase';

export async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const auth = await import('../../../lib/admin-auth').then(m => m.ensureAdmin(request, locals));
    if (!auth.ok) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const members = await getRecentMembers(200, env);
    // Fetch related enquiries if present
    const client = getSupabaseAdmin(env);
    const enquiryIds = members.map(m => m.enquiry_id).filter(Boolean);
    let enquiries = [];
    if (enquiryIds.length) {
      const { data, error } = await client.from('enquiries').select('*').in('id', enquiryIds);
      if (error) console.error('Could not load enquiries for memberships', error);
      enquiries = data || [];
    }

    const map = new Map(enquiries.map(e => [e.id, e]));
    const membersWithEnquiry = members.map(m => ({ ...m, enquiry: m.enquiry_id ? map.get(m.enquiry_id) : null }));

    return new Response(JSON.stringify({ ok: true, members: membersWithEnquiry }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/admin/memberships error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}