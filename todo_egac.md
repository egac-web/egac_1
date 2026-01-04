# EGAC — Actionable TODOs ✅

This file lists prioritized, actionable tasks to get `egac_1` ready for reliable production deployment.

---

## Priority: P0 (Urgent)

1. **Remove secrets from source & rotate keys** 🔐 — (Est: 1–2h)
   - Remove `.env` from the repo history (e.g., `git rm --cached .env`, consider `git filter-repo` or BFG for historical leaks).
   - Add `.env` to `.gitignore` and create `.env.example` with placeholders.
   - Rotate keys that were present in the committed `.env` (Supabase service role key, Directus token, Resend API key, Cloudflare token, etc.).
   - Acceptance: No secrets in repo, new secrets stored in repo/organization secrets or vault and verified in CI.

2. **Set repository/Cloudflare secrets** — (Est: 15–30m)
   - Ensure `CF_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CRON_SECRET`, `PAGES_SITE_URL`, and `MONITORING_MENTION` are present in repository secrets.
   - Acceptance: `monitor-invite-stats.yml` and `deploy-worker.yml` run without complaining about missing secrets.

---

## Priority: P1 (High)

3. **Add PR CI checks (build & smoke tests)** — (Est: 2–4h)
   - Add a workflow to run `npm ci` and `npm run build` on pull requests and fail on build errors.
   - Add a smoke test step using `scripts/smoke-test-supabase.js` with a dry-run or using a staging supabase project.
   - Acceptance: PRs show build pass/fail and smoke test results.

4. **Dependency audit & auto-updates** — (Est: 2–4h)
   - Run `npm audit` and resolve vulnerabilities.
   - Enable Dependabot or GitHub auto-dependency updates for regular checks.

5. **DB migrations & staging deployment** — (Est: 3–6h)
   - Verify migrations are applied in staging and production; add migration-run CI job if needed.
   - Acceptance: Migrations applied consistently; test DB in staging reflects latest schema.

---

## Priority: P2 (Medium)

6. **Add tests & coverage baseline** — (Est: 4–8h)
   - Add unit tests for core API endpoints and simple integration/E2E for booking/enquiry flows using existing scripts.
   - Acceptance: Basic tests run in CI and coverage metric meets a reasonable baseline.

7. **Operational docs & runbooks** — (Est: 2–4h)
   - Add a short incident runbook for failed invite retries and monitoring alerts; add backup/restore doc for Supabase.
   - Acceptance: Runbook added and referenced in `README.md`.

---

## Priority: P3 (Low)

8. **Hardening & monitoring enhancements** — (Est: ongoing)
   - Add more metrics/alerts, centralised logging, and retention policy for logs.
   - Introduce periodic dependency scanning and test coverage gating.

9. **Misc tasks**
   - Update README to document secrets workflow and required environment variables.
   - Consider a staging environment with separate secrets for testing.

---

If you want, I can pick one of the P0 tasks and implement it now (remove `.env` from repo, add `.env.example`, update `.gitignore`, and open a PR). Which should I do next? 🔧