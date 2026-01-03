#!/usr/bin/env node
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load .env if present
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
} catch (e) { }

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(2);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const LIMIT = parseInt(process.env.INSPECT_LIMIT || '10', 10);

async function inspect() {
  console.log('Fetching recent invites (limit', LIMIT, ')');
  const { data: invites, error } = await supabase.from('invites').select('*').order('created_at', { ascending: false }).limit(LIMIT);
  if (error) { console.error('Failed to query invites', error); process.exit(1); }
  for (const inv of invites) {
    console.log('---');
    console.log('Invite:', inv.id, 'status:', inv.status, 'send_attempts:', inv.send_attempts || 0, 'sent_at:', inv.sent_at || 'n/a');
    console.log('Enquiry ID:', inv.enquiry_id, 'email token:', inv.token?.slice(0, 8) + '...');

    const { data: enquiry } = await supabase.from('enquiries').select('id, email, events').eq('id', inv.enquiry_id).maybeSingle();
    if (!enquiry) { console.log('Enquiry not found'); continue; }
    console.log('Enquiry email:', enquiry.email);
    const events = enquiry.events || [];
    const inviteEvents = events.filter(e => e.type && e.type.includes('invite'));
    console.log('Invite-related events:', inviteEvents.map(e => ({ type: e.type, at: e.at, resend_id: e.resend_id })));
    const sentEvent = inviteEvents.find(e => e.type === 'invite_sent');
    const resendId = sentEvent?.resend_id || null;
    if (resendId && RESEND_API_KEY) {
      try {
        const resp = await fetch(`https://api.resend.com/emails/${resendId}`, { headers: { Authorization: `Bearer ${RESEND_API_KEY}` } });
        const json = await resp.json().catch(() => null);
        console.log('Resend message info:', json ? { id: json.id, status: json.status } : 'no-json');
      } catch (e) {
        console.error('Failed fetching Resend message info', e);
      }
    }
  }
}

inspect().catch(e => { console.error('Inspect failed', e); process.exit(1); });
