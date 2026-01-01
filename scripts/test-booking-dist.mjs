import fs from 'fs';

// Load .env manually
const envPath = new URL('../.env', import.meta.url);
try {
  const envRaw = fs.readFileSync(envPath, 'utf8');
  envRaw.split(/\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx);
    let val = trimmed.slice(idx + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
} catch (err) {
  console.error('Could not read .env:', err);
}

// Disable Resend for this test
process.env.RESEND_API_KEY = '';

import { page as bookingPage } from '../dist/_worker.js/pages/api/booking.json.astro.mjs';

async function run() {
  try {
    const p = bookingPage();

    // Use invite token from previous run (replace if needed)
    const inviteToken = process.argv[2] || '73a345b11d2c9bfddb4513de';

    // 1) GET availability for invite
    const getRes = await p.get({ request: { url: `http://localhost/?invite=${inviteToken}` } });
    console.log('GET response status:', getRes.status);
    console.log('GET body keys:', Object.keys(getRes.body || {}));

    if (!getRes.body || !getRes.body.availability) {
      console.error('No availability returned, body:', getRes.body);
      return;
    }

    // Pick first available date with capacity > 0
    const cand = getRes.body.availability.find(d => (d.slots.u13 > 0) || (d.slots.u15plus > 0));
    if (!cand) { console.error('No available dates'); return; }
    const session_date = cand.date;

    // 2) POST a booking for that date
    const postRes = await p.post({ request: { json: async () => ({ invite: inviteToken, session_date }) } });
    console.log('POST response:', postRes);

    // 3) GET again to confirm booking
    const getRes2 = await p.get({ request: { url: `http://localhost/?invite=${inviteToken}` } });
    console.log('GET after booking, booking present:', !!getRes2.body.booking);
    console.log('GET booking:', getRes2.body.booking || null);
  } catch (err) {
    console.error('Error in booking test:', err);
  }
}

run();
