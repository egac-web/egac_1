import fs from 'fs';

// Load .env manually
const envPath = new URL('../.env', import.meta.url);
try {
  const envRaw = fs.readFileSync(envPath, 'utf8');
  envRaw.split(/\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx);
    let val = trimmed.slice(idx + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
} catch (err) {
  console.error('Could not read .env:', err);
}

import { p as enquiryPost } from '../dist/_worker.js/chunks/enquiry.json_DrDfkOY3.mjs';
import { page as bookingPage } from '../dist/_worker.js/pages/api/booking.json.astro.mjs';
import { getInviteByToken, getSupabaseAdmin } from '../dist/_worker.js/chunks/supabase_BuGpVBnm.mjs';

async function run() {
  try {
    // 1) Create enquiry for eddie@thevermeers.co.uk
    const email = process.argv[2] || 'eddie@thevermeers.co.uk';
    const fakeReq = { json: async () => ({ contact_name: 'Eddie Test', contact_email: email, gdpr_consent: 'true', interest: 'Training', dob: '2008-01-01' }), url: 'http://localhost' };
    const res = await enquiryPost({ request: fakeReq });
    if (!res || res.status !== 200 || !res.body || !res.body.invite_id) {
      console.error('Enquiry creation failed or did not return invite', res);
      return;
    }
    console.log('Enquiry created:', { enquiry_id: res.body.enquiry_id, invite_id: res.body.invite_id });

    // Find invite token from DB
    const client = getSupabaseAdmin();
    const { data: invite } = await client.from('invites').select('*').eq('id', res.body.invite_id).maybeSingle();
    if (!invite) {
      console.error('Could not find invite record');
      return;
    }
    console.log('Invite token:', invite.token);

    // 2) Use booking page to GET availability for token
    const p = bookingPage();
    const getRes = await p.get({ request: { url: `http://localhost/?invite=${invite.token}` } });
    if (!getRes || getRes.status !== 200 || !getRes.body) {
      console.error('Booking GET failed', getRes);
      return;
    }

    const cand = getRes.body.availability.find(d => (d.slots.u13 > 0) || (d.slots.u15plus > 0));
    if (!cand) { console.error('No available dates'); return; }
    const session_date = cand.date;
    console.log('Booking date chosen:', session_date);

    // 3) POST booking
    const postRes = await p.post({ request: { json: async () => ({ invite: invite.token, session_date }) } });
    if (!postRes || postRes.status !== 200) {
      console.error('Booking POST failed', postRes);
      return;
    }
    console.log('Booking created:', { booking_id: postRes.body.booking.id, session_date });

    // 4) Fetch enquiry events to check notifications
    const { data: enquiryRow } = await client.from('enquiries').select('id,events').eq('id', res.body.enquiry_id).maybeSingle();
    if (!enquiryRow) {
      console.error('Could not fetch enquiry');
      return;
    }
    const events = enquiryRow.events || [];
    const summary = {};
    events.forEach(ev => { summary[ev.type] = ev; });

    console.log('Event summary keys:', Object.keys(summary));
    if (summary.invite_sent) console.log('Invite sent event present (resend id present?', !!summary.invite_sent.resend_id, ')');
    if (summary.booking_confirm_email_sent) console.log('Booking confirmation email sent (id', summary.booking_confirm_email_sent.resend_id, ')');
    if (summary.booking_notify_secretary_sent) console.log('Secretary notified (id', summary.booking_notify_secretary_sent.resend_id, ')');

    console.log('Done. Check your inbox (and the secretary inbox).');
  } catch (err) {
    console.error('Error in resend test:', err);
  }
}

run();
