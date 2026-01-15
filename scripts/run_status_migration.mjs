#!/usr/bin/env node
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
  console.log('📦 Running enquiry status migration...\n');

  try {
    // Run individual statements since Supabase doesn't support BEGIN/COMMIT via RPC
    const statements = [
      `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'`,
      `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS admin_notes TEXT`,
      `UPDATE enquiries SET status = 'pending' WHERE status IS NULL`,
    ];

    for (const stmt of statements) {
      console.log(`Running: ${stmt.substring(0, 60)}...`);
      const { error } = await supabase.rpc('exec_sql', { sql: stmt });
      if (error) {
        console.error(`❌ Failed: ${error.message}`);
        // Continue with other statements
      } else {
        console.log('✅ Success');
      }
    }

    // Create index
    console.log('Creating index on status column...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status)'
    });
    if (indexError) {
      console.error(`❌ Index creation failed: ${indexError.message}`);
    } else {
      console.log('✅ Index created');
    }

    // Add CHECK constraint (note: may fail if constraint already exists, that's ok)
    console.log('Adding CHECK constraint...');
    const { error: checkError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE enquiries ADD CONSTRAINT enquiries_status_check CHECK (status IN ('pending', 'contacted', 'joined', 'not_joined', 'no_response'))`
    });
    if (checkError) {
      console.log(`⚠️  Constraint note: ${checkError.message} (may already exist)`);
    } else {
      console.log('✅ Constraint added');
    }

    console.log('\n✅ Migration completed!');
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  }
}

runMigration();
