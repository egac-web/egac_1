globalThis.process ??= {}; globalThis.process.env ??= {};
import { y as countBookingsForDateSlot, v as getInviteByToken, a as getSupabaseAdmin, w as getBookingByInvite, p as createBooking, z as markInviteAccepted, b as appendEnquiryEvent } from '../../chunks/supabase_ymhKQ2x1.mjs';
import { g as getNextNWeekdayDates, C as CONFIG, c as computeAgeOnDate, s as slotForAge } from '../../chunks/booking_CA6h9KO-.mjs';
import { s as sendInviteEmail } from '../../chunks/resend_CZA8PHeW.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BTUeEnL1.mjs';

async function OPTIONS({ request }) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const inviteToken = url.searchParams.get("invite");
    const dateParam = url.searchParams.get("date");
    if (!inviteToken && !dateParam) {
      const dates = getNextNWeekdayDates(2, CONFIG.weeksAhead);
      const availabilityPromises = dates.map(async (d) => {
        const u13Count = await countBookingsForDateSlot(d, "u13", env);
        const u15Count = await countBookingsForDateSlot(d, "u15plus", env);
        return { date: d, slots: { u13: CONFIG.capacityPerSlot - u13Count, u15plus: CONFIG.capacityPerSlot - u15Count } };
      });
      const availability = await Promise.all(availabilityPromises);
      return new Response(JSON.stringify({ ok: true, availability }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (inviteToken) {
      const invite = await getInviteByToken(inviteToken, env);
      if (!invite) return new Response(JSON.stringify({ ok: false, error: "Invalid invite" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
      const client = getSupabaseAdmin(env);
      const { data: enqRes, error } = await client.from("enquiries").select("*").eq("id", invite.enquiry_id).maybeSingle();
      if (error) throw error;
      const enquiry = enqRes;
      const dates = getNextNWeekdayDates(2, CONFIG.weeksAhead);
      const availabilityPromises = dates.map(async (d) => {
        const age = enquiry.dob ? computeAgeOnDate(enquiry.dob, `${d}T00:00:00`) : null;
        const eligibleSlot = age !== null ? slotForAge(age) : null;
        const u13Count = await countBookingsForDateSlot(d, "u13", env);
        const u15Count = await countBookingsForDateSlot(d, "u15plus", env);
        return { date: d, eligibleSlot, slots: { u13: CONFIG.capacityPerSlot - u13Count, u15plus: CONFIG.capacityPerSlot - u15Count } };
      });
      const availability = await Promise.all(availabilityPromises);
      const existingBooking = await getBookingByInvite(invite.id, env);
      return new Response(JSON.stringify({ ok: true, invite, enquiry, availability, booking: existingBooking }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err) {
    console.error("Booking GET error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const body = await request.json();
    const { invite: inviteToken, session_date } = body;
    if (!inviteToken || !session_date) return new Response(JSON.stringify({ ok: false, error: "invite and session_date required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
    const invite = await getInviteByToken(inviteToken, env);
    if (!invite) return new Response(JSON.stringify({ ok: false, error: "Invalid invite" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
    if (!["pending", "sent"].includes(invite.status)) return new Response(JSON.stringify({ ok: false, error: "Invite is not available for booking" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
    const client = getSupabaseAdmin(env);
    const { data: enqRes, error } = await client.from("enquiries").select("*").eq("id", invite.enquiry_id).maybeSingle();
    if (error) throw error;
    const enquiry = enqRes;
    const existingBooking = await getBookingByInvite(invite.id, env);
    if (existingBooking) return new Response(JSON.stringify({ ok: false, error: "Invite already has a booking", booking: existingBooking }), {
      status: 409,
      headers: { "Content-Type": "application/json" }
    });
    const dob = enquiry.dob;
    if (!dob) return new Response(JSON.stringify({ ok: false, error: "DOB required to determine age group" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
    const age = computeAgeOnDate(dob, `${session_date}T00:00:00`);
    const slot = slotForAge(age);
    if (!slot) return new Response(JSON.stringify({ ok: false, error: "Unable to determine slot for age" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
    const count = await countBookingsForDateSlot(session_date, slot, env);
    if (count >= CONFIG.capacityPerSlot) return new Response(JSON.stringify({ ok: false, error: "No vacancies for this session" }), {
      status: 409,
      headers: { "Content-Type": "application/json" }
    });
    const session_time = CONFIG.slots[slot].time + ":00";
    const booking = await createBooking(enquiry.id, invite.id, session_date, slot, session_time, env);
    try {
      await markInviteAccepted(invite.id, env);
      await appendEnquiryEvent(enquiry.id, { type: "booking_created", booking_id: booking.id, session_date, slot, at: (/* @__PURE__ */ new Date()).toISOString() }, env);
    } catch (err) {
      console.error("Failed to mark accepted/append event", err);
    }
    try {
      const { sendBookingConfirmationNotification } = await import('../../chunks/notifications_CX5oPyXA.mjs');
      await sendBookingConfirmationNotification({ enquiryId: enquiry.id, bookingId: booking.id, to: enquiry.email, date: session_date, slotLabel: CONFIG.slots[slot].label, env });
    } catch (err) {
      console.error("sendBookingConfirmationNotification failed", err);
    }
    try {
      const client2 = getSupabaseAdmin(env);
      await client2.from("enquiries").update({ booking_id: booking.id, booking_date: booking.session_date }).eq("id", enquiry.id);
    } catch (err) {
      console.error("Failed to update enquiry with booking info", err);
    }
    if (env.MEMBERSHIP_SECRETARY_EMAIL && env.RESEND_API_KEY && env.RESEND_FROM) {
      try {
        const subject = `EGAC: New taster booking for ${enquiry.name || enquiry.email}`;
        const html = `<p>A new taster booking has been made:</p><ul><li>Enquiry ID: ${enquiry.id}</li><li>Name: ${enquiry.name || ""}</li><li>Email: ${enquiry.email}</li><li>Session date: ${session_date}</li><li>Slot: ${slot}</li><li>Booking ID: ${booking.id}</li></ul>`;
        const text = `New taster booking: ${session_date} (${slot}) for ${enquiry.name || enquiry.email}. Booking ID: ${booking.id}`;
        const res2 = await sendInviteEmail({ apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM, to: env.MEMBERSHIP_SECRETARY_EMAIL, subject, html, text });
        try {
          await appendEnquiryEvent(enquiry.id, { type: "booking_notify_secretary_sent", booking_id: booking.id, resend_id: res2.id, at: (/* @__PURE__ */ new Date()).toISOString(), meta: res2.raw }, env);
        } catch (err) {
          console.error("append event failed", err);
        }
      } catch (err) {
        console.error("Failed to send booking notification to secretary", err);
        try {
          await appendEnquiryEvent(enquiry.id, { type: "booking_notify_secretary_failed", booking_id: booking.id, error: err && err.response ? err.response : String(err), at: (/* @__PURE__ */ new Date()).toISOString() }, env);
        } catch (e) {
          console.error("append event failed", e);
        }
      }
    }
    return new Response(JSON.stringify({ ok: true, booking }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Booking POST error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
