# East Grinstead Athletics Club Website

Modern athletics club website with comprehensive admin portal, built with Astro and deployed on Cloudflare Pages.

## 🚀 Project Status

**Current Phase**: Ready for Test Deployment ✅

- ✅ All feature branches consolidated into main
- ✅ 50 automated tests passing  
- ✅ Admin portal complete with full CRUD functionality
- ✅ Email template management system
- ✅ Academy invitation workflow
- ✅ Booking system with attendance tracking
- ✅ Code quality tools (ESLint, Prettier, CI)

**Next Steps**: See [docs/NEXT_STEPS.md](./docs/NEXT_STEPS.md)

---

## 📋 Features

### Public Site
- Minimal, clean design inspired by modality-ppg
- Dynamic records system powered by Directus
- Contact/enquiry form with email notifications
- Training booking system with age group filtering
- Responsive design for all devices

### Admin Portal
- 🔐 Secure authentication with token-based access
- 📧 Email template management (preview, edit, test send)
- 👥 Enquiry & booking management
- ✅ Attendance tracking
- 🎓 Academy invitation system (U11)
- 📊 Reports dashboard with key metrics
- ⚙️ Configuration management (age groups, booking settings)

### Technical
- Built with Astro (SSR mode)
- Deployed to Cloudflare Pages
- Supabase database backend
- Resend for email delivery
- Directus CMS for content
- Comprehensive test suite (50+ tests)
- CI/CD with GitHub Actions

---

## 🏃 Quick Start

### Development

1. **Install dependencies**:
   ```sh
   npm install
   ```

2. **Configure environment** (copy `.env.example` to `.env`):
   ```sh
   cp .env.example .env
   ```
   Update with your credentials (see [Deployment Guide](./docs/deployment/test-site-setup.md))

3. **Start development server**:
   ```sh
   npm run dev
   ```

4. **Access the site**:
   - Public site: http://localhost:3000
   - Admin portal: http://localhost:3000/admin/members?token=dev

### Testing

```sh
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Format code
npm run format
```

---

## 📚 Documentation

### Core Documentation
- **[Next Steps](./docs/NEXT_STEPS.md)** - Immediate actions for test deployment
- **[Master Index](./master.md)** - Full index of all project documentation
- **[Project Structure](./project-structure.md)** - Codebase organization

### Deployment
- **[Test Site Setup](./docs/deployment/test-site-setup.md)** - Complete guide for test environment
- **[Pre-Production Checklist](./docs/deployment/pre-production-checklist.md)** - Launch readiness

### Development

### Development
- **[Directus Integration](./directus-integration.md)** - CMS setup and usage
- **[Enquiry Form](./enquiry_form.md)** - Form fields and handling
- **[Bookings](./docs/bookings.md)** - Booking system documentation
- **[TEST_SUMMARY.md](./TEST_SUMMARY.md)** - Test coverage details

### Reference
- **[Colors & Background](./colors-and-background.md)** - Design system
- **[Variables](./variables.md)** - Site-wide configuration
- **[Social Media](./social-media.md)** - Social integration
- **[Dummy Data](./dummy-records.md)** - Sample records for testing
- **[Policies](./src/pages/policies.astro)** - Club policies

---

## 🔧 Maintenance
- Update [change.md](./change.md) with all project changes
- Log issues and fixes in [issues-log.md](./issues-log.md)
- Review documentation regularly as outlined in [site-docs.md](./site-docs.md)
- Keep [CHANGELOG.md](./CHANGELOG.md) updated with releases

## 🔐 Secrets for CI & Monitoring

**Repository secrets** (Repository → Settings → Secrets and variables → Actions):
- `PAGES_SITE_URL` — URL for the deployed site (e.g., `https://egac-1.pages.dev`)
- `CRON_SECRET` — Secret used to protect cron and admin endpoints
- `CF_ACCOUNT_ID` — Cloudflare account ID
- `CLOUDFLARE_API_TOKEN` — Cloudflare API token for deployments
- **Optional:** `MONITORING_MENTION` — Team or user to mention in alert issues (e.g., `@org/team`)

For more detail and troubleshooting see:
- [docs/ops/invite-retry.md](./docs/ops/invite-retry.md)
- [docs/ops/ci-secrets.md](./docs/ops/ci-secrets.md)

> ⚠️ **Security**: Keep secrets out of source control and rotate them periodically.

---

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Commit with descriptive message
7. Create pull request to `main`

See branch retention policy in [docs/ops/branch-retention.md](./docs/ops/branch-retention.md)

---

**Last Updated**: January 15, 2026  
**License**: See LICENSE file  
**Support**: Contact EGAC membership team

