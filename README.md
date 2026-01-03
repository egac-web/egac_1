# East Grinstead Athletics Club Website

This site is built with Astro, hosted on Cloudflare Pages, and uses Directus for dynamic content management.

## Documentation
See [master.md](./master.md) for a full index of all project documentation files and requirements. All contributors should reference this file to ensure documentation is complete and up to date.

## Features
- Minimal, clean design inspired by modality-ppg
- Dynamic records system powered by Directus
- Chart/analytics component for records
- Contact/enquiry form
- Social media placeholders
- Cloudflare hosting

## Getting Started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Open [http://localhost:4321](http://localhost:4321) in your browser.

## Project Structure
See [project-structure.md](./project-structure.md) for details.

## Directus Integration
See [directus-integration.md](./directus-integration.md) for setup and usage.

## Dummy Data
See [dummy-records.md](./dummy-records.md) for sample records to use during development and testing.

## Colors and Background
See [colors-and-background.md](./colors-and-background.md) for design details.

## Enquiry Form
See [enquiry_form.md](./enquiry_form.md) for form fields and handling.

## Social Media
See [social-media.md](./social-media.md) for placeholders and future updates.

## Variables & Placeholders
See [variables.md](./variables.md) for all site-wide configuration values and placeholders. Update this file as needed and propagate changes to relevant pages/components.

## Policies
See [policies.astro](./src/pages/policies.astro) for club policies.

## Maintenance
- Update [change.md](./change.md) with all project changes.
- Log issues and fixes in [issues-log.md](./issues-log.md).
- Review documentation regularly as outlined in [site-docs.md](./site-docs.md).

## Secrets for CI & monitoring 🔐
- **Repository secrets** (Repository → Settings → **Secrets and variables → Actions**):
  - `PAGES_SITE_URL` — URL for the deployed site (e.g., `https://egac-1.pages.dev`)
  - `CRON_SECRET` — secret used to protect cron and admin endpoints
  - **Optional:** `MONITORING_MENTION` — team or user to mention in alert issues (e.g., `@org/team`)
- Quick link (replace `<owner>/<repo>`): `https://github.com/<owner>/<repo>/settings/secrets/actions`
- For more detail and troubleshooting see `docs/ops/invite-retry.md` and `docs/ops/ci-secrets.md`.

> Note: Keep these secrets out of source control and rotate them periodically.
