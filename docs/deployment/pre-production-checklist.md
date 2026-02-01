# Pre-Production Launch Checklist (Taskable)

> How to use:
> - Edit this file directly and mark items with `- [x]` when completed.
> - For each completed item add an **Evidence** line with a link, PR number, or a short note, plus **Completed by** and **Date**.
> - Use `egac_1/scripts/checklist.sh` to list outstanding items and optionally mark them done from the command line.

---

## Security 🔐

### Authentication & Secrets
- [x] Ensure Cloudflare Access policy is configured for admin access; rotate any Access-related secrets or CI tokens as needed (no `ADMIN_TOKEN` fallback in production)
  - Evidence: Evidence: JWKS keys present: 95aa..., 8459... (curl + jq)
  - Completed by: Completed by: GitHub Copilot
  - Date: 2026-02-01
  - Evidence: 
  - Completed by: 
  - Date: 
- [ ] Generate new RESEND_API_KEY for production
  - Evidence: 
  - Completed by: 
  - Date: 
- [ ] Review and secure all Supabase RLS policies
  - Evidence: 
  - Completed by: 
  - Date: 
- [x] Remove or disable `?token=dev` auto-login in production
  - Evidence: Evidence: dev token accepted only in test env; commit 76c68d1 (removed ADMIN_TOKEN fallback)
  - Completed by: Completed by: GitHub Copilot
  - Date: 2026-02-01
  - Evidence: 
  - Completed by: 
  - Date: 
- [ ] Ensure `.env` or other secrets are not committed to git
  - Evidence: git history reviewed / PR #: 
  - Completed by: 
  - Date: 
- [x] Verify all secrets are stored in Cloudflare Pages environment variables (staging & prod)
  - Evidence: Evidence: no committed .env files (git ls-files returned none)
  - Completed by: Completed by: GitHub Copilot
  - Date: 2026-02-01
  - Evidence: Cloudflare UI screenshot / secret list: 
  - Completed by: 
  - Date: 

### Access Control
- [ ] Review Supabase row-level security policies
  - Evidence: 
  - Completed by: 
  - Date: 
- [ ] Test that non-admin users cannot access `/admin/*` endpoints (unauthenticated & unauthorized tests)
  - Evidence: curl responses / test logs: 
  - Completed by: 
  - Date: 
- [ ] Verify email templates cannot be modified by unauthorized users
  - Evidence: test result / PR #: 
  - Completed by: 
  - Date: 
- [ ] Verify booking cancellation requires valid auth claims
  - Evidence: test logs / postman collection: 
  - Completed by: 
  - Date: 

### Code Security
- [ ] Run `npm audit` and fix vulnerabilities (critical/major) before release
  - Evidence: `npm audit` report / PR #: 
  - Completed by: 
  - Date: 
- [ ] Review API endpoints for injection/XSS and ensure sanitization
  - Evidence: security review notes: 
  - Completed by: 
  - Date: 
- [ ] Test CSRF protection on forms (if applicable)
  - Evidence: test steps & results: 
  - Completed by: 
  - Date: 

---

## Database 🗄️

### Schema & Migrations
- [ ] Ensure migrations are applied to staging (and production prior to launch)
  - Evidence: migration status output / PR #: 
  - Completed by: 
  - Date: 
- [ ] Verify indexes and foreign key constraints for critical queries
  - Evidence: explain plans / screenshots: 
  - Completed by: 
  - Date: 
- [ ] Backup production DB before launch
  - Evidence: backup snapshot ID / location: 
  - Completed by: 
  - Date: 

### Data Integrity
- [ ] Remove test data from production
  - Evidence: cleanup script run / records count: 
  - Completed by: 
  - Date: 
- [ ] Seed initial email templates and config (age groups, system settings)
  - Evidence: seed log / PR #: 
  - Completed by: 
  - Date: 

### Performance & Monitoring
- [ ] Test queries with realistic data volume and add indexes as needed
  - Evidence: benchmark results / PR #: 
  - Completed by: 
  - Date: 
- [ ] Configure DB monitoring & alerts (connection errors, slow queries)
  - Evidence: monitoring config / alert screenshots: 
  - Completed by: 
  - Date: 

---

## Email Configuration ✉️

- [ ] Review and test all email templates (preview + send test)
  - Evidence: test emails delivered to test inboxes: 
  - Completed by: 
  - Date: 
- [ ] Verify SPF/DKIM & deliverability to Gmail/Outlook
  - Evidence: DNS records / deliverability report: 
  - Completed by: 
  - Date: 
- [ ] Configure Resend webhooks (bounces/complaints)
  - Evidence: webhook test / logs: 
  - Completed by: 
  - Date: 

---

## Site Configuration & Content 🧭

- [ ] Confirm age groups and booking slots for next 4 weeks are created
  - Evidence: admin UI screenshot / DB query: 
  - Completed by: 
  - Date: 
- [ ] Verify system settings (academy_max_age, weeks_ahead_booking)
  - Evidence: config GET / PR #: 
  - Completed by: 
  - Date: 
- [ ] Validate public content (about, contact, policies)
  - Evidence: content review notes: 
  - Completed by: 
  - Date: 

---

## Testing ✅

### Automated
- [ ] All unit/integration tests pass: `npm test`
  - Evidence: test run output / CI build #: 
  - Completed by: 
  - Date: 
- [ ] Lint & formatting checks pass (`npm run lint`, `npm run format:check`)
  - Evidence: CI logs: 
  - Completed by: 
  - Date: 
- [ ] Post-deploy smoke script runs successfully on staging (unauthenticated 401 + authenticated 200 with `STAGING_ACCESS_JWT`)
  - Evidence: GitHub Action run #: 
  - Completed by: 
  - Date: 

### Manual & E2E
- [ ] Manual smoke: public pages, forms and admin critical flows tested
  - Evidence: checklist results / screenshots: 
  - Completed by: 
  - Date: 
- [ ] E2E admin dry-run (`/api/admin/run-e2e.json`) tested with staging secrets
  - Evidence: run log / event appended: 
  - Completed by: 
  - Date: 

---

## Monitoring, Alerts & Observability 📈

- [ ] Error tracking configured (Sentry or equivalent)
  - Evidence: Sentry project & recent event tests: 
  - Completed by: 
  - Date: 
- [ ] Uptime and performance monitoring configured
  - Evidence: uptime monitor list / alerts: 
  - Completed by: 
  - Date: 
- [ ] Audit events for admin actions are present in logs
  - Evidence: sample audit log entry: 
  - Completed by: 
  - Date: 

---

## Deployment & Rollback 🚀

- [ ] Production Cloudflare Pages project and domain configured
  - Evidence: Pages project URL / domain screenshot: 
  - Completed by: 
  - Date: 
- [ ] Confirm rollback plan (Pages rollback + git revert steps)
  - Evidence: rollback doc link: 
  - Completed by: 
  - Date: 
- [ ] Ensure backups & RTO/RPO targets are documented and acceptable
  - Evidence: backup policy doc: 
  - Completed by: 
  - Date: 

---

## Launch Plan & Sign-Off ✅

- [ ] All checklist items complete or documented exceptions
  - Evidence: summary of outstanding items: 
  - Completed by: 
  - Date: 
- [ ] Stakeholder sign-off obtained (Technical Lead, Product Owner, Security, Ops)
  - Evidence: names / signatures / PR #: 
  - Completed by: 
  - Date: 
- [ ] Launch scheduled and support team briefed
  - Evidence: calendar invite / runbook link: 
  - Completed by: 
  - Date: 

---

### Quick commands & helpers
- Run unit tests: `cd egac_1 && npm test`
- Run the staging smoke script: `cd egac_1 && bash scripts/check_staging_access.sh`
- List outstanding checklist items: `cd egac_1 && bash scripts/checklist.sh list`
- Mark item N as done: `cd egac_1 && bash scripts/checklist.sh check N "Evidence: ..." "Completed by: name"`

---

**Notes:**
- Update this file as you complete items and include evidence and dates for auditability.
- Use PRs to record work and require reviews for checklist items that change code or infra.

