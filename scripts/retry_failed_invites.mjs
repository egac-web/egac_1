import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Simple inline Resend helper to avoid importing compiled TS modules when running scripts
async function sendViaResend({ apiKey, from, to, subject, html, text }) {
  if (!apiKey) throw new Error('Missing Resend API key');
  const payload = { from, to, subject, html, text };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error('Resend API error');
    err.response = json;
    throw err;
  }
  return { id: json?.id, status: 'sent', raw: json };
}


// Safe loader for .env (simple parser) so scripts can be run locally without exporting everything
try {
  const envText = fs.readFileSync('.env', 'utf8');
  for (const rawLine of envText.split(/\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
} catch (e) {
  // ignore if no .env present
}

// Retry failed invites (up to MAX_RETRIES)
// Usage: LIMIT_INVITES=1 node scripts/retry_failed_invites.mjs

const MAX_RETRIES = parseInt(process.env.MAX_INVITE_RETRIES || '3', 10);
const LIMIT_INVITES = process.env.LIMIT_INVITES ? parseInt(process.env.LIMIT_INVITES, 10) : null;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(2);
}
if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
  console.error('RESEND_API_KEY and RESEND_FROM must be set');
  process.exit(2);
}
if (!LIMIT_INVITES) {
  console.error('Set LIMIT_INVITES=<n> to limit number of invites to send (safety check)');
  process.exit(2);
}

async function run() {
  console.log('Looking for failed invites with attempts <', MAX_RETRIES, 'limit', LIMIT_INVITES);
  let query = supabase.from('invites').select('*').or(`status.eq.failed,status.eq.pending`).lt('send_attempts', MAX_RETRIES);
  if (LIMIT_INVITES) query = query.limit(LIMIT_INVITES);
  const { data, error } = await query;
  if (error) {
    console.error('Failed to query invites', error);
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.log('No invites to retry');
    return;
  }
  for (const invite of data) {
    try {
      const { data: enquiry } = await supabase.from('enquiries').select('*').eq('id', invite.enquiry_id).maybeSingle();
      if (!enquiry) { console.warn('Enquiry missing for invite', invite.id); continue; }
      const inviteUrl = `${process.env.SITE_BASE_URL || 'http://localhost:3000'}/bookings?invite=${encodeURIComponent(invite.token)}`;
      const subject = 'EGAC: Book a taster / session';
      const html = `<p>Hello,</p><p>Thanks for your enquiry. To book a free taster, please follow this link:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p><p>If you did not request this, ignore this email.</p>`;
      const text = `Book here: ${inviteUrl}`;

      console.log('Sending invite', invite.id, 'to', enquiry.email, 'attempt', (invite.send_attempts || 0) + 1);
      const res = await sendViaResend({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM, to: enquiry.email, subject, html, text });
      // Append event and mark invite sent
      const { data: cur } = await supabase.from('enquiries').select('events').eq('id', enquiry.id).maybeSingle();
      const events = (cur && cur.events) ? cur.events : [];
      events.push({ type: 'invite_sent', invite_id: invite.id, resend_id: res.id, at: new Date().toISOString(), meta: res.raw });
      await supabase.from('enquiries').update({ events }).eq('id', enquiry.id);
      await supabase.from('invites').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', invite.id);
      console.log('Invite resent successfully', invite.id, 'resend_id', res.id);
    } catch (err) {
      console.error('Retry failed for invite', invite.id, err);
      // increment attempt count and set failed
      const attempts = (invite.send_attempts || 0) + 1;
      await supabase.from('invites').update({ send_attempts: attempts, last_send_error: (err && err.response) ? JSON.stringify(err.response) : String(err), status: 'failed' }).eq('id', invite.id);
    }
  }
}

run().catch((err) => { console.error('Retry script failed', err); process.exit(1); });
