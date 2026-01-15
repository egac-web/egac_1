#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import pg from 'pg';

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
    // Step 1: Add status column with default
    console.log('1. Adding status column...');
    const { data: col1, error: err1 } = await supabase.rpc('exec', {
      sql: `ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'`
    });
    
    // Try using the admin client directly for schema changes
    // Since we can't use RPC, we'll just try to SELECT and see if the column exists
    const { data: testData, error: testError } = await supabase
      .from('enquiries')
      .select('id, status')
      .limit(1);

    if (testError && testError.message.includes('does not exist')) {
      console.log('❌ Status column does not exist yet');
      console.log('');
      console.log('Please run this SQL manually in your Supabase SQL Editor:');
      console.log('');
      const migrationSql = readFileSync('./db/migrations/2026-01-11_add_enquiry_status.sql', 'utf-8');
      console.log(migrationSql);
      console.log('');
      process.exit(1);
    } else if (testError) {
      console.error('❌ Error checking column:', testError.message);
      console.log('');
      console.log('Please run this SQL manually in your Supabase SQL Editor:');
      console.log('');
      const migrationSql = readFileSync('./db/migrations/2026-01-11_add_enquiry_status.sql', 'utf-8');
      console.log(migrationSql);
      console.log('');
      process.exit(1);
    } else {
      console.log('✅ Status column exists!');
      console.log('\n✅ Migration appears to be complete (or run manually via Supabase dashboard)');
    }
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    console.log('');
    console.log('Please run this SQL manually in your Supabase SQL Editor:');
    console.log('');
    const migrationSql = readFileSync('./db/migrations/2026-01-11_add_enquiry_status.sql', 'utf-8');
    console.log(migrationSql);
    console.log('');
    process.exit(1);
  }
}

runMigration();
