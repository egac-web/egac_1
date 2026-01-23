import { getSupabaseAdmin } from '../src/lib/supabase.ts';

const client = getSupabaseAdmin(process.env);
const { data, error } = await client.from('bookings').select('id, session_date, slot, status').order('session_date', { ascending: false }).limit(10);
if (error) { console.error('Error:', error); process.exit(1); }
console.log('Recent bookings:');
data.forEach(b => console.log(`  ${b.id} - ${b.session_date} ${b.slot} (${b.status})`));
