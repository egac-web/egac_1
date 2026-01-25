# Invite retry operational notes (cron/monitoring/migration)

This document collects the steps to operate the retry job that sends invites and how to monitor and migrate safely.

## 1) Set RESEND environment for production (RESEND_API_KEY, RESEND_FROM)

- In the Cloudflare Pages project (or Worker) set the following environment variables:
  - `RESEND_API_KEY` (your Resend API key — server-side only)
  - `RESEND_FROM` (e.g. `EGAC <noreply@eastgrinsteadac.co.uk>`)
  - Optional: `RESEND_DRY_RUN=1` in staging to prevent real sends

- Test before going live:
  - Keep `RESEND_DRY_RUN=1` while verifying behavior.
  - When ready, unset `RESEND_DRY_RUN` to allow live sends.
  - Use `scripts/send_invite_really.mjs --yes --inviteId=<id>` for a one-off controlled send (requires env set). 

## 2) Monitoring (invite-stats)

- A small script is provided to check `invite-stats` and fail if there are failed invites:
  - `scripts/check_invite_stats.mjs`
  - Example usage:
    - `CRON_SECRET=<secret> PAGES_SITE_URL=https://egac-1.pages.dev node scripts/check_invite_stats.mjs`

- A GitHub Actions workflow is included at `.github/workflows/monitor-invite-stats.yml` that runs every 15 minutes and fails when `.counts.failed > 0`.
  - **Required repository secrets** (Repository → Settings → **Secrets and variables → Actions**):
    - `PAGES_SITE_URL` (e.g. `https://egac-1.pages.dev`)
    - `CRON_SECRET` (the secret set in Pages/Worker)
  - **Optional**: `MONITORING_MENTION` (for example `@your-org/your-team` or `@your-github-username`) — if set the workflow will mention this when creating a new monitoring issue.

  - Quick link (replace `<owner>/<repo>`): `https://github.com/<owner>/<repo>/settings/secrets/actions`

  - Note: The workflow now uses the project's Node check script `scripts/check_invite_stats.mjs` which validates `CRON_SECRET`, prints invite counts, and the workflow will open or append to a monitoring issue when `failed > 0`.

- The workflow now automatically opens a GitHub issue (label: `monitoring`) when failed invites are detected. If an open monitoring issue already exists the workflow will append a comment instead of creating duplicates. The workflow uses the built-in `GITHUB_TOKEN` with `issues: write` permission to create/update issues.

- Optional: set a repository secret `MONITORING_MENTION` (for example `@your-org/your-team` or `@your-github-username`) so the workflow will mention the team or user when creating a new issue or appending a comment.

- An issue template is available at `.github/ISSUE_TEMPLATE/monitoring_alert.md` to help standardise triage actions for these automated alerts.

- When the job fails, integrate an action (Slack, email, Opsgenie, etc.) or rely on your monitoring stack to notify on failed runs.

## 3) DB migrations

- A safe SQL migration for `send_attempts` is included at `scripts/migrations/20260102_add_send_attempts.sql`.
- A migration to add booking reminder support is included at `scripts/migrations/20260102_add_booking_reminder.sql`.

Run them once against your production DB (Supabase SQL editor or psql). **Important:** for the booking migration, check for duplicate `invite_id` values before applying; the migration adds a UNIQUE index on `invite_id` and will fail if duplicates exist.

Short example with `psql` (replace placeholders):

```sh
psql '<YOUR_SUPABASE_DB_CONNECTION>' -f scripts/migrations/20260102_add_send_attempts.sql
psql '<YOUR_SUPABASE_DB_CONNECTION>' -f scripts/migrations/20260102_add_booking_reminder.sql
```

- After the booking migration, the system will be able to track `reminder_sent` on bookings and efficiently query bookings by `session_date` when sending reminders.

## 4) Testing / Dry-run

- Use `RESEND_DRY_RUN=1` in Pages/Worker for staging.
- Manually trigger the retry endpoint to test behavior:
  - `curl "https://<YOUR_SITE>/api/admin/retry-invites.json?secret=$CRON_SECRET"`

### Troubleshooting endpoints
- If you see `401 Unauthorized`:
  - The `secret` query parameter does not match the deployed `CRON_SECRET`. Avoid `source .env` (it can fail if values contain backticks). Extract safely:
    - `CRON_SECRET=$(grep '^CRON_SECRET=' .env | sed -E 's/^CRON_SECRET=("?)(.*)\\1$/\\2/')`
  - Use the test helper: `./scripts/test_endpoints.sh` (ensure it is executable with `chmod +x scripts/test_endpoints.sh`).

- If you see `404 Not Found` for `send-reminders`:
  - Confirm `src/pages/api/admin/send-reminders.json.js` exists in the repo and was included in the deployed build.
  - Verify Cloudflare Pages/Functions includes the endpoint or that the Worker deployment exposes the route.
  - Check Cloudflare Pages build logs and Worker invocation logs for evidence that the scheduled worker attempted to call the reminders endpoint and received 404.
  - Manually call the endpoint and inspect logs: `curl -v "https://egac-1.pages.dev/api/admin/send-reminders.json?secret=$CRON_SECRET"` to see headers and response details.

- Use `scripts/inspect_recent_sends.mjs` to inspect recent invite events and Resend message ids.

## Notes & rollback

- The migration is idempotent (uses `IF NOT EXISTS`) and safe to rerun. The rollback is simply `ALTER TABLE invites DROP COLUMN IF EXISTS send_attempts;`.
- Make sure to keep your `CRON_SECRET` secure and rotate periodically.

