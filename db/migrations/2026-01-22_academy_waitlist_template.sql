-- 2026-01-22: Seed academy_waitlist email template
BEGIN;

INSERT INTO email_templates ("key", language, subject, html, text)
VALUES
  ('academy_waitlist', 'en', 'EGAC: Added to Academy waiting list', $$
  <!doctype html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>EGAC: Added to Academy waiting list</title>
    <style>
      body { background: #f7f7f9; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #222; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; }
      .card { background: #ffffff; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
      .hero { padding: 24px; }
      .hero h1 { margin: 0 0 12px 0; font-size: 20px; }
      .hero p { margin: 0 0 12px 0; color: #333; line-height: 1.5; }
      .footer { padding: 16px 24px; font-size: 12px; color: #666; background: #fafafa; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="hero">
          <h1>Added to Academy waiting list (U11)</h1>
          <p>Hello {{#if childName}}{{childName}}{{else}}there{{/if}},</p>
          <p>Thanks for your enquiry. We've added your child to the EGAC Academy waiting list (U11). We will contact people in order during the Spring with an invitation to join the intake.</p>
          <p>Please note: you will not be given an opportunity to book a taster session — we'll invite families in order when spaces become available.</p>
        </div>
        <div class="footer">
          <div>Thank you for your interest in East Grinstead AC.</div>
          <div style="margin-top:8px">East Grinstead AC • Academy Programme</div>
        </div>
      </div>
    </div>
  </body>
  </html>
  $$, $$Hello,

Thanks for your enquiry. We've added your child to the EGAC Academy waiting list (U11). We'll contact people in order during the Spring with an invitation. You will not be given an opportunity to book a taster session.

Best regards,
East Grinstead AC$$)
ON CONFLICT ("key") DO NOTHING;

COMMIT;
