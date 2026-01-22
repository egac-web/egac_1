#!/usr/bin/env node
import { getSupabaseAdmin } from '../src/lib/supabase.js';

async function run() {
  const env = process.env;
  const client = getSupabaseAdmin(env);
  console.log('Querying bookings with non-null invite_id...');
  const { data, error } = await client.from('bookings').select('id, invite_id, created_at');
  if (error) {
    console.error('Failed to query bookings:', error);
    process.exit(1);
  }

  const map = new Map();
  for (const r of data || []) {
    if (!r.invite_id) continue;
    const arr = map.get(r.invite_id) || [];
    arr.push({ id: r.id, created_at: r.created_at });
    map.set(r.invite_id, arr);
  }

  const duplicates = [];
  for (const [invite_id, rows] of map.entries()) {
    if (rows.length > 1) {
      rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      duplicates.push({ invite_id, ids: rows.map(r => r.id), count: rows.length });
    }
  }

  if (duplicates.length === 0) {
    console.log('No duplicate invite_id values found.');
    process.exit(0);
  }

  console.log('Found duplicates:');
  console.table(duplicates);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(2); });
