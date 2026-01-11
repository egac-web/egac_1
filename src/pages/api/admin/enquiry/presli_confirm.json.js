import { getSupabaseAdmin, markEnquiryPresliConfirmed, getLatestInviteForEnquiry, createInviteForEnquiry, appendEnquiryEvent, markInviteSent } from '../../../../lib/supabase';
import { sendInviteEmail } from '../../../../lib/resend';

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const token = request.headers.get('x-admin-token') || '';
    const isDev = (env.NODE_ENV === 'development' || env.ENVIRONMENT === 'development') && token === 'dev';
    if (!isDev && (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN)) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });

    const body = await request.json();
    const { enquiry_id, note, send_membership_link } = body || {};
    if (!enquiry_id) return new Response(JSON.stringify({ ok: false, error: 'Missing enquiry_id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

    const client = getSupabaseAdmin(env);
    const { data: enquiry, error: fetchErr } = await client.from('enquiries').select('*').eq('id', enquiry_id).maybeSingle();
    if (fetchErr) return new Response(JSON.stringify({ ok: false, error: fetchErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
    if (!enquiry) return new Response(JSON.stringify({ ok: false, error: 'Enquiry not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });

    // mark presli confirmed and store note
    const updatedEnquiry = await markEnquiryPresliConfirmed(enquiry_id, note || null, env);
    const event = { type: 'presli_confirmed', note: note || null, timestamp: new Date().toISOString() };
    await appendEnquiryEvent(enquiry_id, event, env);

    const response = { ok: true, enquiry: updatedEnquiry, event };

    // Optionally create/send membership link
    if (send_membership_link) {
      try {
        // find existing invite or create
        let invite = await getLatestInviteForEnquiry(enquiry_id, env);
        if (!invite) invite = await createInviteForEnquiry(enquiry_id, env);

        const membershipUrl = `${env.SITE_URL || ''}/membership?token=${invite.token}`;
        if (enquiry.email) {
          try {
            const { sendInviteNotification } = await import('../../../../lib/notifications');
            await sendInviteNotification({ enquiryId: enquiry_id, inviteId: invite.id, to: enquiry.email, inviteUrl: membershipUrl, env });
            response.membership_sent = true;
          } catch (err) {
            console.error('sendInviteNotification failed for presli confirm', err);
            response.membership_sent = false;
            response.warning = 'Failed to send membership link';
          }
        } else {
          response.membership_sent = false;
          response.warning = 'No email found for enquiry';
        }
      } catch (err) {
        console.error('Presli confirm membership send error', err);
        response.membership_error = err.message || String(err);
      }
    }

    return { status: 200, body: response };
  } catch (err) {
    console.error('Presli confirm error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}