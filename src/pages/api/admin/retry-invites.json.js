import { getSupabaseAdmin } from '../../../lib/supabase';
import { sendInviteEmail } from '../../../lib/resend';

async function runRetryLogic(env) {
  const MAX_RETRIES = Number(env.MAX_INVITE_RETRIES || 3);
  const client = getSupabaseAdmin(env);

  const { data: invites, error } = await client.from('invites').select('*').or(`status.eq.failed,status.eq.pending`).limit(100);
  if (error) throw error;

  // Backwards compatible: some installs may not have the `send_attempts` column.
  // Treat missing `send_attempts` as 0 and filter out invites which already exceeded retries.
  const pendingInvites = (invites || []).filter(inv => (inv.send_attempts || 0) < MAX_RETRIES);

  const results = [];
  for (const invite of invites) {
    try {
      const { data: enquiry } = await client.from('enquiries').select('*').eq('id', invite.enquiry_id).maybeSingle();
      if (!enquiry) {
        results.push({ invite_id: invite.id, ok: false, error: 'Enquiry missing' });
        continue;
      }

      const inviteUrl = `${env.SITE_BASE_URL || ''}/bookings?invite=${encodeURIComponent(invite.token)}`;

      // Use the centralized notifications helper which respects RESEND_DRY_RUN and handles
      // DB event logging and invite status updates (markInviteSent/markInviteSendFailed)
      const { sendInviteNotification } = await import('../../../lib/notifications');
      const notifyRes = await sendInviteNotification({ enquiryId: enquiry.id, inviteId: invite.id, to: enquiry.email, inviteUrl, env });

      if (notifyRes.ok) {
        results.push({ invite_id: invite.id, ok: true, resend_id: notifyRes.resendId || null, dryRun: !!notifyRes.dryRun });
      } else {
        results.push({ invite_id: invite.id, ok: false, error: String(notifyRes.error || 'send_failed') });
      }
    } catch (err) {
      // increment attempts and record error
      const attempts = (invite.send_attempts || 0) + 1;
      await client.from('invites').update({ send_attempts: attempts, last_send_error: (err && err.response) ? JSON.stringify(err.response) : String(err), status: 'failed' }).eq('id', invite.id);
      results.push({ invite_id: invite.id, ok: false, error: String(err) });
    }
  }
  return results;
}

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;

    // Protect this endpoint via CRON_SECRET header or query param
    const url = new URL(request.url);
    const secretHeader = request.headers.get('x-cron-secret');
    const secretParam = url.searchParams.get('secret');
    const secret = secretHeader || secretParam;
    if (!env.CRON_SECRET || !secret || secret !== env.CRON_SECRET) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const results = await runRetryLogic(env);
    return new Response(JSON.stringify({ ok: true, processed: results.length, results }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Retry invites endpoint error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;

    // Protect via query param (safer for cross-site cron triggers which may block POST)
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');
    if (!env.CRON_SECRET || !secret || secret !== env.CRON_SECRET) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const results = await runRetryLogic(env);
    return new Response(JSON.stringify({ ok: true, processed: results.length, results }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Retry invites endpoint error (GET)', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}