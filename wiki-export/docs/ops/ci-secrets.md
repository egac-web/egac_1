# CI & Monitoring Secrets (quick reference)

This document explains where to add the repository secrets used by CI and monitoring workflows and how to verify they work.

## Required repository secrets
- `PAGES_SITE_URL` — URL for your deployed site (e.g., `https://egac-1.pages.dev`).
- `CRON_SECRET` — secret used to protect cron/admin endpoints such as `/api/admin/invite-stats.json`.

Optional:
- `MONITORING_MENTION` — a mention string (e.g., `@your-org/your-team` or `@username`) that will be included when a monitoring issue is created.

## Where to add them (Repository-level)
1. Go to your repository on GitHub.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. Enter **Name** and **Value** and click **Add secret**.

Quick link (replace `<owner>/<repo>`):

`https://github.com/<owner>/<repo>/settings/secrets/actions`

## Environment-scoped secrets
If you want stricter controls (approvals or limited access), add secrets under **Settings → Environments → <env> → Secrets**. The workflow must declare `environment: <env>` to access those secrets.

## Verifying the secrets in CI
1. Trigger the `Monitor invite stats` workflow or run it manually from the Actions tab.
2. In the workflow logs verify the step `Check invite stats (node)` prints:
   - `Invite counts: { ... }` (the script logs invite counts)
3. Confirm the `Open GitHub issue if failures detected` step runs (only if `.counts.failed > 0`).

If the Node step fails early, the script `scripts/check_invite_stats.mjs` emits clear errors and exit codes. See the script for more detail.

## Troubleshooting
- If the step prints `ERROR: CRON_SECRET not set in repository secrets` — you added the secret at the wrong scope or it was misnamed.
- If `Calling invite-stats on ` shows an empty URL, ensure `PAGES_SITE_URL` is set and correctly named in the repository secrets.
- `MONITORING_MENTION` must be a valid GitHub mention string; otherwise the workflow simply won’t mention anyone.

## Security notes
- Never check secrets into source control or share them publicly.
- Rotate secrets periodically and update your repository secrets accordingly.
- If a secret is exposed, revoke/rotate it immediately and update configurations that depend on it.

---

If you want, I can add a short GitHub Actions protection note showing how to require approvals for environments or restrict who can create environment secrets.