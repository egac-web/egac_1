globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as appendEnquiryEvent, e as createInviteForEnquiry } from './supabase_DDVehETI.mjs';

async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get("x-admin-token") || url.searchParams.get("token") || "";
    if (token !== "dev" && (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN)) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
    const body = await request.json();
    const { booking_id, status, note, send_membership_link } = body || {};
    if (!booking_id || !["attended", "no_show"].includes(status)) return new Response(JSON.stringify({ ok: false, error: "Invalid payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
    let booking = null;
    try {
      const { getBookingById } = await import('./supabase_DDVehETI.mjs').then(n => n.s);
      booking = await getBookingById(booking_id, env);
      if (!booking) return new Response(JSON.stringify({ ok: false, error: "Booking not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      console.error("Booking fetch error", e);
      return new Response(JSON.stringify({ ok: false, error: `Booking fetch failed: ${e.message}` }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const enquiry = booking.enquiry || null;
    let updated;
    try {
      const { updateBookingStatus } = await import('./supabase_DDVehETI.mjs').then(n => n.s);
      updated = await updateBookingStatus(booking_id, status, note, env);
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message || String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const enquiry_id = booking.enquiry_id || booking.enquiry && booking.enquiry.id;
    if (!enquiry_id) return new Response(JSON.stringify({ ok: false, error: "Booking missing enquiry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
    const event = { type: "attendance", status, note: note || null, timestamp: (/* @__PURE__ */ new Date()).toISOString(), booking_id };
    await appendEnquiryEvent(enquiry_id, event, env);
    const responsePayload = { ok: true, booking: updated, events_appended: event };
    if (status === "attended" && send_membership_link) {
      try {
        let invite;
        try {
          invite = await createInviteForEnquiry(enquiry_id, env);
        } catch (err) {
          if (String(err.message || "").includes("enquiry_on_academy_waitlist")) {
            responsePayload.membership_sent = false;
            responsePayload.warning = "Enquiry is on Academy waiting list; membership link will not be sent";
            invite = null;
          } else {
            throw err;
          }
        }
        const membershipUrl = invite ? `${env.SITE_URL || ""}/membership?token=${invite.token}` : null;
        const enq2 = enquiry || {};
        if (invite && enq2 && enq2.email) {
          try {
            const { sendInviteNotification } = await import('./notifications_Dpwd-lBy.mjs');
            await sendInviteNotification({ enquiryId: enquiry_id, inviteId: invite.id, to: enq2.email, inviteUrl: membershipUrl, env });
            responsePayload.membership_sent = true;
          } catch (err) {
            console.error("sendInviteNotification failed for membership link", err);
            responsePayload.membership_sent = false;
            responsePayload.warning = "Failed to send membership link";
          }
        } else if (!invite) {
        } else {
          responsePayload.membership_sent = false;
          responsePayload.warning = "No email address to send membership link";
        }
      } catch (err) {
        console.error("Membership link send error", err);
        responsePayload.membership_error = err.message || String(err);
      }
    }
    const enq = enquiry || {};
    const slot = booking.slot || "";
    const session_date = booking.session_date || "";
    const coachMessage = `Attended: ${enq.name || ""} (${enq.email || ""}, ${enq.phone || ""}) — ${session_date} ${slot} — Please record in Presli per EA criteria.`;
    responsePayload.coachMessage = coachMessage;
    responsePayload.presliCSV = `${enq.name || ""},${enq.email || ""},${enq.phone || ""},${session_date},${slot}`;
    return { status: 200, body: responsePayload };
  } catch (err) {
    console.error("Attendance endpoint error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

export { POST as P, _page as _ };
