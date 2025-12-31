import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manually load .env file
const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.SUPABASE_URL || envVars.PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('📦 Running database migration...\n');

  const migration = readFileSync('./db/migrations/2025-12-30_add_someone_else_fields.sql', 'utf-8');

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: migration });

    if (error) {
      console.error('❌ Migration failed:', error);
      // Try direct approach with individual statements
      console.log('\n📝 Trying individual ALTER statements...');

      const statements = [
        `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS enquiry_type text`,
        `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS enquiry_for text`,
        `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS first_name text`,
        `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS last_name text`,
        `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS contact_phone text`,
        `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS subject_first_name text`,
        `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS subject_last_name text`,
        `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS subject_dob date`,
      ];

      for (const stmt of statements) {
        const result = await supabase.rpc('exec_sql', { sql: stmt });
        if (result.error) {
          console.log(`   ⚠️  ${stmt.substring(0, 60)}... - ${result.error.message}`);
        } else {
          console.log(`   ✅ ${stmt.substring(0, 60)}...`);
        }
      }
    } else {
      console.log('✅ Migration completed successfully');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n⚠️  Note: You may need to run this migration manually in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/[your-project]/sql');
  }
}

runMigration().then(() => {
  console.log('\n✅ Done');
  process.exit(0);
}).catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
