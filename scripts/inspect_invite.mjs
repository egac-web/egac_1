#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// load .env if present
try {
  const envText = fs.readFileSync('.env', 'utf8');
  for (const rawLine of envText.split(/\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
} catch (e) { }

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const token = process.argv[2];
if (!token) {
  console.error('Usage: node scripts/inspect_invite.mjs <invite-token>');
  process.exit(2);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) { console.error('Missing SUPABASE_URL or SERVICE_ROLE'); process.exit(2); }
const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: invite } = await client.from('invites').select('*').eq('token', token).maybeSingle();
  if (!invite) { console.log('Invite not found for token', token); process.exit(0); }
  console.log('Invite:', invite.id, 'status:', invite.status, 'sent_at:', invite.sent_at);
  const { data: enquiry } = await client.from('enquiries').select('id,email,events,invite_id,booking_id').eq('id', invite.enquiry_id).maybeSingle();
  console.log('Enquiry:', enquiry?.id, enquiry?.email, 'invite_id:', enquiry?.invite_id, 'booking_id:', enquiry?.booking_id);
  const events = enquiry?.events || [];
  console.log('Events:', events.filter(e => e.type && e.type.includes('invite') || e.type && e.type.includes('booking')));
  const { data: bookings } = await client.from('bookings').select('*').eq('invite_id', invite.id);
  console.log('Bookings for invite:', bookings);
})();
