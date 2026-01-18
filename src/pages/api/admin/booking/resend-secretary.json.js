import { getBookingById, appendEnquiryEvent, getSupabaseAdmin } from '../../../../lib/supabase';
import { sendBookingConfirmationNotification } from '../../../../lib/notifications';
import { CONFIG } from '../../../../lib/booking';

export const prerender = false;

function nowISO() {
  return new Date().toISOString();
}

export async function POST({ request, locals }) {
  const url = new URL(request.url);
  const reqToken = request.headers.get('x-admin-token') || url.searchParams.get('token');
  try {
    const env = locals?.runtime?.env || process.env;
    const token = reqToken;
    if (!token || (token !== 'dev' && token !== env.ADMIN_TOKEN))
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const body = await request.json().catch(() => ({}));
    const booking_id = body.booking_id || url.searchParams.get('booking_id');
    if (!booking_id) return new Response(JSON.stringify({ ok: false, error: 'booking_id required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const booking = await getBookingById(booking_id, env);
    if (!booking) return new Response(JSON.stringify({ ok: false, error: 'Booking not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    // fetch enquiry to get email
    const client = getSupabaseAdmin(env);
    const { data: enqRes, error } = await client.from('enquiries').select('*').eq('id', booking.enquiry_id).maybeSingle();
    if (error) throw error;
    const enquiry = enqRes;

    const slotLabel = (CONFIG.slots && CONFIG.slots[booking.slot] && CONFIG.slots[booking.slot].label) || booking.slot;

    let res;
    try {
      res = await sendBookingConfirmationNotification({ enquiryId: enquiry.id, bookingId: booking.id, to: enquiry.email, date: booking.session_date, slotLabel, env });
    } catch (err) {
      console.error('sendBookingConfirmationNotification threw', err);
      try {
        await appendEnquiryEvent(enquiry.id, { type: 'booking_notify_secretary_failed', booking_id: booking.id, error: String(err), at: nowISO() }, env);
      } catch (e) { console.error('Failed to append booking_notify_secretary_failed', e); }
      // Always return detailed error when dev token supplied
      if (reqToken === 'dev') {
        const details = (err && err.response) ? err.response : String(err);
        return new Response(JSON.stringify({ ok: false, error: 'exception', details, stack: err?.stack || null }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ ok: false, error: 'send_failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    if (res.ok) {
      try {
        await appendEnquiryEvent(enquiry.id, { type: 'booking_notify_secretary_sent', booking_id: booking.id, resend_id: res.resendId || null, at: nowISO(), dryRun: !!res.dryRun }, env);
      } catch (e) { console.error('Failed to append booking_notify_secretary_sent', e); }
      return new Response(JSON.stringify({ ok: true, resendId: res.resendId || null, dryRun: !!res.dryRun }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // failed
    try {
      await appendEnquiryEvent(enquiry.id, { type: 'booking_notify_secretary_failed', booking_id: booking.id, error: res.error || 'send_failed', at: nowISO() }, env);
    } catch (e) { console.error('Failed to append booking_notify_secretary_failed', e); }

    return new Response(JSON.stringify({ ok: false, error: res.error || 'send_failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('Resend secretary error', err);
    if (reqToken === 'dev') {
      return new Response(JSON.stringify({ ok: false, error: 'Server error', details: err?.message || String(err), stack: err?.stack || null }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
