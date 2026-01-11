import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), 'egac_1', '.env');
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
  process.exit(1);
}

// Disable sending real emails
process.env.RESEND_API_KEY = '';

import('../dist/_worker.js/pages/api/booking.json.astro.mjs')
  .then((mod) => run(mod))
  .catch((err) => {
    console.error('Import failed', err);
    process.exit(1);
  });

async function run(mod) {
  const p = mod.page();
  const token = process.argv[2] || process.env.TEST_INVITE_TOKEN || '';
  if (!token) {
    console.error('No invite token supplied; pass as first arg or set TEST_INVITE_TOKEN in env');
    process.exit(2);
  }

  console.log('Using invite token:', token);

  const getRes = await p.GET({ request: { url: `http://localhost/?invite=${token}` } });
  const txt = await getRes.text();
  let body;
  try {
    body = JSON.parse(txt);
  } catch (e) {
    console.error('Failed to parse GET body', txt);
    process.exit(1);
  }
  console.log('GET status', getRes.status, 'availability count', (body.availability || []).length);

  const cand = (body.availability || []).find((d) => d.slots.u13 > 0 || d.slots.u15plus > 0);
  if (!cand) {
    console.error('No available dates');
    process.exit(1);
  }
  const session_date = cand.date;
  console.log('Attempting booking for date', session_date);

  const enquiry = body.enquiry || null;
  // If enquiry.dob missing, book as 'someone-else' providing a subject_dob (to allow age calculation)
  const postPayload =
    enquiry && enquiry.dob
      ? { invite: token, session_date }
      : {
          invite: token,
          session_date,
          booking_for: 'someone-else',
          subject_dob: process.env.TEST_SUBJECT_DOB || '2015-01-01',
        };
  const postRes = await p.POST({ request: { json: async () => postPayload } });
  const postTxt = await postRes.text();
  let postBody;
  try {
    postBody = JSON.parse(postTxt);
  } catch (e) {
    console.error('Failed to parse POST body', postTxt);
    process.exit(1);
  }
  console.log('POST status', postRes.status, 'body:', postBody);

  const getRes2 = await p.GET({ request: { url: `http://localhost/?invite=${token}` } });
  const get2txt = await getRes2.text();
  let get2body;
  try {
    get2body = JSON.parse(get2txt);
  } catch (e) {
    console.error('Failed to parse GET 2 body', get2txt);
    process.exit(1);
  }
  console.log('GET after booking, booking present:', !!get2body.booking);
  console.log('Booking record:', get2body.booking || null);
}
