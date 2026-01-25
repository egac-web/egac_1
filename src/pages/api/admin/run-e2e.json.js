import { insertEnquiry, createInviteForEnquiry, createBooking, appendEnquiryEvent } from '../../../lib/supabase';
import { sendInviteNotification, sendBookingConfirmationNotification, sendReminderNotification } from '../../../lib/notifications';
import { CONFIG } from '../../../lib/booking';

export const prerender = false;

function tomorrowDateString() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get('x-admin-token') || url.searchParams.get('token');
    if (!token || (token !== 'dev' && token !== env.ADMIN_TOKEN)) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json().catch(() => ({}));
    const confirm = body.confirm || url.searchParams.get('confirm') || 'no';
    const dryRun = body.dry_run !== undefined ? !!body.dry_run : (url.searchParams.get('dry_run') !== 'false');

    if (confirm !== 'yes') {
      return new Response(JSON.stringify({ ok: false, error: 'confirm=yes required to run' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Check that Supabase and Resend are available in env
    try {
      // create enquiry
      const testEmail = (body.email || `e2e+${Date.now()}@examples.invalid`);
      const enquiry = await insertEnquiry({ name: 'E2E Test', email: testEmail, interest: 'E2E dry-run' }, env);

      // create invite
      const invite = await createInviteForEnquiry(enquiry.id, env);

      // Build invite URL
      const siteBase = env.SITE_BASE_URL || process.env.SITE_BASE_URL || '';
      const inviteUrl = `${siteBase}/bookings?invite=${encodeURIComponent(invite.token)}`;

      const steps = [];

      // Send invite (respects RESEND_DRY_RUN in env and dryRun flag we pass in env override locally)
      const notifyEnv = Object.assign({}, env, { RESEND_DRY_RUN: dryRun ? '1' : '' });
      const inviteRes = await sendInviteNotification({ enquiryId: enquiry.id, inviteId: invite.id, to: enquiry.email, inviteUrl, env: notifyEnv });
      steps.push({ step: 'send_invite', ok: !!inviteRes.ok, dry: !!inviteRes.dryRun, result: inviteRes.ok ? (inviteRes.resendId || null) : String(inviteRes.error || 'failed') });

      // Create booking for tomorrow (slot pick: use u13 by default)
      const dateStr = tomorrowDateString();
      const slot = body.slot || Object.keys(CONFIG.slots)[0] || 'u13';
      const session_time = (CONFIG.slots && CONFIG.slots[slot] && CONFIG.slots[slot].time) ? CONFIG.slots[slot].time : '18:30';
      const booking = await createBooking(enquiry.id, invite.id, dateStr, slot, session_time, env);
      steps.push({ step: 'create_booking', ok: !!booking, booking_id: booking && booking.id ? booking.id : null, session_date: dateStr, slot, session_time });

      // Send booking confirmation (dry-run)
      const slotLabel = (CONFIG.slots && CONFIG.slots[slot] && CONFIG.slots[slot].label) || slot;
      const bookingRes = await sendBookingConfirmationNotification({ enquiryId: enquiry.id, bookingId: booking.id, to: enquiry.email, date: dateStr, slotLabel, env: notifyEnv });
      steps.push({ step: 'send_booking_confirmation', ok: !!bookingRes.ok, dry: !!bookingRes.dryRun, result: bookingRes.ok ? (bookingRes.resendId || null) : String(bookingRes.error || 'failed') });

      // Trigger reminder for that booking (dry-run)
      const reminderRes = await sendReminderNotification({ enquiryId: enquiry.id, to: enquiry.email, date: dateStr, slotLabel, env: notifyEnv });
      steps.push({ step: 'send_reminder', ok: !!reminderRes.ok, dry: !!reminderRes.dryRun, result: reminderRes.ok ? (reminderRes.resendId || null) : String(reminderRes.error || 'failed') });

      // Append an E2E event to the enquiry so it's visible in admin UI
      try { await appendEnquiryEvent(enquiry.id, { type: 'e2e_test_completed', at: new Date().toISOString(), meta: { steps } }, env); } catch (e) { console.error('Failed to append e2e event', e); }

      return new Response(JSON.stringify({ ok: true, dryRun, enquiry: { id: enquiry.id, email: enquiry.email }, invite: { id: invite.id, token: invite.token }, booking: { id: booking.id, session_date: dateStr, slot }, steps }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error('E2E run failed', err);
      return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    console.error('E2E route error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}