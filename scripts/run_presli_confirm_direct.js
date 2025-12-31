#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
(async () => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const enquiry_id = process.argv[2];
  const note = process.argv[3] || null;
  const send_membership_link = process.argv[4] === 'true';
  if (!enquiry_id) { console.error('Usage: node run_presli_confirm_direct.js <enquiry_id> [note] [send_membership_link]'); process.exit(1); }
  try {
    const { data: enquiry } = await client.from('enquiries').select('*').eq('id', enquiry_id).maybeSingle();
    if (!enquiry) { console.error('Enquiry not found'); process.exit(2); }
    const payload = { presli_confirmed_at: new Date().toISOString() };
    if (note !== null) payload.presli_note = note;
    const { data: updated } = await client.from('enquiries').update(payload).eq('id', enquiry_id).select().single();
    const ev = { type: 'presli_confirmed', note: note || null, timestamp: new Date().toISOString() };
    const { data: cur } = await client.from('enquiries').select('events').eq('id', enquiry_id).maybeSingle();
    const events = (cur && cur.events) ? cur.events : [];
    events.push(ev);
    await client.from('enquiries').update({ events }).eq('id', enquiry_id);
    const response = { ok: true, enquiry: updated, event: ev };
    // Optionally send membership link if requested and not already sent
    if (send_membership_link) {
      const { data: invite } = await client.from('invites').select('*').eq('enquiry_id', enquiry_id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (!invite) {
        const token = require('crypto').randomBytes(12).toString('hex');
        const { data: newInvite } = await client.from('invites').insert([{ token, enquiry_id }]).select().single();
        response.invite = newInvite;
      } else {
        response.invite = invite;
      }
      // send via Resend if key present
      if (process.env.RESEND_API_KEY && enquiry.email) {
        const membershipUrl = `${process.env.SITE_URL || ''}/membership?token=${response.invite.token}`;
        const html = `<p>Hello ${enquiry.name || ''},</p><p>Your attendance has been confirmed. To complete your membership, please complete the form: <a href=\"${membershipUrl}\">Complete membership</a></p>`;
        const text = `Complete your membership: ${membershipUrl}`;
        const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.RESEND_FROM, to: enquiry.email, subject: 'EGAC: Complete your membership', html, text }) });
        if (!res.ok) { response.membership_error = await res.text(); } else { response.membership_sent = true; }
      }
    }
    console.log(JSON.stringify(response, null, 2));
  } catch (err) { console.error('Error:', err); process.exit(3); }
})();
