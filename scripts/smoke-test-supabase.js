#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

async function nextTuesday() {
  const d = new Date();
  const offset = (2 - d.getDay() + 7) % 7; // Tuesday=2
  const t = new Date(d.getTime() + offset * 24 * 60 * 60 * 1000);
  return t.toISOString().slice(0, 10);
}

function computeAge(dobIso, dateIso) {
  const dob = new Date(dobIso);
  const at = new Date(dateIso + 'T00:00:00');
  let age = at.getFullYear() - dob.getFullYear();
  const m = at.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < dob.getDate())) age--;
  return age;
}

(async () => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
    process.exit(1);
  }
  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    console.log('Inserting test enquiry...');
    const enquiryPayload = {
      name: 'Smoke Test User',
      email: `smoke+${Date.now()}@example.com`,
      phone: '07700 900000',
      interest: 'Training',
      training_days: ['Tuesday'],
      dob: '2014-06-01',
      source: 'smoke-test',
      note: 'Automated smoke test',
      raw_payload: { test: true },
    };

    let { data: inserted, error } = await client.from('enquiries').insert([enquiryPayload]).select().single();
    if (error) throw error;
    console.log('Inserted enquiry id:', inserted.id);

    console.log('Creating invite...');
    const token = crypto.randomBytes(12).toString('hex');
    let { data: invite, error: inviteErr } = await client.from('invites').insert([{ token, enquiry_id: inserted.id }]).select().single();
    if (inviteErr) throw inviteErr;
    console.log('Invite created id:', invite.id, 'token:', invite.token);

    console.log('Updating enquiry with invite id...');
    await client.from('enquiries').update({ invite_id: invite.id }).eq('id', inserted.id);

    console.log('Appending invite_created event...');
    const { data: cur } = await client.from('enquiries').select('events').eq('id', inserted.id).maybeSingle();
    const events = (cur && cur.events) ? cur.events : [];
    events.push({ type: 'invite_created', invite_id: invite.id, at: new Date().toISOString() });
    await client.from('enquiries').update({ events }).eq('id', inserted.id);

    // Booking
    const session_date = await nextTuesday();
    const age = computeAge(inserted.dob, session_date);
    const slot = (age < 13) ? 'u13' : 'u15plus';

    console.log(`Attempting booking for ${session_date} (age ${age}) slot ${slot}`);
    const { count } = await client.from('bookings').select('id', { head: true, count: 'exact' }).eq('session_date', session_date).eq('slot', slot);
    console.log('Current bookings for slot:', count);
    if (count >= 2) {
      console.log('No capacity, cannot create booking in smoke test.');
    } else {
      const session_time = slot === 'u13' ? '18:30:00' : '19:30:00';
      const { data: booking, error: bErr } = await client.from('bookings').insert([{ enquiry_id: inserted.id, invite_id: invite.id, session_date, slot, session_time }]).select().single();
      if (bErr) throw bErr;
      console.log('Booking created:', booking.id);

      console.log('Marking invite accepted and appending booking event...');
      await client.from('invites').update({ status: 'accepted', accepted_at: new Date().toISOString() }).eq('id', invite.id);
      const { data: cur2 } = await client.from('enquiries').select('events').eq('id', inserted.id).maybeSingle();
      const events2 = (cur2 && cur2.events) ? cur2.events : [];
      events2.push({ type: 'booking_created', booking_id: booking.id, session_date, slot, at: new Date().toISOString() });
      await client.from('enquiries').update({ events: events2 }).eq('id', inserted.id);
      console.log('Booking smoke test completed.');
    }

    console.log('Smoke test finished successfully.');
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(2);
  }
})();
