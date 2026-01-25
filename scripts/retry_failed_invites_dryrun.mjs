#!/usr/bin/env node
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// If a .env file exists, load it safely into process.env (simple parser)
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
    // Only set if not already present in process.env
    if (!process.env[key]) process.env[key] = val;
  }
} catch (e) {
  // ignore if no .env
}

const MAX_RETRIES = parseInt(process.env.MAX_INVITE_RETRIES || '3', 10);
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(2);
}
if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
  console.error('RESEND_API_KEY and RESEND_FROM must be set for dry-run');
  process.exit(2);
}
if (!process.env.RESEND_DRY_RUN) {
  console.error('Set RESEND_DRY_RUN=1 to run in dry-run mode');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('Looking for failed invites with attempts <', MAX_RETRIES);
  const { data, error } = await supabase.from('invites').select('*').or(`status.eq.failed,status.eq.pending`).limit(50);
  if (error) {
    console.error('Failed to query invites', error);
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.log('No invites to retry');
    return;
  }

  const pendingInvites = (data || []).filter(inv => (inv.send_attempts || 0) < MAX_RETRIES);
  if (pendingInvites.length === 0) {
    console.log('No invites under retry limit');
    return;
  }

  for (const invite of pendingInvites) {
    try {
      const { data: enquiry } = await supabase.from('enquiries').select('*').eq('id', invite.enquiry_id).maybeSingle();
      if (!enquiry) { console.warn('Enquiry missing for invite', invite.id); continue; }
      const inviteUrl = `${process.env.SITE_BASE_URL || 'http://localhost:3000'}/bookings?invite=${encodeURIComponent(invite.token)}`;

      console.log('Dry-run sending invite', invite.id, 'to', enquiry.email, 'attempt', (invite.send_attempts || 0) + 1);
      // Append a dry-run event to enquiries.events column (do not mark invite sent)
      try {
        const { data: cur } = await supabase.from('enquiries').select('events').eq('id', enquiry.id).maybeSingle();
        const events = (cur && cur.events) ? cur.events : [];
        events.push({ type: 'invite_send_dry_run', invite_id: invite.id, to: enquiry.email, at: new Date().toISOString(), meta: { inviteUrl } });
        await supabase.from('enquiries').update({ events }).eq('id', enquiry.id);
        console.log('Appended invite_send_dry_run for enquiry', enquiry.id);
      } catch (e) {
        console.error('Failed appending dry-run event for enquiry', enquiry.id, e);
      }

    } catch (err) {
      console.error('Dry-run retry failed for invite', invite.id, err);
    }
  }
}

run().catch((err) => { console.error('Dry-run Retry script failed', err); process.exit(1); });
