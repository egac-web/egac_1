import { createClient } from '@supabase/supabase-js';

const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const id = process.argv[2];
if (!id) {
  console.error('Usage: node scripts/get_invite_token.mjs <invite_id>');
  process.exit(2);
}

const run = async () => {
  const { data, error } = await client.from('invites').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }
  console.log(JSON.stringify(data, null, 2));
};

run();
