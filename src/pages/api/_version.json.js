export const prerender = false;

import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const file = path.resolve('src/lib/buildInfo.json');
    let info = { sha: process.env.BUILD_SHA || null, built_at: process.env.BUILD_TIME || null };
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf8');
      info = Object.assign(info, JSON.parse(raw));
    }
    return new Response(JSON.stringify({ ok: true, version: info }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Version endpoint error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
