#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function nowISO() { return new Date().toISOString(); }

async function run() {
  console.log('Starting smoke booking test (DB-only, no emails)...');
  const timestamp = Date.now();
  const testEmail = `smoke+${timestamp}@example.com`;
  let enquiry = null, invite = null, booking = null;
  try {
    // 1) Insert enquiry
    const { data: enq, error: enqErr } = await supabase.from('enquiries').insert([{
      name: 'Smoke Test', email: testEmail, dob: '2010-01-01', source: 'smoke-test', processed: false, environment: 'staging', created_at: nowISO()
    }]).select('*').single();
    if (enqErr) throw enqErr;
    enquiry = enq;
    console.log('Inserted enquiry', enquiry.id);

    // 2) Insert invite
    const token = crypto.randomUUID().replaceAll('-', '').slice(0, 24);
    const { data: inv, error: invErr } = await supabase.from('invites').insert([{
      enquiry_id: enquiry.id, token, status: 'pending', created_at: nowISO()
    }]).select('*').single();
    if (invErr) throw invErr;
    invite = inv;
    console.log('Inserted invite', invite.id, 'token', invite.token);

    // 3) Insert booking (first time) - should succeed
    const session_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const slot = 'u13';
    const session_time = '18:30:00';
    const { data: bk, error: bkErr } = await supabase.from('bookings').insert([{
      enquiry_id: enquiry.id, invite_id: invite.id, session_date, slot, session_time, environment: 'staging', created_at: nowISO()
    }]).select('*').single();
    if (bkErr) throw bkErr;
    booking = bk;
    console.log('Inserted booking', booking.id);

    // 4) Attempt duplicate booking with same invite_id - EXPECT failure
    console.log('Attempting duplicate booking insert (should fail)...');
    const { data: dup, error: dupErr } = await supabase.from('bookings').insert([{
      enquiry_id: enquiry.id, invite_id: invite.id, session_date, slot, session_time, environment: 'staging', created_at: nowISO()
    }]).select('*').maybeSingle();

    if (!dupErr) {
      console.error('ERROR: duplicate insert unexpectedly succeeded!', dup);
    } else {
      console.log('Duplicate insert failed as expected. Error:', dupErr.message || dupErr);
    }

    console.log('Smoke booking test completed successfully.');
  } catch (err) {
    console.error('Smoke test failed', err);
  } finally {
    // Cleanup - delete booking, invite, enquiry
    try {
      if (booking && booking.id) {
        await supabase.from('bookings').delete().eq('id', booking.id);
        console.log('Deleted booking', booking.id);
      }
      if (invite && invite.id) {
        await supabase.from('invites').delete().eq('id', invite.id);
        console.log('Deleted invite', invite.id);
      }
      if (enquiry && enquiry.id) {
        await supabase.from('enquiries').delete().eq('id', enquiry.id);
        console.log('Deleted enquiry', enquiry.id);
      }
    } catch (cleanupErr) { console.error('Cleanup error', cleanupErr); }
    process.exit(0);
  }
}

run();
