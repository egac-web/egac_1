import { getSupabaseAdmin } from '../../../lib/supabase';
import { sendReminderNotification } from '../../../lib/notifications';

async function runReminderLogic(env) {
  const client = getSupabaseAdmin(env);
  // find bookings for tomorrow (session_date = today + 1) which haven't had reminders sent and are not cancelled
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().slice(0, 10);

  const { data: bookings, error } = await client.from('bookings').select('*').eq('session_date', dateStr).neq('status', 'cancelled').eq('reminder_sent', false).limit(200);
  if (error) throw error;

  const results = [];
  for (const b of bookings) {
    try {
      // fetch enquiry
      const { data: enq } = await client.from('enquiries').select('*').eq('id', b.enquiry_id).maybeSingle();
      if (!enq) { results.push({ booking_id: b.id, ok: false, error: 'Enquiry missing' }); continue; }

      const res = await sendReminderNotification({ enquiryId: enq.id, to: enq.email, date: b.session_date, slotLabel: (env && env.CONFIG && env.CONFIG.slots && env.CONFIG.slots[b.slot]) ? env.CONFIG.slots[b.slot].label : b.slot, env });
      if (res.ok) {
        await client.from('bookings').update({ reminder_sent: true }).eq('id', b.id);
        results.push({ booking_id: b.id, ok: true, resend_id: res.resendId || null });
      } else {
        results.push({ booking_id: b.id, ok: false, error: String(res.error || 'send_failed') });
      }
    } catch (err) {
      results.push({ booking_id: b.id, ok: false, error: String(err) });
      // mark attempt? not necessary for reminders
    }
  }
  return results;
}

export async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    // Protect via query param secret
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');
    if (!env.CRON_SECRET || !secret || secret !== env.CRON_SECRET) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const results = await runReminderLogic(env);
    return new Response(JSON.stringify({ ok: true, processed: results.length, results }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Send reminders error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
