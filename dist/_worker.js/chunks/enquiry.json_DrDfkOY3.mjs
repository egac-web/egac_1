globalThis.process ??= {}; globalThis.process.env ??= {};
import { insertEnquiry, createInviteForEnquiry, getSupabaseAdmin, markInviteSent } from './supabase_BuGpVBnm.mjs';

const prerender = false;
async function post({ request }) {
  try {
    const body = await request.json();
    const required = ["contact_name", "contact_email", "gdpr_consent"];
    const missing = required.filter((k) => !body[k]);
    if (missing.length) {
      return {
        status: 400,
        body: { ok: false, error: `Missing fields: ${missing.join(", ")}` }
      };
    }
    if (body.interest === "Other" && !body.message) {
      return { status: 400, body: { ok: false, error: "Message is required when selecting Other" } };
    }
    if (body.honeypot) {
      return { status: 400, body: { ok: false, error: "Spam detected" } };
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(body.contact_email)) {
      return { status: 400, body: { ok: false, error: "Invalid email" } };
    }
    if (!(body.gdpr_consent === true || body.gdpr_consent === "true" || body.gdpr_consent === "on")) {
      return { status: 400, body: { ok: false, error: "GDPR consent required" } };
    }
    if ((body.interest === "Training" || body.area_of_interest === "Training") && !(body.dob || body.subject_dob)) {
      return { status: 400, body: { ok: false, error: "Date of birth is required for Training enquiries" } };
    }
    const someoneElse = body.enquiry_for === "someone_else" || body.enquiry_for === "child";
    if (someoneElse) {
      const missingForSomeoneElse = [];
      if (!body.contact_phone) missingForSomeoneElse.push("contact_phone");
      if (!body.subject_first_name) missingForSomeoneElse.push("subject_first_name");
      if (!body.subject_last_name) missingForSomeoneElse.push("subject_last_name");
      if (!body.subject_dob && !body.dob) missingForSomeoneElse.push("subject_dob");
      if (missingForSomeoneElse.length) {
        return { status: 400, body: { ok: false, error: `Missing fields for someone-else enquiries: ${missingForSomeoneElse.join(", ")}` } };
      }
      if (body.subject_dob) body.dob = body.subject_dob;
    }
    if (process.env.RECAPTCHA_SECRET && body["g-recaptcha-response"]) {
      const token = body["g-recaptcha-response"];
      const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(process.env.RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`
      });
      const json = await verifyRes.json();
      if (!json.success) return { status: 400, body: { ok: false, error: "recaptcha failed" } };
    }
    if (process.env.HCAPTCHA_SECRET && body["h-captcha-response"]) {
      const token = body["h-captcha-response"];
      const verifyRes = await fetch(`https://hcaptcha.com/siteverify`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(process.env.HCAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`
      });
      const json = await verifyRes.json();
      if (!json.success) return { status: 400, body: { ok: false, error: "hCaptcha failed" } };
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
    const inserted = await insertEnquiry(enquiryPayload);
    let invite = null;
    try {
      invite = await createInviteForEnquiry(inserted.id);
      try {
        const client = getSupabaseAdmin();
        await client.from("enquiries").update({ invite_id: invite.id }).eq("id", inserted.id);
      } catch (err) {
        console.error("Could not update enquiry with invite id", err);
      }
      if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
        try {
          const { sendInviteEmail } = await import('./resend_DtyeWbHC.mjs');
          const inviteUrl = `${process.env.SITE_BASE_URL || ""}/booking?invite=${encodeURIComponent(invite.token)}`;
          const html = `<p>Hello ${inserted.name || ""},</p><p>Thanks for your enquiry. To book a free taster, please follow this link:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p><p>If you did not request this, ignore this email.</p>`;
          const text = `Hello ${inserted.name || ""}

Book here: ${inviteUrl}`;
          const res = await sendInviteEmail({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM, to: inserted.email, subject: "EGAC: Book a taster / session", html, text });
          try {
            const { appendEnquiryEvent } = await import('./supabase_BuGpVBnm.mjs');
            await appendEnquiryEvent(inserted.id, { type: "invite_sent", invite_id: invite.id, resend_id: res.id, at: (/* @__PURE__ */ new Date()).toISOString(), meta: res.raw });
          } catch (err) {
            console.error("Failed to append enquiry event", err);
          }
          try {
            await markInviteSent(invite.id);
          } catch (e) {
            console.error("markInviteSent failed", e);
          }
        } catch (err) {
          console.error("Failed to send invite email", err);
          try {
            const { appendEnquiryEvent } = await import('./supabase_BuGpVBnm.mjs');
            await appendEnquiryEvent(inserted.id, { type: "invite_send_failed", invite_id: invite.id, error: err && err.response ? err.response : String(err), at: (/* @__PURE__ */ new Date()).toISOString() });
          } catch (err2) {
            console.error("Failed to append enquiry event for failed send", err2);
          }
        }
      }
    } catch (err) {
      console.error("Failed to create invite record for enquiry", err);
    }
    const webhook = process.env.ENQUIRY_WEBHOOK || null;
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
    } else {
      console.log("Saved enquiry:", { enquiry: inserted, invite });
    }
    return { status: 200, body: { ok: true, enquiry_id: inserted.id, invite_id: invite ? invite.id : null } };
  } catch (err) {
    console.error("Enquiry endpoint error", err);
    return { status: 500, body: { ok: false, error: "Server error" } };
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  post,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

export { _page as _, post as p };
