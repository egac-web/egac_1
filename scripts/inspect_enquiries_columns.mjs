import { getSupabaseAdmin } from '../src/lib/supabase.ts';

(async () => {
  try {
    const client = getSupabaseAdmin(process.env);
    // information_schema is not exposed via PostgREST, so select a single row and infer columns from returned keys
    const { data, error } = await client.from('enquiries').select().limit(1).single();
    if (error) {
      console.error('Error querying enquiries:', error);
      process.exit(1);
    }
    if (!data) {
      console.log('No enquiries rows returned - table may be empty or inaccessible.');
      process.exit(0);
    }
    console.log('Columns for enquiries (inferred from first row):');
    Object.keys(data).forEach((k, i) => console.log(`  - ${i + 1}: ${k} (inferred)`));
  } catch (err) {
    console.error('Inspect failed:', err);
    process.exit(1);
  }
})();