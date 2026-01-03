# Monitoring runbook — invite/retry monitoring

This runbook documents triage steps, quick checks, and remediation for invite/retry monitoring and reminders.

## Quick checklist
- Check monitor workflow runs: `gh run list --workflow=monitor-invite-stats.yml --limit 10`
- Inspect a failing run logs: `gh run view <run-id> --log`
- Check invite counts endpoint:
  - Generic: `curl "https://<your-site>/api/admin/invite-stats.json?secret=$CRON_SECRET"`
  - Example (egac-1): `curl -s "https://egac-1.pages.dev/api/admin/invite-stats.json?secret=$CRON_SECRET" | jq` ✅
- Manually trigger retry / reminders:
  - Retry invites: `curl -s "https://egac-1.pages.dev/api/admin/retry-invites.json?secret=$CRON_SECRET" | jq`
  - Send reminders: `curl -s "https://egac-1.pages.dev/api/admin/send-reminders.json?secret=$CRON_SECRET" | jq`
- If `.counts.failed > 0`, the workflow will open or append to a monitoring issue (label: `monitoring`).

### Verify Cloudflare deployment & cron triggers
- If you deploy via GitHub → Cloudflare integration, verify the scheduled worker/function in the Cloudflare dashboard:
  - Cloudflare dashboard → **Workers** → **Cron Triggers** to see scheduled triggers, OR
  - Cloudflare dashboard → **Pages** → select your project → **Functions / Triggers** (depending on Pages config) to find scheduled triggers.
  - Look for the `egac-retry-trigger` worker (or your configured name) and confirm the cron expression (e.g., `*/15 * * * *`) and that the trigger is **enabled**.
- Check environment variables used by the scheduled worker:
  - Pages project → **Settings** → **Environment variables** (production/staging). Confirm `CRON_SECRET`, `SITE_BASE_URL`, `RESEND_API_KEY`, `RESEND_FROM` are set.
- Check invocation logs:
  - Cloudflare → Workers / Pages → Logs/Functions → filter by worker name or recent invocations. Look for log lines `Retry job status` and `Reminders job status` from `retry-trigger.js`.

## Inspect recent sends (DB + Resend)
- Run the helper script to list recent invites and enquiry events (requires `SUPABASE_*` and `RESEND_API_KEY` in env or `.env`):
  - `INSPECT_LIMIT=10 node scripts/inspect_recent_sends.mjs`
- The script prints invite rows, enquiry email, invite-related `events` and tries to fetch Resend message info.

## Verify Resend
- Use the Resend dashboard to inspect message ids recorded in `enquiry.events` (`invite_sent` events hold `resend_id`).
- Bounces will be visible in Resend logs (or returned by their API) — these confirm Resend processed the send. Note: bounces are expected while the sending domain is not yet verified; this is normal during setup and is visible in Resend bounce logs (no further action required other than fixing DNS when ready).

## Safe retry procedure (staging)
1. Run dry-run to append `invite_send_dry_run` events without real sends:
   - `RESEND_DRY_RUN=1 node scripts/retry_failed_invites_dryrun.mjs`
2. If dry-run output is good, run a small real batch (limit):
   - `LIMIT_INVITES=1 node scripts/retry_failed_invites.mjs`
   - Check Resend dashboard and `INSPECT` script output
   - Increase limit to 5 or 10 if confident: `LIMIT_INVITES=5 node scripts/retry_failed_invites.mjs`

## Remediation steps
- If invites are failing due to Resend errors, check `enquiries.events` and `invites.last_send_error` for details.
- Rotate `RESEND_API_KEY` if compromised and update Pages/Workers and repo secrets.
- If CRON_SECRET is missing/rotated, update repo secret `CRON_SECRET` and Pages environment variable.

## Useful commands
- Re-run monitor workflow: `gh workflow run monitor-invite-stats.yml --ref main`
- Create a monitoring issue manually: `gh issue create --title "Manual: Invite retry failures" --label monitoring --body "..."`
- Query DB directly (psql or Supabase SQL editor):
  - `SELECT * FROM invites ORDER BY created_at DESC LIMIT 20;`
  - `SELECT events FROM enquiries WHERE id = '<enquiry-id>'`;

## Notes
- Always run dry-run first when testing sending behavior.
- Use `LIMIT_INVITES` safety limit when running real sends in staging.
- Document any follow-ups in the monitoring issue and update this runbook if you discover new steps.
