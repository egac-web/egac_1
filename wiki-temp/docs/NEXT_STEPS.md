# Next Steps - Test Site Launch

## ✅ Completed (January 15, 2026)

1. **Branch Consolidation**: Merged all feature branches into main
   - `feat/add-code-quality-tools` → main
   - `feat/admin-ui-polish` → main
   - Deleted merged local branches
   
2. **Testing**: All 50 tests passing ✅
   
3. **Documentation Created**:
   - [Test Deployment Guide](./deployment/test-site-setup.md)
   - [Pre-Production Checklist](./deployment/pre-production-checklist.md)
   - Updated CHANGELOG.md

4. **Code Quality**: 
   - ESLint configured and passing
   - Prettier configured
   - CI workflow active
   - Fixed jsdom warning

---

## 🚀 Ready for Test Deployment

### Immediate Next Step: Deploy to Test Environment

Follow the guide: [`docs/deployment/test-site-setup.md`](./deployment/test-site-setup.md)

### Quick Start:

1. **Create Cloudflare Pages Project**
   - Name: `egac-staging`
   - Connect to GitHub: `egac-web/egac_1`
   - **Branch**: `staging` (auto-deploys on push to staging)
   - Build command: `npm run build`
   - Output directory: `dist`

2. **Set Environment Variables** (in Cloudflare Pages)
   ```bash
   DIRECTUS_URL=https://egac-admin.themainhost.co.uk
   DIRECTUS_TOKEN=<get-from-directus>
   SUPABASE_URL=<staging-database-url>
   SUPABASE_SERVICE_ROLE_KEY=<get-from-supabase>
   SUPABASE_ANON_KEY=<get-from-supabase>
   RESEND_API_KEY=<your-resend-api-key>
   # NOTE: In Cloudflare Pages environment variables, do NOT include surrounding quotes. Use:
   #   RESEND_FROM=EGAC Staging <noreply@eastgrinsteadac.co.uk>
   RESEND_FROM=EGAC Staging <noreply@eastgrinsteadac.co.uk>
   # Configure Cloudflare Access or set `STAGING_ACCESS_JWT` for CI smoke tests. For local testing you may use `?token=dev` (test only).
   MEMBERSHIP_SECRETARY_EMAIL=staging-membership@eastgrinsteadac.co.uk
   SITE_BASE_URL=https://staging.eastgrinsteadac.co.uk
   ```

3. **Configure Custom Domain**
   - Add DNS CNAME: `staging` → `egac-staging.pages.dev`
   - In Pages settings, add custom domain: `staging.eastgrinsteadac.co.uk`
   - Wait for SSL certificate (1-2 minutes)

4. **Create Staging Database**
   - New Supabase project: `egac-staging`
   - Run migrations from `db/migrations/`
   - Update environment variables with staging DB URL

5. **Deploy & Test**
   - Push to `staging` branch (auto-deploys to staging.eastgrinsteadac.co.uk)
   - Visit: `https://staging.eastgrinsteadac.co.uk`
   - Run through testing checklist
   - After testing, merge `staging` → `main` for production

---

## 📋 Testing Checklist (Once Deployed)

### Critical Paths to Test

1. **Public Site**
   - [ ] Homepage loads
   - [ ] About page works
   - [ ] Enquiry form submission
   - [ ] Booking system functional

2. **Admin Portal** (Protected by Cloudflare Access; for local testing use `/admin/members?token=dev`) 
   - [ ] Login works
   - [ ] View enquiries
   - [ ] Mark attendance
   - [ ] Send Academy invitations
   - [ ] Edit email templates
   - [ ] Configure age groups
   - [ ] View reports

3. **Email Flow**
   - [ ] Enquiry confirmation received
   - [ ] Booking confirmation received
   - [ ] Academy invitation sent
   - [ ] Template preview works

4. **Database**
   - [ ] Enquiries saved correctly
   - [ ] Bookings created
   - [ ] Academy invitations tracked
   - [ ] Reports show accurate data

---

## 🔐 Security Notes

**Staging Environment Setup:**
- Generate a new `ADMIN_TOKEN` (different from local dev and production)
  ```bash
  openssl rand -hex 32
  ```
- Use same Resend API key as production (domain: `eastgrinsteadac.co.uk`)
- Create separate Supabase project for staging database
- Use staging-specific email addresses for notifications
- Store all secrets in Cloudflare Pages environment variables only

**Email Configuration:**
- Staging can send from `@eastgrinsteadac.co.uk` (same domain as production)
- Use different recipient addresses (e.g., `staging-membership@...`)
- Consider adding `[STAGING]` prefix to email subjects for clarity

**For production:**
- Rotate ALL tokens and API keys
- Use different `ADMIN_TOKEN` than staging
- Use production email recipient addresses
- Review security checklist in pre-production doc

---

## 📊 Current Status

- **Main Branch**: Up to date with all features ✅
- **Tests**: 50 passing ✅
- **Linting**: Passing ✅
- **Documentation**: Complete ✅
- **Ready to Deploy**: ✅

---

## 🎯 Timeline Suggestion

| Task | Duration | Owner |
|------|----------|-------|
| Deploy to test | 1 hour | Dev |
| Run database migrations | 30 mins | Dev |
| Full testing checklist | 2-3 hours | QA/Dev |
| Fix any issues found | 1-2 days | Dev |
| Stakeholder review | 2-3 days | Product |
| Complete pre-prod checklist | 2-3 days | Team |
| Production deployment | 1 hour | Dev |
| Post-launch monitoring | 1 week | Ops |

**Earliest Production Launch**: ~1 week from test deployment

---

## 📞 Need Help?

- **Cloudflare Setup**: See [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- **Supabase Migrations**: See [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- **Resend Email**: See [Resend Docs](https://resend.com/docs)

---

## 🚨 If Something Goes Wrong

### Rollback Procedure
1. Go to Cloudflare Pages → Deployments
2. Find last known good deployment
3. Click "Rollback to this deployment"

OR

```bash
git revert <commit-hash>
git push origin main
```

### Get Support
- Check error logs in Cloudflare Dashboard
- Review Supabase logs
- Check GitHub Actions for CI failures
- Review this documentation

---

**Last Updated**: January 15, 2026  
**Main Branch Commit**: 619cf67  
**Status**: ✅ Ready for Test Deployment
