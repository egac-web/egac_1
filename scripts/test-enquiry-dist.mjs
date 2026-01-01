import fs from 'fs';

// Load .env manually (simple parser)
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
    // Remove surrounding quotes if present
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

import { p as post } from '../dist/_worker.js/chunks/enquiry.json_DrDfkOY3.mjs';

async function run() {
  try {
    const fakeReq = {
      json: async () => ({
        contact_name: 'Dist Script Test',
        contact_email: 'dist+test@example.com',
        gdpr_consent: 'true',
        interest: 'Training',
        dob: '2008-01-01',
      }),
      url: 'http://localhost'
    };

    const res = await post({ request: fakeReq });
    console.log('API response:', res);
  } catch (err) {
    console.error('Error calling API:', err);
  }
}

run();
