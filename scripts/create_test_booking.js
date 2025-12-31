#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
(async () => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
    process.exit(1);
  }
  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const enquiryRes = await client.from('enquiries').select('*').ilike('email', 'smoke%').order('created_at', { ascending: false }).limit(1).maybeSingle();
  const enquiry = enquiryRes.data;
  if (!enquiry) {
    console.error('No smoke enquiry found');
    process.exit(1);
  }
  const inviteRes = await client.from('invites').select('*').eq('enquiry_id', enquiry.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
  const invite = inviteRes.data;

  const d = new Date();
  const offset = (2 - d.getDay() + 7) % 7; // to next Tuesday
  const t = new Date(d.getTime() + (offset + 14) * 24 * 60 * 60 * 1000); // 2 weeks ahead
  const session_date = t.toISOString().slice(0, 10);
  const at = new Date(session_date + 'T00:00:00');
  const dob = new Date(enquiry.dob);
  let age = at.getFullYear() - dob.getFullYear();
  const m = at.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < dob.getDate())) age--;
  const slot = age < 13 ? 'u13' : 'u15plus';
  const session_time = slot === 'u13' ? '18:30:00' : '19:30:00';

  console.log('Enquiry', enquiry.id, 'Invite', invite && invite.id, 'Session date', session_date, 'slot', slot);
  const { data, error } = await client.from('bookings').insert([{ enquiry_id: enquiry.id, invite_id: invite ? invite.id : null, session_date, slot, session_time }]).select().single();
  if (error) {
    console.error('Booking error', error);
    process.exit(2);
  }
  console.log('Created booking', data.id);
})();
