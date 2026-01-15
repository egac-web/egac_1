#!/usr/bin/env node
/* scripts/db_check_booking_reminder.mjs
 * Read-only helper to validate the bookings table migration status.
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/db_check_booking_reminder.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(2);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

(async () => {
  try {
    // Check for column presence by trying to select reminder_sent
    const { data: cols, error: colErr } = await supabase.rpc('pg_catalog.pg_columns', { table_name: 'bookings' }).catch(() => null);
    // Fallback: query a sample
    const { data: sample } = await supabase.from('bookings').select('id,invite_id,session_date,reminder_sent').limit(5);

    console.log('Sample bookings (first 5):');
    console.log(sample);

    // Check duplicates on invite_id
    const { data: dup, error: dupErr } = await supabase.rpc('sql_query', { sql: "SELECT invite_id, count(*) FROM bookings GROUP BY invite_id HAVING count(*) > 1" }).catch(() => null);

    console.log('\nDuplicate invite_id check (if any):');
    console.log(dup || 'No duplicates or cannot run check via RPC');

    console.log('\nIf the sample shows a reminder_sent column, migration applied.');
    process.exit(0);
  } catch (err) {
    console.error('Error checking DB:', err);
    process.exit(1);
  }
})();
