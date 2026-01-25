# TESTLOG — Staging smoke tests

Project: East Grinstead AC — `egac_1`
Staging URL: https://staging.eastgrinsteadac.co.uk
Tester: GitHub Copilot
Date created: 2026-01-16

## Overview
This log records smoke tests run against the staging site to validate:
- TLS/site availability
- Cron/admin endpoint protection (`CRON_SECRET`)
- Email template send & staging interception
- DB environment tagging (`environment='staging'`)
- Worker/cron invocation behaviour

## Environment (observed / required)
- APP_ENV=staging (Pages)
- SITE_BASE_URL=https://staging.eastgrinsteadac.co.uk
- CRON_SECRET (set in Pages)
- ADMIN_TOKEN (rotate & set in Pages)
- RESEND_API_KEY, RESEND_FROM (set in Pages; keep RESEND_DRY_RUN=1 until domain verified)
- STAGING_ALLOWED_EMAILS / STAGING_REDIRECT_EMAILS (set in Pages)

---

## Tests planned
1. TLS & homepage load
2. Verify cron/admin endpoints are protected without `CRON_SECRET`
3. Call templates/send.json with `token=dev` and observe dry-run / interception
4. Trigger invite flow (if available) and confirm `environment='staging'` on created DB record
5. Inspect email interception: subject prefix or redirected recipient
6. Run repo test scripts that honor `RESEND_DRY_RUN`

---

## Test Results

> Note: See `TESTLOG_2026-01-16-E2E.md` for the attempted E2E dry-run details (runner lacked Supabase envs).

### 2026-01-16 10:00 UTC — Network checks
- Command: `curl -I https://staging.eastgrinsteadac.co.uk` and `curl -sS https://staging.eastgrinsteadac.co.uk | head -n 40`
- Result: **Failed to fetch from this environment.** The `curl` command was interrupted / hung (`^C` observed). No HTTP headers or page content were returned. This suggests network egress from this runner may be blocked or interactive cancellation occurred.
- Next step: Please run the same commands from your local machine or CI runner and paste the headers/response here.

### 2026-01-16 10:05 UTC — Admin endpoints (no secret)
- Commands:
  - `curl -sS https://staging.eastgrinsteadac.co.uk/api/admin/invite-stats.json`
  - `curl -sS https://staging.eastgrinsteadac.co.uk/api/admin/retry-invites.json`
  - `curl -sS https://staging.eastgrinsteadac.co.uk/api/admin/send-reminders.json`
- Results: All endpoints returned JSON `{"ok":false,"error":"Unauthorized"}` when called without a `secret` query param — **CRON_SECRET protection is in place and functioning**.
- Next step: Re-run with the actual `CRON_SECRET` from Pages to confirm successful responses and invite counts.

### 2026-01-16 10:10 UTC — Templates send (token=dev)
- Command: `POST /api/admin/templates/send.json?token=dev` with body `{ key, to, vars }` (used `invite_email` and `academy_invitation`).
- Result: Both attempts returned `{"ok":false,"error":"Server error"}` (500). No detailed Resend response captured in this environment.
- Analysis: The templates endpoint invokes the Resend API directly. A 500 here likely indicates the Resend API rejected the request (bad/absent API key or unverified domain) and the server surface returned a generic "Server error". Note: `sendInviteEmail` throws on non-200 responses from Resend.
- Next steps:
  - Verify `RESEND_API_KEY` and `RESEND_FROM` are set in Pages and that the sending domain is verified with Resend (SPF/DKIM). OR
  - As a safety measure, add `RESEND_DRY_RUN` / short-circuit to `templates/send` in staging so it returns a simulated success while verification is pending.

### 2026-01-16 10:20 UTC — Dry-run enquiry script
- Command: `RESEND_DRY_RUN=1 node scripts/test-enquiry-notify.mjs`
- Result: **Failed to run in this environment** — Node package `node-fetch` is not installed (`ERR_MODULE_NOT_FOUND`). The script couldn't execute here. Run it from a local dev machine with dependencies installed (or install `node-fetch` in this env) to exercise the enquiry notification flow on staging.
- Next step: Run the script locally with `RESEND_DRY_RUN=1` and confirm the staging endpoint returns a 200 and that no real emails were sent (or check `STAGING_REDIRECT_EMAILS` inbox).

### 2026-01-16 10:30 UTC — Submit enquiry (create invite)
- Command: `POST /api/enquiry.json` with enquiry payload to create an invite and trigger notification.
- Result: `{"ok":false,"error":"Server error"}` (500). The invite creation server path attempted to send a notification and surfaced a server error.
- Analysis: The server error blocks end-to-end invite flow (invite record may not be created or notification failed during send). Likely cause: Resend API rejecting send requests or server-side send helper not handling staging dry-run; check `RESEND_API_KEY`, `RESEND_FROM`, and whether sending domain is verified.
- Next step: Verify Pages env vars for Resend (or short-circuit sends in staging) and then re-attempt the enquiry POST. Also check server logs in Pages for the detailed stack trace.

### 2026-01-16 10:35 UTC — Email interception check
- Attempted to observe staging interception (subject prefix or `STAGING_REDIRECT_EMAILS`) by triggering template sends and enquiry submission, but all send attempts returned `Server error` and did not produce an email activity to inspect.
- Conclusion: Cannot verify interception until the send path is healthy. Recommend verifying `RESEND_API_KEY` and sender domain verification (SPF/DKIM) or enable a staging-safe short-circuit so sends are simulated and interception behavior can be observed.


---

## Actions / Notes
- Rotate secrets recovered from repo history and update Pages env variables.

### 2026-01-16 19:10 UTC — Form submission 500
- Event: Browser POST to `/api/enquiry.json` from the staging site returned **HTTP 500** on form submission.
- Observation: Supabase previously logged a `POST | 400` for inserts into `enquiries` (see earlier message). This indicates the server is inserting an `environment` column that the `enquiries` table did not have, causing a Bad Request which bubbles up as a 500 in the endpoint.
- Quick diagnostic commands (run from a secure machine with DB access / service role key):
  1. Check columns on `enquiries`:
     `psql "$SUPABASE_URL" -c "SELECT column_name FROM information_schema.columns WHERE table_name='enquiries' ORDER BY ordinal_position;"`
  2. If `environment` is missing — apply the migration:
     `psql "$SUPABASE_URL" -f db/migrations/2026-01-16_add_environment_columns.sql`
  3. Re-run the form POST and inspect Pages deployment logs (Pages → Project → Deployments → staging → Logs) for the detailed exception if 500 persists.
- Notes: Apply the migration only against **staging** DB in this step. If you'd like, I can prepare the exact psql commands for your environment or apply the migration for you if you provide a staging DB connection string (or run it in CI that has the service role key).

### 2026-01-16 19:20 UTC — Migration applied
- You: Applied `db/migrations/2026-01-16_add_environment_columns.sql` to the staging DB.
- Plan: Re-test the `/api/enquiry.json` endpoint now and verify `enquiries` rows include `environment='staging'` for new inserts. If the POST succeeds, we'll confirm invite creation and email dry-run behavior.

### 2026-01-16 19:22 UTC — Form submission (retest after migration)
- Action: POSTed a test enquiry (dry run email) using `contact_email=staging-enq+2@examples.invalid`.
- Result: **Success (HTTP 200)** — response: `{"ok":true,"enquiry_id":"a5098b8e-e195-4304-bf76-cf63a4a9ada0","invite_id":"70c6c2db-a2f7-45f2-ae5e-718760d0283b"}`.
- Analysis: The migration resolved the previous 400/500 error; the enquiry and invite records were created successfully.
- Next steps:
  1. Verify the inserted `enquiries` row has `environment = 'staging'` and the `invites` row also has `environment='staging'`.
  2. Check that `sendInviteNotification` ran and respected `RESEND_DRY_RUN=1` (no real emails should have been sent) — inspect the invite `send_attempts` or `invites.status` to confirm dry-run behavior.
  3. If all good, proceed to test templates sends and cron endpoints as previously planned.

### 2026-01-16 20:28 UTC — Create booking for invite `aff738db7da5167c568a3a7d`
- Action: POST `/api/booking.json` with `{ invite: "aff738db7da5167c568a3a7d", session_date: "2026-01-20" }`.
- Result: **Success (HTTP 200)** — booking created: `id=44a55589-048c-4dea-a96d-8632c44e37b7`, slot `u15plus`, `session_time=19:30:00`, `environment=staging`.
- Events recorded on the enquiry:
  - `booking_created` for booking id `44a55589-...` (session_date 2026-01-20).
  - `booking_confirm_email_dry_run` (confirmations respected `RESEND_DRY_RUN=1`).
  - `booking_notify_secretary_failed` — error from Resend: **`Invalid 'from' field`** (422) — indicates `RESEND_FROM` value is malformed or includes literal quotes.
- Analysis: End-to-end booking flow works in staging (invite acceptance, booking creation, event logging). Email sends are dry-run as expected — however, the notification to the membership secretary failed due to an invalid `from` address format.

### 2026-01-16 20:40 UTC — Re-send secretary notification (templates/send)
- Action: POST `/api/admin/templates/send.json?token=dev` with `key=booking_confirmation` and `to=staging-membership@eastgrinsteadac.co.uk`.
- Result: **Server error (500)** — generic error returned by the server while attempting to send via Resend.
- Analysis: The templates preview renders correctly, so the failure is at the Resend send step. Possible causes:
  - `RESEND_API_KEY` is missing/invalid, or
  - The sending domain (`updates.eastgrinsteadac.co.uk`) is not verified in Resend (common cause), or
  - `RESEND_FROM` still contains malformed characters (quotes) in Pages env.
- Next steps:
  1. Confirm `RESEND_FROM` in Pages (no surrounding quotes) and `RESEND_API_KEY` are set correctly.
  2. Verify the sending domain is verified in the Resend dashboard (SPF/DKIM). Any domain verification errors will cause 403/validation errors.
  3. After fixing, re-run the template send (I can re-run it for you and record results).





### 2026-01-16 10:50 UTC — Supabase 400 diagnosis & fix
- Finding: Supabase returned `POST | 400` when inserting to `enquiries`. Investigation shows the server is inserting an `environment` column (`environment='staging'`) but the `enquiries` table did not have an `environment` column, causing the Bad Request from Supabase.
- Action taken: Added migration `db/migrations/2026-01-16_add_environment_columns.sql` which:
  - Adds `environment text NOT NULL DEFAULT 'production'` to `enquiries`, `invites`, `bookings`, and `academy_invitations` (if present).
  - Adds indexes: `idx_*_environment` for each table.
- Next steps:
  1. Apply the migration to the staging database (psql or Supabase migrations). Example: `psql "$SUPABASE_URL" -f db/migrations/2026-01-16_add_environment_columns.sql` (run from a secure environment with the service role key). ⚠️ Ensure you run this against the staging DB only.
  2. Re-run `POST /api/enquiry.json` and `templates/send` tests to verify the 400/500 errors are resolved.
  3. If other 400s appear, check server logs in Pages to capture Supabase error details (they include error messages like "column "environment" does not exist" or type/JSON errors).


