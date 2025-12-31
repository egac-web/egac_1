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
  const booking_id = process.argv[2];
  const status = process.argv[3] || 'attended';
  const send_membership_link = process.argv[4] === 'true';

  if (!booking_id) {
    console.error('Usage: node run_attendance_direct.js <booking_id> [status] [send_membership_link]');
    process.exit(1);
  }

  try {
    const { data: booking, error: bErr } = await client.from('bookings').select('*, enquiry:enquiries(*)').eq('id', booking_id).maybeSingle();
    if (bErr) throw bErr;
    if (!booking) { console.error('Booking not found'); process.exit(2); }

    const { data: updated, error: updErr } = await client.from('bookings').update({ status }).eq('id', booking_id).select().single();
    if (updErr) throw updErr;

    const enquiry_id = booking.enquiry_id || (booking.enquiry && booking.enquiry.id);
    if (!enquiry_id) { console.error('Booking missing enquiry'); process.exit(3); }

    // append event
    const { data: cur } = await client.from('enquiries').select('events').eq('id', enquiry_id).maybeSingle();
    const events = (cur && cur.events) ? cur.events : [];
    const event = { type: 'attendance', status, note: null, timestamp: new Date().toISOString(), booking_id };
    events.push(event);
    await client.from('enquiries').update({ events }).eq('id', enquiry_id);

    const response = { booking: updated, events_appended: event };

    // membership link
    if (status === 'attended' && send_membership_link) {
      // create invite
      const token = require('crypto').randomBytes(12).toString('hex');
      const { data: invite } = await client.from('invites').insert([{ token, enquiry_id }]).select().single();
      await client.from('enquiries').update({ invite_id: invite.id }).eq('id', enquiry_id);

      // send email via Resend API
      const membershipUrl = `${process.env.SITE_URL || ''}/membership?token=${invite.token}`;
      if (booking.enquiry && booking.enquiry.email && process.env.RESEND_API_KEY) {
        const html = `<p>Hello ${booking.enquiry.name || ''},</p><p>Thanks for attending your taster session. To complete your membership, please complete the form: <a href=\"${membershipUrl}\">Complete membership</a></p>`;
        const text = `Complete your membership: ${membershipUrl}`;
        const payload = { from: process.env.RESEND_FROM, to: booking.enquiry.email, subject: 'EGAC: Complete your membership', html, text };
        const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) {
          const body = await res.text();
          response.membership_error = body;
        } else {
          await client.from('invites').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', invite.id);
          const ev = { type: 'membership_link_sent', invite_id: invite.id, to: booking.enquiry.email, timestamp: new Date().toISOString() };
          events.push(ev);
          await client.from('enquiries').update({ events }).eq('id', enquiry_id);
          response.membership_sent = true;
        }
      } else {
        response.membership_sent = false;
        response.warning = 'No email or RESEND_API_KEY';
      }
    }

    const enquiry = booking.enquiry || {};
    const slot = booking.slot || '';
    const session_date = booking.session_date || '';
    response.coachMessage = `Attended: ${enquiry.name || ''} (${enquiry.email || ''}, ${enquiry.phone || ''}) — ${session_date} ${slot} — Please record in Presli per EA criteria.`;
    response.presliCSV = `${enquiry.name || ''},${enquiry.email || ''},${enquiry.phone || ''},${session_date},${slot}`;

    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error('Error:', err);
    process.exit(4);
  }
})();
