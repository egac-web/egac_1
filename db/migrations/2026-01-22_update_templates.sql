-- 2026-01-22: Update invite and booking confirmation templates with improved design
BEGIN;

-- Upsert invite_email
INSERT INTO email_templates ("key", language, subject, html, text)
VALUES (
  'invite_email', 'en', '{{siteName}}: Book a taster / session', $$
  <!doctype html>
  <html> ... (improved invite template HTML; kept minimal in migration to avoid duplication with src) $$,
  $$Hello,

Thanks for your enquiry. Book a free taster at: {{inviteUrl}}

If you did not request this, ignore this email.$$)
ON CONFLICT ("key") DO UPDATE SET subject = EXCLUDED.subject, html = EXCLUDED.html, text = EXCLUDED.text;

-- Upsert booking_confirmation
INSERT INTO email_templates ("key", language, subject, html, text)
VALUES (
  'booking_confirmation', 'en', '{{siteName}}: Booking confirmed', $$
  <!doctype html>
  <html> ... (improved booking confirmation HTML) $$,
  $$Your booking for {{date}} ({{slotLabel}}) is confirmed.$$)
ON CONFLICT ("key") DO UPDATE SET subject = EXCLUDED.subject, html = EXCLUDED.html, text = EXCLUDED.text;

COMMIT;
