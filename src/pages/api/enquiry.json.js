export async function post({ request }) {
  try {
    const body = await request.json();

    // Basic server-side validation
    const required = ["contact_name", "contact_email", "message", "gdpr_consent"];
    const missing = required.filter((k) => !body[k]);
    if (missing.length) {
      return {
        status: 400,
        body: { ok: false, error: `Missing fields: ${missing.join(", ")}` },
      };
    }

    // Honeypot check
    if (body.honeypot) {
      return { status: 400, body: { ok: false, error: "Spam detected" } };
    }

    // Email format check (simple)
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(body.contact_email)) {
      return { status: 400, body: { ok: false, error: "Invalid email" } };
    }

    // GDPR consent must be true-ish
    if (!(body.gdpr_consent === true || body.gdpr_consent === "true" || body.gdpr_consent === "on")) {
      return { status: 400, body: { ok: false, error: "GDPR consent required" } };
    }

    // Optional: ReCAPTCHA / hCaptcha verification (if secrets provided)
    if (process.env.RECAPTCHA_SECRET && body['g-recaptcha-response']) {
      const token = body['g-recaptcha-response'];
      const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(process.env.RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
      });
      const json = await verifyRes.json();
      if (!json.success) return { status: 400, body: { ok: false, error: 'recaptcha failed' } };
    }
    if (process.env.HCAPTCHA_SECRET && body['h-captcha-response']) {
      const token = body['h-captcha-response'];
      const verifyRes = await fetch(`https://hcaptcha.com/siteverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(process.env.HCAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
      });
      const json = await verifyRes.json();
      if (!json.success) return { status: 400, body: { ok: false, error: 'hCaptcha failed' } };
    }

    // Forward to webhook if configured, else log to console
    const webhook = process.env.ENQUIRY_WEBHOOK || null;
    if (webhook) {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else {
      // fallback: print to server logs
      console.log('Enquiry received:', body);
    }

    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error('Enquiry endpoint error', err);
    return { status: 500, body: { ok: false, error: 'Server error' } };
  }
}
