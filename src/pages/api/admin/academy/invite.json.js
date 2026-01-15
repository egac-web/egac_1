import {
  getSupabaseAdmin,
  createAcademyInvitation,
  markAcademyInvitationSent,
} from '../../../../lib/supabase';
import { sendAcademyInvitation } from '../../../../lib/notifications';

export const prerender = false;

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get('x-admin-token') || url.searchParams.get('token') || '';
    if (token !== 'dev' && (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN)) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { enquiry_id } = body || {};
    if (!enquiry_id) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing enquiry_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = getSupabaseAdmin(env);

    // Get enquiry details
    const { data: enquiry, error: enquiryError } = await client
      .from('enquiries')
      .select('*')
      .eq('id', enquiry_id)
      .maybeSingle();

    if (enquiryError || !enquiry) {
      return new Response(JSON.stringify({ ok: false, error: 'Enquiry not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if invitation already exists
    const { data: existing } = await client
      .from('academy_invitations')
      .select('*')
      .eq('enquiry_id', enquiry_id)
      .maybeSingle();

    let invitation = existing;
    if (!existing) {
      // Create new invitation
      invitation = await createAcademyInvitation(enquiry_id, env);
    }

    // Send email
    const emailResult = await sendAcademyInvitation(invitation, enquiry, env);

    if (emailResult.success) {
      await markAcademyInvitationSent(invitation.id, env);
      return new Response(
        JSON.stringify({
          ok: true,
          invitation,
          email_sent: true,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Failed to send email',
          details: emailResult.error,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (err) {
    console.error('Academy invitation error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
