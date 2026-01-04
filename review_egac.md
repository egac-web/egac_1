# EGAC (egac_1) — Project Review ✅

**Short summary:** This is an Astro site hosted on Cloudflare Pages/Workers that integrates with Directus and Supabase and uses Resend for email sending. DB migrations and scheduled worker scripts exist. The repo contains CI workflows for worker deployment and scheduled monitoring, but there are important operational/security gaps to fix before declaring this production-ready.

---

## Quick facts 🔍

- Framework: **Astro** (v5) with **React** components
- Hosting: **Cloudflare Pages** + **Cloudflare Workers** (wrangler) for scheduled jobs
- Data: **Supabase** (Postgres + RLS policies present in migrations) and **Directus** for CMS
- Email: **Resend API** used for outgoing emails
- Migrations: Present under `db/migrations` and several `scripts/migrations/*.sql`
- CI: Two workflows exist (`.github/workflows/deploy-worker.yml` and `monitor-invite-stats.yml`)

---

## Positives ✅

- Project structure is clear with migrations and scripts for many operational tasks (invite retries, smoke tests).
- Scheduled monitoring workflow exists to auto-open an issue when invite retries fail.
- There are smoke-test scripts and migration SQL files—good sign that ops were considered.

---

## Key findings / issues ⚠️

- **Secrets leaked in repo:** A `.env` file is present and contains several sensitive keys (Supabase service role key, Directus token, Resend key, Cloudflare API token, etc.). `.gitignore` currently does **not** include `.env`.
- **No test script / CI build step:** `package.json` contains only `dev`, `build`, `preview` scripts; there is no `test` script or PR build check currently enforced for the site build.
- **wrangler.toml placeholders:** `account_id` is set to `<YOUR_CF_ACCOUNT_ID>` and `route` is empty — CI workflow patches the account id from secrets but the configuration still relies on repo secret setup.
- **Service role key handling:** There are many scripts that require `SUPABASE_SERVICE_ROLE_KEY`. Ensure it is only used server-side and not exposed to the browser.
- **No explicit backup/playbook doc:** While there is monitoring, there's no clear runbook for incidents or backup/restore documentation for the DB.

---

## Recommended immediate next step (highest priority) 🔥

1. **Remove `.env` from the repository, add it to `.gitignore` and add a `.env.example` with placeholders.** Rotate any keys that have already been checked in. Verify repository secrets are present in GitHub Actions / Cloudflare Pages / Secrets manager.

---

## Other next steps (short list) ✨

- Add a CI step to run `npm run build` on PRs and consider a smoke test step (use existing `scripts/smoke-test-supabase.js` with a dry run).
- Add basic automated tests (unit + integration) for API endpoints and critical scripts.
- Run `npm audit`/dependency scanning and add Dependabot or GitHub security scanning.
- Enforce RLS and verify migrations are applied in staging and production; add migration-run step to CI.
- Create an incident runbook for invite failure alerts and a backup schedule for the database.

---

If you want, I can now: (choose one)
- Create a prioritized `todo_egac.md` with tasks and rough estimates (recommended),
- Create a `security_egac.md` with concrete remediation steps (recommended),
- Or implement a small fix (add `.env` to `.gitignore` and add `.env.example`) and open a PR.

Tell me which you want me to do next and I will proceed. 🔧