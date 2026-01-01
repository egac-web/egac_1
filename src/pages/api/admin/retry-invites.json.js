import { getSupabaseAdmin } from '../../../src/lib/supabase';
import { sendInviteEmail } from '../../../src/lib/resend';

async function runRetryLogic(env) {
  const MAX_RETRIES = Number(env.MAX_INVITE_RETRIES || 3);
  const client = getSupabaseAdmin(env);

  const { data: invites, error } = await client.from('invites').select('*').or(`status.eq.failed,status.eq.pending`).lt('send_attempts', MAX_RETRIES).limit(100);
  if (error) throw error;

  const results = [];
  for (const invite of invites) {
    try {
      const { data: enquiry } = await client.from('enquiries').select('*').eq('id', invite.enquiry_id).maybeSingle();
      if (!enquiry) {
        results.push({ invite_id: invite.id, ok: false, error: 'Enquiry missing' });
        continue;
      }

      const inviteUrl = `${env.SITE_BASE_URL || ''}/booking?invite=${encodeURIComponent(invite.token)}`;
      const subject = 'EGAC: Book a taster / session';
      const html = `<p>Hello,</p><p>Thanks for your enquiry. To book a free taster, please follow this link:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p><p>If you did not request this, ignore this email.</p>`;
      const text = `Book here: ${inviteUrl}`;

      const res = await sendInviteEmail({ apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM, to: enquiry.email, subject, html, text });

      // Append event
      const { data: cur } = await client.from('enquiries').select('events').eq('id', enquiry.id).maybeSingle();
      const events = (cur && cur.events) ? cur.events : [];
      events.push({ type: 'invite_sent', invite_id: invite.id, resend_id: res.id, at: new Date().toISOString(), meta: res.raw });
      await client.from('enquiries').update({ events }).eq('id', enquiry.id);

      await client.from('invites').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', invite.id);
      results.push({ invite_id: invite.id, ok: true, resend_id: res.id });
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