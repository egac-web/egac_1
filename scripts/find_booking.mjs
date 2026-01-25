#!/usr/bin/env node
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

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
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(2);
}
const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const date = process.argv[2] || '2026-02-03';
  const slot = process.argv[3] || 'u15plus';
  const { data: bookings, error } = await client.from('bookings').select('*').eq('session_date', date).eq('slot', slot).eq('status', 'confirmed').limit(10).order('created_at', { ascending: false });
  if (error) { console.error('Query error', error); process.exit(1); }
  console.log('Found', bookings.length, 'bookings');
  for (const b of bookings) {
    console.log(JSON.stringify({ id: b.id, enquiry_id: b.enquiry_id, session_date: b.session_date, slot: b.slot, status: b.status }));
  }
})();