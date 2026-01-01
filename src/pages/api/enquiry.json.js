import { insertEnquiry, createInviteForEnquiry, markInviteSent, getSupabaseAdmin } from '../../lib/supabase';

// This API route must be server-rendered so POST requests are accepted during dev/runtime
export const prerender = false;

export async function POST({ request, locals }) {
  try {
    const body = await request.json();

    // Get runtime env from Cloudflare Pages context
    const env = locals?.runtime?.env || process.env;

    // Basic server-side validation
    const required = ["contact_name", "contact_email", "gdpr_consent"];
    const missing = required.filter((k) => !body[k]);
    if (missing.length) {
      return new Response(JSON.stringify({ ok: false, error: `Missing fields: ${missing.join(", ")}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Message is only required when 'Other' is selected
    if (body.interest === 'Other' && !body.message) {
      return new Response(JSON.stringify({ ok: false, error: 'Message is required when selecting Other' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Honeypot check
    if (body.honeypot) {
      return new Response(JSON.stringify({ ok: false, error: "Spam detected" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Email format check (simple)
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(body.contact_email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // GDPR consent must be true-ish
    if (!(body.gdpr_consent === true || body.gdpr_consent === "true" || body.gdpr_consent === "on")) {
      return new Response(JSON.stringify({ ok: false, error: "GDPR consent required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If interest is Training, DOB is required (subject DOB is accepted when enquiring for someone else)
    if ((body.interest === 'Training' || body.area_of_interest === 'Training') && !(body.dob || body.subject_dob)) {
      return new Response(JSON.stringify({ ok: false, error: 'Date of birth is required for Training enquiries' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If enquiring on behalf of someone else (parent/guardian), require contact phone and subject details
    const someoneElse = (body.enquiry_for === 'someone_else' || body.enquiry_for === 'child');
    if (someoneElse) {
      const missingForSomeoneElse = [];
      if (!body.contact_phone) missingForSomeoneElse.push('contact_phone');
      if (!body.subject_first_name) missingForSomeoneElse.push('subject_first_name');
      if (!body.subject_last_name) missingForSomeoneElse.push('subject_last_name');
      if (!body.subject_dob && !body.dob) missingForSomeoneElse.push('subject_dob');
      if (missingForSomeoneElse.length) {
        return new Response(JSON.stringify({ ok: false, error: `Missing fields for someone-else enquiries: ${missingForSomeoneElse.join(', ')}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Prefer subject_dob as the canonical DOB for age mapping
      if (body.subject_dob) body.dob = body.subject_dob;
    }

    // Optional: ReCAPTCHA / hCaptcha verification (if secrets provided)
    if (env.RECAPTCHA_SECRET && body['g-recaptcha-response']) {
      const token = body['g-recaptcha-response'];
      const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(env.RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
      });
      const json = await verifyRes.json();
      if (!json.success) return new Response(JSON.stringify({ ok: false, error: 'recaptcha failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (env.HCAPTCHA_SECRET && body['h-captcha-response']) {
      const token = body['h-captcha-response'];
      const verifyRes = await fetch(`https://hcaptcha.com/siteverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(env.HCAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
      });
      const json = await verifyRes.json();
      if (!json.success) return new Response(JSON.stringify({ ok: false, error: 'hCaptcha failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build structured enquiry payload for storage
    const name = body.contact_name || `${(body.first_name || '').trim()} ${(body.last_name || '').trim()}`.trim();
    const training_days = Array.isArray(body.training_days)
      ? body.training_days
      : (body.training_days ? [body.training_days] : null);

    let note = body.message || null;
    if (body.subject_first_name) {
      const sname = `${body.subject_first_name || ''} ${body.subject_last_name || ''}`.trim();
      const sdob = body.subject_dob || '';
      const subjStr = `Subject: ${sname}${sdob ? ` (DOB: ${sdob})` : ''}.`;
      note = note ? `${note} ${subjStr}` : subjStr;
    }

    const enquiryPayload = {
      name: name || null,
      email: body.contact_email,
      phone: body.contact_phone || null,
      interest: body.interest || body.area_of_interest || null,
      training_days: training_days ? JSON.parse(JSON.stringify(training_days)) : null,
      dob: body.dob || null,
      source: body.source || 'website',
      note: note || null,
      raw_payload: body,
    };

    // Persist to Supabase
    const inserted = await insertEnquiry(enquiryPayload, env);

    // Create an invite record for the enquiry
    let invite = null;
    try {
      invite = await createInviteForEnquiry(inserted.id, env);
      // update enquiry to reference invite
      try {
        const client = getSupabaseAdmin(env);
        await client.from('enquiries').update({ invite_id: invite.id }).eq('id', inserted.id);
      } catch (err) {
        console.error('Could not update enquiry with invite id', err);
      }

      // Send invite email via notifications helper (records events and marks invite)
      try {
        const { sendInviteNotification } = await import('../../lib/notifications');
        const inviteUrl = `${env.SITE_BASE_URL || ''}/booking?invite=${encodeURIComponent(invite.token)}`;
        await sendInviteNotification({ enquiryId: inserted.id, inviteId: invite.id, to: inserted.email, inviteUrl, env });
      } catch (err) {
        console.error('sendInviteNotification failed', err);
      }

    } catch (err) {
      console.error('Failed to create invite record for enquiry', err);
    }

    // Forward to webhook (Make/automation) if configured, include canonical IDs
    const webhook = env.ENQUIRY_WEBHOOK || null;
    const payloadForWebhook = { enquiry: inserted, invite };

    if (webhook) {
      try {
        const res = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadForWebhook),
        });

        if (!res.ok) {
          console.error('Webhook forwarding failed', res.status, await res.text().catch(() => ''));
        } else if (invite) {
          // Mark invite as sent
          try { await markInviteSent(invite.id); } catch (e) { console.error('markInviteSent failed', e); }
        }
      } catch (err) {
        console.error('Error forwarding to webhook', err);
      }
    }

    return new Response(JSON.stringify({ ok: true, enquiry_id: inserted.id, invite_id: invite ? invite.id : null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Enquiry endpoint error', err);
    // Return a generic server error to callers and keep server log for details
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
