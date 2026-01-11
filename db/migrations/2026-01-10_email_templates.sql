-- 2026-01-10: Add email_templates table to manage email content from the admin portal
BEGIN;

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'en' NOT NULL,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default templates (taken from src/lib/emailTemplates.ts)
INSERT INTO email_templates ("key", language, subject, html, text)
VALUES
  ('invite_email', 'en', '{{siteName}}: Book a taster / session', $$
  <!doctype html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>{{siteName}}: Book a taster / session</title>
    <style>
      /* Basic, inlined-friendly styling */
      body { background: #f7f7f9; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #222; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; }
      .card { background: #ffffff; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
      .header { padding: 20px; display: flex; align-items: center; gap: 12px; }
      .brand { font-weight: 700; font-size: 18px; color: {{accentColor}}; }
      .hero { padding: 24px; }
      .hero h1 { margin: 0 0 8px 0; font-size: 20px; }
      .hero p { margin: 0 0 16px 0; color: #333; }
      .cta { display: inline-block; background: {{accentColor}}; color: #fff; padding: 12px 18px; border-radius: 6px; text-decoration: none; font-weight: 600; }
      .footer { padding: 16px 24px; font-size: 12px; color: #666; background: #fafafa; }
      @media (max-width:480px) { .hero h1 { font-size: 18px; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          {{#if logoUrl}}<img src="{{logoUrl}}" alt="{{siteName}}" width="40" style="display:block;border-radius:4px"/>{{/if}}
          <div class="brand">{{siteName}}</div>
        </div>
        <div class="hero">
          <h1>Book your free taster</h1>
          <p>Thanks for your enquiry — to book a free taster session, please use the button below.</p>
          <p><a class="cta" href="{{inviteUrl}}">Book a session</a></p>
          <p style="margin-top:8px;color:#666;font-size:13px">Or paste this link into your browser:<br/><a href="{{inviteUrl}}">{{inviteUrl}}</a></p>
        </div>
        <div class="footer">
          <div>If you did not request this, you can ignore this email.</div>
          <div style="margin-top:8px">{{siteName}} • <a href="{{inviteUrl}}">{{inviteUrl}}</a></div>
        </div>
      </div>
    </div>
  </body>
  </html>
  $$, $$Hello,

Thanks for your enquiry. Book a free taster at: {{inviteUrl}}

If you did not request this, ignore this email.$$),
  ('booking_confirmation', 'en', '{{siteName}}: Booking confirmed', $$<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>{{siteName}}: Booking confirmed</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#222;margin:0;padding:0} .container{max-width:600px;margin:0 auto;padding:20px} .card{background:#fff;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.06)} .cta{display:inline-block;background:{{accentColor}};color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:600}</style></head><body><div class="container"><div class="card"><h1>Booking confirmed</h1><p>Your booking for <strong>{{date}}</strong> ({{slotLabel}}) is confirmed. We look forward to seeing you.</p></div></div></body></html>$$, $$Your booking for {{date}} ({{slotLabel}}) is confirmed.$$),
  ('reminder', 'en', '{{siteName}}: Reminder - upcoming taster session', $$<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>{{siteName}}: Reminder - upcoming taster session</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#222;margin:0;padding:0} .container{max-width:600px;margin:0 auto;padding:20px} .card{background:#fff;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.06)} .cta{display:inline-block;background:#333;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:600}</style></head><body><div class="container"><div class="card"><h1>Reminder: upcoming taster</h1><p>This is a reminder that your free taster session is scheduled for <strong>{{date}}</strong> ({{slotLabel}}) tomorrow. We look forward to seeing you.</p></div></div></body></html>$$, $$Reminder: your taster session on {{date}} ({{slotLabel}}) is tomorrow.$$),
  ('academy_invitation', 'en', '{{siteName}}: Academy Invitation - March/April Intake', $$
  <!doctype html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>{{siteName}}: Academy Invitation - March/April Intake</title>
    <style>
      body { background: #f7f7f9; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #222; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; }
      .card { background: #ffffff; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
      .header { padding: 20px; background: linear-gradient(135deg, {{accentColor}} 0%, #0d4a8f 100%); color: #fff; }
      .brand { font-weight: 700; font-size: 20px; }
      .hero { padding: 24px; }
      .hero h1 { margin: 0 0 12px 0; font-size: 22px; color: {{accentColor}}; }
      .hero p { margin: 0 0 16px 0; color: #333; line-height: 1.6; }
      .cta-container { display: flex; gap: 12px; margin: 24px 0; }
      .cta { display: inline-block; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; text-align: center; flex: 1; }
      .cta-yes { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; }
      .cta-no { background: #f3f4f6; color: #991b1b; border: 2px solid #fee2e2; }
      .footer { padding: 16px 24px; font-size: 12px; color: #666; background: #fafafa; }
      @media (max-width:480px) { .cta-container { flex-direction: column; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <div class="brand">{{siteName}}</div>
          <div style="font-size:14px;margin-top:4px">Academy Invitation</div>
        </div>
        <div class="hero">
          <h1>🏃 Academy Invitation (U11)</h1>
          <p>Hello {{#if childName}}regarding {{childName}}{{else}}from East Grinstead AC{{/if}},</p>
          <p>Thank you for your interest in the <strong>{{siteName}} Academy</strong> for young athletes (U11). We are pleased to invite you to join our <strong>March/April intake</strong>.</p>
          <p>We have limited spaces available and would like to confirm your continued interest. Please let us know by clicking one of the buttons below:</p>
          <div class="cta-container">
            <a class="cta cta-yes" href="{{responseYesUrl}}">✅ Yes, Still Interested</a>
            <a class="cta cta-no" href="{{responseNoUrl}}">❌ No Longer Interested</a>
          </div>
          <p style="font-size:13px;color:#666;">If the buttons don't work, copy and paste one of these links:<br/>
          Yes: <a href="{{responseYesUrl}}">{{responseYesUrl}}</a><br/>
          No: <a href="{{responseNoUrl}}">{{responseNoUrl}}</a></p>
        </div>
        <div class="footer">
          <div>Thank you for your interest in East Grinstead AC.</div>
          <div style="margin-top:8px">{{siteName}} • Academy Programme</div>
        </div>
      </div>
    </div>
  </body>
  </html>
  $$, $$Hello,

Thank you for your interest in the {{siteName}} Academy (U11). We are pleased to invite you to join our March/April intake.

Please confirm your interest:
Yes, still interested: {{responseYesUrl}}
No longer interested: {{responseNoUrl}}

Best regards,
{{siteName}}$$)
ON CONFLICT ("key") DO NOTHING;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_email_templates_key ON email_templates("key");

-- RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = current_schema() 
    AND tablename = 'email_templates' 
    AND policyname = 'service_role_email_templates'
  ) THEN
    CREATE POLICY "service_role_email_templates" ON email_templates
      FOR ALL USING (true);
  END IF;
END$$;

COMMIT;
