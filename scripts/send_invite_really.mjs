import { createClient } from '@supabase/supabase-js';


// Usage:
// SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... RESEND_API_KEY=... RESEND_FROM=... SITE_BASE_URL=... node scripts/send_invite_really.mjs --invite-id <invite_id> --yes
// OR
// node scripts/send_invite_really.mjs --enquiry-id <enquiry_id> --yes

const argv = process.argv.slice(2);
const hasFlag = (f) => argv.includes(f);
const getArg = (k) => {
  const idx = argv.indexOf(k); return (idx >= 0 && argv.length > idx + 1) ? argv[idx+1] : null;
};

const inviteId = getArg('--invite-id');
const enquiryId = getArg('--enquiry-id');
const yes = hasFlag('--yes');

if (!inviteId && !enquiryId) {
  console.error('Provide --invite-id or --enquiry-id');
  process.exit(2);
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(2);
}
if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
  console.error('RESEND_API_KEY and RESEND_FROM must be set');
  process.exit(2);
}
if (process.env.RESEND_DRY_RUN) {
  console.error('RESEND_DRY_RUN is set; unset it to send real emails (safety)');
  process.exit(2);
}

if (!yes) {
  console.log('This will perform a REAL email send using Resend.');
  console.log('Re-run with the same args plus --yes to confirm.');
  process.exit(0);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    let inviteRow = null;
    if (inviteId) {
      const { data, error } = await supabase.from('invites').select('*').eq('id', inviteId).maybeSingle();
      if (error || !data) {
        console.error('Invite not found', error);
        process.exit(1);
      }
      inviteRow = data;
    } else if (enquiryId) {
      const { data, error } = await supabase.from('invites').select('*').eq('enquiry_id', enquiryId).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (error || !data) {
        console.error('Invite for enquiry not found', error);
        process.exit(1);
      }
      inviteRow = data;
    }

    // fetch enquiry to get email
    const { data: enquiry, error: enqErr } = await supabase.from('enquiries').select('*').eq('id', inviteRow.enquiry_id).maybeSingle();
    if (enqErr || !enquiry) {
      console.error('Enquiry not found', enqErr);
      process.exit(1);
    }

    const inviteUrl = `${process.env.SITE_BASE_URL || 'http://localhost:3000'}/booking?invite=${encodeURIComponent(inviteRow.token)}`;

    console.log('Sending invite to', enquiry.email, 'invite:', inviteRow.id);

    // Build email content
    const subject = 'EGAC: Book a taster / session';
    const html = `<p>Hello,</p><p>Thanks for your enquiry. To book a free taster, please follow this link:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p><p>If you did not request this, ignore this email.</p>`;
    const text = `Book here: ${inviteUrl}`;

    // Call Resend API
    const r = await fetch('https://api.resend.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({ from: process.env.RESEND_FROM, to: enquiry.email, subject, html, text })
    });

    if (!r.ok) {
      const body = await r.text();
      console.error('Resend API error', r.status, body);
      process.exit(1);
    }

    const sendRes = await r.json();

    // Append enquiry event (invite_sent)
    try {
      const { data: cur } = await supabase.from('enquiries').select('events').eq('id', enquiry.id).maybeSingle();
      const events = (cur && cur.events) ? cur.events : [];
      events.push({ type: 'invite_sent', invite_id: inviteRow.id, resend_id: sendRes.id, at: new Date().toISOString(), meta: sendRes });
      await supabase.from('enquiries').update({ events }).eq('id', enquiry.id);
    } catch (e) {
      console.error('Failed to append enquiry event', e);
    }

    // Mark invite as sent
    try {
      await supabase.from('invites').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', inviteRow.id);
    } catch (e) { console.error('Failed to mark invite sent', e); }

    console.log('Send result', sendRes);
    process.exit(0);
  } catch (err) {
    console.error('Error sending invite:', err);
    process.exit(1);
  }
}

run();
