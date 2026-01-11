#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.TEST_INVITE_EMAIL || 'local-test@example.com';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  try {
    const name = 'Eddie Test (auto)';
    const interest = 'Testing';

    // Insert minimal fields to avoid schema mismatch in different environments
    const { data: enquiry, error: eErr } = await supabase.from('enquiries').insert([{ name, email, interest }]).select().single();
    if (eErr || !enquiry) {
      console.error('Failed to create enquiry', eErr);
      process.exit(1);
    }

    const token = crypto.randomBytes(12).toString('hex');
    // Insert invite without optional columns so this works on schemas lacking send_attempts
    const { data: invite, error: iErr } = await supabase.from('invites').insert([{ token, enquiry_id: enquiry.id, status: 'pending' }]).select().single();
    if (iErr || !invite) {
      console.error('Failed to create invite', iErr);
      process.exit(1);
    }

    console.log('Created enquiry:', enquiry.id);
    console.log('Created invite:', invite.id);
    console.log('Invite token:', invite.token);
    process.stdout.write(JSON.stringify({ enquiry, invite }));
  } catch (err) {
    console.error('Error creating test invite', err);
    process.exit(1);
  }
}

run();
