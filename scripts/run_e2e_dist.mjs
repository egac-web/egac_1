import fs from 'fs';
import { page } from '../dist/_worker.js/pages/api/admin/run-e2e.json.astro.mjs';
const POST = page().POST;

// load .env
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

async function run() {
  const body = { confirm: 'yes', dry_run: false, email: 'eddie@thevermeers.co.uk' };
  const req = {
    url: 'http://localhost/?token=dev&confirm=yes',
    headers: new Map(),
    json: async () => body,
  };
  const locals = { runtime: { env: process.env } };

  try {
    const res = await POST({ request: req, locals });
    const text = await res.text();
    console.log('Run-e2e response status:', res.status);
    try { console.log('Response JSON:', JSON.parse(text)); } catch (e) { console.log('Response text:', text); }
  } catch (err) {
    console.error('E2E call failed', err);
  }
}

run();
