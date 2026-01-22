import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  console.log('Querying bookings for duplicates...');
  const { data, error } = await supabase
    .from('bookings')
    .select('id, invite_id, created_at')
    .order('invite_id', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase query error', error);
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
    if (rows.length > 1) duplicates.push({ invite_id, ids: rows.map(r => r.id), count: rows.length });
  }

  if (duplicates.length === 0) {
    console.log('No duplicate invite_id values found.');
  } else {
    console.log('Found duplicates:');
    console.table(duplicates);
  }
}

run().catch(e => { console.error(e); process.exit(1); });
