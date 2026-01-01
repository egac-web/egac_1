import { getInviteByToken } from '../../lib/supabase';
import { getNextNWeekdayDates, slotForAge, computeAgeOnDate, CONFIG } from '../../lib/booking';
import { countBookingsForDateSlot, createBooking, appendEnquiryEvent, markInviteAccepted, getBookingByInvite, getSupabaseAdmin } from '../../lib/supabase';
import sendInviteEmail, { sendBookingConfirmation } from '../../lib/resend';

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const inviteToken = url.searchParams.get('invite');
    const dateParam = url.searchParams.get('date');

    if (!inviteToken && !dateParam) {
      // return available upcoming Tuesdays by default
      const dates = getNextNWeekdayDates(2, CONFIG.weeksAhead);
      // for each date fetch counts (cheap-ish)
      const availabilityPromises = dates.map(async (d) => {
        const u13Count = await countBookingsForDateSlot(d, 'u13');
        const u15Count = await countBookingsForDateSlot(d, 'u15plus');
        return { date: d, slots: { u13: CONFIG.capacityPerSlot - u13Count, u15plus: CONFIG.capacityPerSlot - u15Count } };
      });
      const availability = await Promise.all(availabilityPromises);
      return { status: 200, body: { ok: true, availability } };
    }

    if (inviteToken) {
      const invite = await getInviteByToken(inviteToken);
      if (!invite) return { status: 404, body: { ok: false, error: 'Invalid invite' } };
      // get enquiry to determine eligibility
      const client = getSupabaseAdmin();
      const { data: enqRes, error } = await client.from('enquiries').select('*').eq('id', invite.enquiry_id).maybeSingle();
      if (error) throw error;
      const enquiry = enqRes;

      const dates = getNextNWeekdayDates(2, CONFIG.weeksAhead);
      const availabilityPromises = dates.map(async (d) => {
        const age = enquiry.dob ? computeAgeOnDate(enquiry.dob, `${d}T00:00:00`) : null;
        const eligibleSlot = (age !== null) ? slotForAge(age) : null;
        const u13Count = await countBookingsForDateSlot(d, 'u13');
        const u15Count = await countBookingsForDateSlot(d, 'u15plus');
        return { date: d, eligibleSlot, slots: { u13: CONFIG.capacityPerSlot - u13Count, u15plus: CONFIG.capacityPerSlot - u15Count } };
      });
      const availability = await Promise.all(availabilityPromises);

      const existingBooking = await getBookingByInvite(invite.id);

      return { status: 200, body: { ok: true, invite, enquiry, availability, booking: existingBooking } };
    }

  } catch (err) {
    console.error('Booking GET error', err);
    return { status: 500, body: { ok: false, error: 'Server error' } };
  }
}

export async function post({ request }) {
  try {
    const body = await request.json();
    const { invite: inviteToken, session_date } = body;
    if (!inviteToken || !session_date) return { status: 400, body: { ok: false, error: 'invite and session_date required' } };

    const invite = await getInviteByToken(inviteToken);
    if (!invite) return { status: 404, body: { ok: false, error: 'Invalid invite' } };
    if (invite.status !== 'pending') return { status: 400, body: { ok: false, error: 'Invite is not available for booking' } };

    const client = getSupabaseAdmin();
    const { data: enqRes, error } = await client.from('enquiries').select('*').eq('id', invite.enquiry_id).maybeSingle();
    if (error) throw error;
    const enquiry = enqRes;

    // determine slot from age on session_date
    const dob = enquiry.dob;
    if (!dob) return { status: 400, body: { ok: false, error: 'DOB required to determine age group' } };

    const age = computeAgeOnDate(dob, `${session_date}T00:00:00`);
    const slot = slotForAge(age);
    if (!slot) return { status: 400, body: { ok: false, error: 'Unable to determine slot for age' } };

    // capacity check
    const count = await countBookingsForDateSlot(session_date, slot);
    if (count >= CONFIG.capacityPerSlot) return { status: 409, body: { ok: false, error: 'No vacancies for this session' } };

    // create booking
    const session_time = CONFIG.slots[slot].time + ':00';
    const booking = await createBooking(enquiry.id, invite.id, session_date, slot, session_time);

    // mark invite accepted and append events
    try {
      await markInviteAccepted(invite.id);
      await appendEnquiryEvent(enquiry.id, { type: 'booking_created', booking_id: booking.id, session_date, slot, at: new Date().toISOString() });
    } catch (err) { console.error('Failed to mark accepted/append event', err); }

    // send confirmation email via Resend if configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      try {
        const res = await sendBookingConfirmation({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM, to: enquiry.email, date: session_date, slotLabel: CONFIG.slots[slot].label });
        try { await appendEnquiryEvent(enquiry.id, { type: 'booking_confirm_email_sent', booking_id: booking.id, resend_id: res.id, at: new Date().toISOString(), meta: res.raw }); } catch (err) { console.error('append event failed', err); }
      } catch (err) {
        console.error('Failed to send booking confirmation', err);
        try { await appendEnquiryEvent(enquiry.id, { type: 'booking_confirm_email_failed', booking_id: booking.id, error: (err && err.response) ? err.response : String(err), at: new Date().toISOString() }); } catch (e) { console.error('append event failed', e); }
      }
    }

    // Persist booking reference on the enquiry
    try {
      const client = getSupabaseAdmin();
      await client.from('enquiries').update({ booking_id: booking.id, booking_date: booking.session_date }).eq('id', enquiry.id);
    } catch (err) {
      console.error('Failed to update enquiry with booking info', err);
    }

    // Notify membership secretary (if configured)
    if (process.env.MEMBERSHIP_SECRETARY_EMAIL && process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      try {
        const subject = `EGAC: New taster booking for ${enquiry.name || enquiry.email}`;
        const html = `<p>A new taster booking has been made:</p>` +
          `<ul>` +
          `<li>Enquiry ID: ${enquiry.id}</li>` +
          `<li>Name: ${enquiry.name || ''}</li>` +
          `<li>Email: ${enquiry.email}</li>` +
          `<li>Session date: ${session_date}</li>` +
          `<li>Slot: ${slot}</li>` +
          `<li>Booking ID: ${booking.id}</li>` +
          `</ul>`;
        const text = `New taster booking: ${session_date} (${slot}) for ${enquiry.name || enquiry.email}. Booking ID: ${booking.id}`;

        const res2 = await sendInviteEmail({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM, to: process.env.MEMBERSHIP_SECRETARY_EMAIL, subject, html, text });
        try { await appendEnquiryEvent(enquiry.id, { type: 'booking_notify_secretary_sent', booking_id: booking.id, resend_id: res2.id, at: new Date().toISOString(), meta: res2.raw }); } catch (err) { console.error('append event failed', err); }
      } catch (err) {
        console.error('Failed to send booking notification to secretary', err);
        try { await appendEnquiryEvent(enquiry.id, { type: 'booking_notify_secretary_failed', booking_id: booking.id, error: (err && err.response) ? err.response : String(err), at: new Date().toISOString() }); } catch (e) { console.error('append event failed', e); }
      }
    }

    return { status: 200, body: { ok: true, booking } };
  } catch (err) {
    console.error('Booking POST error', err);
    return { status: 500, body: { ok: false, error: 'Server error' } };
  }
}
