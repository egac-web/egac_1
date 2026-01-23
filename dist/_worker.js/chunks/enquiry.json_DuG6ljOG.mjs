globalThis.process ??= {}; globalThis.process.env ??= {};
import { o as insertEnquiry, h as getSystemConfigAll, c as createAcademyInvitation, b as appendEnquiryEvent, d as createInviteForEnquiry, a as getSupabaseAdmin, A as markInviteSent } from './supabase_ymhKQ2x1.mjs';
import { c as computeAgeOnDate } from './booking_CA6h9KO-.mjs';

const prerender = false;
async function POST({ request, locals }) {
  try {
    const body = await request.json();
    const env = locals?.runtime?.env || process.env;
    const required = ["contact_name", "contact_email", "gdpr_consent"];
    const missing = required.filter((k) => !body[k]);
    if (missing.length) {
      return new Response(JSON.stringify({ ok: false, error: `Missing fields: ${missing.join(", ")}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (body.interest === "Other" && !body.message) {
      return new Response(JSON.stringify({ ok: false, error: "Message is required when selecting Other" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (body.honeypot) {
      return new Response(JSON.stringify({ ok: false, error: "Spam detected" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(body.contact_email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!(body.gdpr_consent === true || body.gdpr_consent === "true" || body.gdpr_consent === "on")) {
      return new Response(JSON.stringify({ ok: false, error: "GDPR consent required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if ((body.interest === "Training" || body.area_of_interest === "Training") && !(body.dob || body.subject_dob)) {
      return new Response(JSON.stringify({ ok: false, error: "Date of birth is required for Training enquiries" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const someoneElse = body.enquiry_for === "someone_else" || body.enquiry_for === "child";
    if (someoneElse) {
      const missingForSomeoneElse = [];
      if (!body.contact_phone) missingForSomeoneElse.push("contact_phone");
      if (!body.subject_first_name) missingForSomeoneElse.push("subject_first_name");
      if (!body.subject_last_name) missingForSomeoneElse.push("subject_last_name");
      if (!body.subject_dob && !body.dob) missingForSomeoneElse.push("subject_dob");
      if (missingForSomeoneElse.length) {
        return new Response(JSON.stringify({ ok: false, error: `Missing fields for someone-else enquiries: ${missingForSomeoneElse.join(", ")}` }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (body.subject_dob) body.dob = body.subject_dob;
    }
    if (env.RECAPTCHA_SECRET && body["g-recaptcha-response"]) {
      const token = body["g-recaptcha-response"];
      const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(env.RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`
      });
      const json = await verifyRes.json();
      if (!json.success) return new Response(JSON.stringify({ ok: false, error: "recaptcha failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (env.HCAPTCHA_SECRET && body["h-captcha-response"]) {
      const token = body["h-captcha-response"];
      const verifyRes = await fetch(`https://hcaptcha.com/siteverify`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(env.HCAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`
      });
      const json = await verifyRes.json();
      if (!json.success) return new Response(JSON.stringify({ ok: false, error: "hCaptcha failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const name = body.contact_name || `${(body.first_name || "").trim()} ${(body.last_name || "").trim()}`.trim();
    const training_days = Array.isArray(body.training_days) ? body.training_days : body.training_days ? [body.training_days] : null;
    let note = body.message || null;
    if (body.subject_first_name) {
      const sname = `${body.subject_first_name || ""} ${body.subject_last_name || ""}`.trim();
      const sdob = body.subject_dob || "";
      const subjStr = `Subject: ${sname}${sdob ? ` (DOB: ${sdob})` : ""}.`;
      note = note ? `${note} ${subjStr}` : subjStr;
    }
    const enquiryPayload = {
      name: name || null,
      email: body.contact_email,
      phone: body.contact_phone || null,
      interest: body.interest || body.area_of_interest || null,
      training_days: training_days ? JSON.parse(JSON.stringify(training_days)) : null,
      dob: body.dob || null,
      source: body.source || "website",
      note: note || null,
      raw_payload: body
    };
    const inserted = await insertEnquiry(enquiryPayload, env);
    let invite = null;
    let isAcademy = false;
    try {
      const config = await getSystemConfigAll(env);
      const academyMaxAge = config && config.academy_max_age ? parseInt(String(config.academy_max_age), 10) : 10;
      if (inserted && inserted.dob) {
        const ageOnAug31 = computeAgeOnDate(inserted.dob, "2026-08-31");
        if (ageOnAug31 !== null && !Number.isNaN(ageOnAug31) && ageOnAug31 <= academyMaxAge) {
          isAcademy = true;
          try {
            const acadInv = await createAcademyInvitation(inserted.id, env);
            try {
              await appendEnquiryEvent(inserted.id, { type: "academy_invitation_created", invite_id: acadInv.id, at: (/* @__PURE__ */ new Date()).toISOString() }, env);
            } catch (e) {
              console.error("Failed to append academy_invitation_created", e);
            }
            try {
              const { sendAcademyWaitlistNotification } = await import('./notifications_CX5oPyXA.mjs');
              await sendAcademyWaitlistNotification({ enquiry: inserted, invitation: acadInv, env });
            } catch (e) {
              console.error("sendAcademyWaitlistNotification failed", e);
            }
          } catch (e) {
            console.error("createAcademyInvitation failed", e);
          }
        }
      }
    } catch (e) {
      console.error("Failed to evaluate academy eligibility", e);
    }
    if (!isAcademy) {
      try {
        invite = await createInviteForEnquiry(inserted.id, env);
        try {
          const client = getSupabaseAdmin(env);
          await client.from("enquiries").update({ invite_id: invite.id }).eq("id", inserted.id);
        } catch (err) {
          console.error("Could not update enquiry with invite id", err);
        }
        try {
          const { sendInviteNotification } = await import('./notifications_CX5oPyXA.mjs');
          const inviteUrl = `${env.SITE_BASE_URL || ""}/bookings?invite=${encodeURIComponent(invite.token)}`;
          await sendInviteNotification({ enquiryId: inserted.id, inviteId: invite.id, to: inserted.email, inviteUrl, env });
        } catch (err) {
          console.error("sendInviteNotification failed", err);
        }
      } catch (err) {
        console.error("Failed to create invite record for enquiry", err);
      }
    } else {
      try {
        await appendEnquiryEvent(inserted.id, { type: "academy_waitlist_added", at: (/* @__PURE__ */ new Date()).toISOString() }, env);
      } catch (e) {
        console.error("Failed to append academy_waitlist_added", e);
      }
    }
    try {
      const config = await getSystemConfigAll(env);
      const academyMaxAge = config && config.academy_max_age ? parseInt(String(config.academy_max_age), 10) : 10;
      if (inserted && inserted.dob) {
        const ageOnAug31 = computeAgeOnDate(inserted.dob, "2026-08-31");
        if (ageOnAug31 !== null && !Number.isNaN(ageOnAug31) && ageOnAug31 <= academyMaxAge) {
          try {
            const acadInv = await createAcademyInvitation(inserted.id, env);
            try {
              await appendEnquiryEvent(inserted.id, { type: "academy_invitation_created", invite_id: acadInv.id, at: (/* @__PURE__ */ new Date()).toISOString() }, env);
            } catch (e) {
              console.error("Failed to append academy_invitation_created", e);
            }
          } catch (e) {
            console.error("createAcademyInvitation failed", e);
          }
        }
      }
    } catch (e) {
      console.error("Failed to evaluate academy eligibility", e);
    }
    const webhook = env.ENQUIRY_WEBHOOK || null;
    const payloadForWebhook = { enquiry: inserted, invite };
    if (webhook) {
      try {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadForWebhook)
        });
        if (!res.ok) {
          console.error("Webhook forwarding failed", res.status, await res.text().catch(() => ""));
        } else if (invite) {
          try {
            await markInviteSent(invite.id);
          } catch (e) {
            console.error("markInviteSent failed", e);
          }
        }
      } catch (err) {
        console.error("Error forwarding to webhook", err);
      }
    }
    return new Response(JSON.stringify({ ok: true, enquiry_id: inserted.id, invite_id: invite ? invite.id : null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Enquiry endpoint error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

export { POST as P, _page as _ };
