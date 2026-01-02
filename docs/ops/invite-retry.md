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

- A GitHub Actions workflow is included at `.github/workflows/monitor-invite-stats.yml` that runs every 15 minutes and fails when `.counts.failed > 0` — you should add the following repository secrets:
  - `PAGES_SITE_URL` (e.g. `https://egac-1.pages.dev`)
  - `CRON_SECRET` (the secret set in Pages/Worker)

- When the job fails, integrate an action (Slack, email, Opsgenie, etc.) or rely on your monitoring stack to notify on failed runs.

## 3) DB migration (send_attempts column)

- A safe SQL migration is included at `scripts/migrations/20260102_add_send_attempts.sql`.
- Run it once against your production DB (Supabase SQL editor or psql).
- Short example with `psql` (replace placeholders):

```sh
psql '<YOUR_SUPABASE_DB_CONNECTION>' -f scripts/migrations/20260102_add_send_attempts.sql
```

- After this migration, the retry logic will filter using the `send_attempts` column instead of inferring its absence.

## 4) Testing / Dry-run

- Use `RESEND_DRY_RUN=1` in Pages/Worker for staging.
- Manually trigger the retry endpoint to test behavior:
  - `curl "https://<YOUR_SITE>/api/admin/retry-invites.json?secret=$CRON_SECRET"`

## Notes & rollback

- The migration is idempotent (uses `IF NOT EXISTS`) and safe to rerun. The rollback is simply `ALTER TABLE invites DROP COLUMN IF EXISTS send_attempts;`.
- Make sure to keep your `CRON_SECRET` secure and rotate periodically.

