# EGAC — Security Review & Recommendations 🔒

This document lists security-sensitive items discovered and recommended mitigations to reach a production-safe security posture.

---

## Immediate / Urgent actions (P0)

1. **Remove committed secrets & rotate keys**
   - The repo contains a `.env` file with sensitive values. **Do not rotate keys yet** (per request); instead, note the keys that must be rotated as part of the incident response plan.
   - Keys found in the committed `.env` (rotate these when ready):
     - `DIRECTUS_URL`
     - `DIRECTUS_TOKEN`
     - `AIRTABLE_API_KEY`
     - `AIRTABLE_BASE`
     - `AIRTABLE_TABLE`
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `SUPABASE_ANON_KEY`
     - `RESEND_API_KEY`
     - `RESEND_FROM`
     - `ADMIN_TOKEN`
     - `MEMBERSHIP_SECRETARY_EMAIL`
     - `SITE_BASE_URL`
     - `CRON_SECRET`
     - `CLOUDFLARE_API_TOKEN`
   - Action: Remove `.env` from the repo, add to `.gitignore`, create `.env.example` with placeholders and document rotation steps (do not rotate keys yet unless requested).
   - Action taken (so far): `.env.example` added and `.gitignore` updated to exclude `.env` and `.env.local`. **Note:** I could not remove `.env` from git history or commit the change here because this workspace does not appear to be a git repository in this environment.
   - Local next steps to run in your repo (suggested):
     ```sh
     git checkout -b fix/remove-committed-env
     git rm --cached .env
     git add .gitignore .env.example security_egac.md
     git commit -m "chore(security): remove committed .env, add .env.example"
     git push --set-upstream origin fix/remove-committed-env
     # Optionally open a PR or use BFG/git-filter-repo to purge secrets from history
     ```
   - Verification: `git log`/history no longer contains secrets (or use `git filter-repo`/BFG to purge history) and rotated keys are accepted by services when rotated.

2. **Move secrets into a secure secrets manager**
   - Use GitHub repository secrets / organization secrets or a dedicated secrets manager (HashiCorp Vault, AWS Secrets Manager, Cloudflare Pages environment variables) rather than a file in the repo.
   - Add a small doc explaining where secrets live and how to rotate them.

---

## Short-term (P1)

3. **Least privilege for tokens**
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is used only in server contexts (scripts, workers) and **never** injected into client bundles.
   - Limit Directus token scope or create a server-only admin token with least privilege.

4. **RLS & DB policies**
   - Confirm `db/migrations/2025-12-28_rls_and_policies.sql` is comprehensive and is applied in staging & production; add tests to verify RLS enforcement.

5. **Protect admin/cron endpoints**
   - Existing work uses a `CRON_SECRET` to protect scheduled endpoints—ensure this is a strong secret and validated server-side.

6. **Add secret-scanning & pre-commit checks**
   - Add a git pre-commit hook (`pre-commit`, `husky`) to scan for high-entropy strings and common secret patterns before commit.
   - Enable GitHub secret scanning and set up alerts for leaked keys.

---

## Medium-term (P2)

7. **Dependency & supply-chain**
   - Add dependency scanning (Dependabot, Snyk) and schedule periodic dependency updates and vulnerability reviews.

8. **CSP / CORS / Rate-limiting**
   - Ensure CSP/CORS headers are applied where needed and endpoints have sensible rate limits. Verify via CI smoke tests.

9. **Logging & Monitoring**
   - Enhance logging for worker failures and errors (structured logs) and connect to an alerting channel (e.g., Slack, Teams) through the monitoring workflow.

10. **Backups & DR**
   - Add a documented backup schedule for the database (and test restores periodically). Document RTO/RPO and recovery steps.

---

## Verification checklist

- [ ] Remove `.env` and purge secrets from history where necessary.
- [ ] Add `.env.example` and update README with secret management steps.
- [ ] Ensure repository secrets are set and validated in CI/workflows.
- [ ] Add pre-commit secret scanning and enable GitHub secret scanning.
- [ ] Add PR build & smoke tests; ensure these run successfully before merging.
- [ ] Verify RLS/policies are enforced and migrations applied in staging/production.

---

If you'd like, I can implement the urgent P0 items now (remove `.env` from repo, add `.env.example`, update `.gitignore`, and prepare a PR that documents the rotation steps). Which action should I take next? 🔐