# Test Site Deployment Guide

## Overview
This guide covers deploying the EGAC website to a test environment before production launch.

## Test Environment Setup

### 1. Cloudflare Pages - Test Environment

#### Create Test Project
1. Go to Cloudflare Dashboard → Pages
2. Create new project: `egac-test` (or `egac-staging`)
3. Connect to GitHub repo: `egac-web/egac_1`
4. Set branch: `main` (or create a `staging` branch)

#### Build Settings
- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`
- **Node version**: 20

### 2. Environment Variables (Test)

Configure these in Cloudflare Pages → Settings → Environment variables:

#### Required Variables
```bash
# Directus CMS
DIRECTUS_URL=https://egac-admin.themainhost.co.uk
DIRECTUS_TOKEN=<test-token-from-directus>

# Supabase Database
SUPABASE_URL=https://kfxuosuyhgankyjvldlc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<get-from-supabase-dashboard>
SUPABASE_ANON_KEY=<get-from-supabase-dashboard>

# Email Service (Resend)
RESEND_API_KEY=<test-api-key>
RESEND_FROM="EGAC Test <noreply@test.eastgrinsteadac.co.uk>"

# Admin Portal Access
ADMIN_TOKEN=<generate-new-secure-token-for-test>

# Email Recipients
MEMBERSHIP_SECRETARY_EMAIL=test-membership@eastgrinsteadac.co.uk

# Site Configuration
SITE_BASE_URL=https://egac-test.pages.dev
```

### 3. Test Domain Setup

#### Option A: Cloudflare Pages Domain
- Automatically provided: `https://egac-test.pages.dev`
- Use for initial testing

#### Option B: Custom Test Subdomain (Recommended)
1. Add DNS record in Cloudflare:
   - Type: CNAME
   - Name: `test` (or `staging`)
   - Target: `egac-test.pages.dev`
2. Configure custom domain in Pages settings
3. Access at: `https://test.eastgrinsteadac.co.uk`

### 4. Database Setup - Test Environment

#### Option A: Separate Test Database (Recommended)
1. Create new Supabase project: `egac-test`
2. Run all migrations from `db/migrations/`
3. Seed test data
4. Update environment variables with test DB credentials

#### Option B: Shared Database with Namespace
- Use same database but prefix all test bookings/enquiries
- Add `test_mode` column or use different age groups
- **Risk**: Test data mixed with production data

### 5. Migration Checklist

Before deploying, ensure all database migrations are applied:

```bash
# Check migration status
npm run check:migrations

# Run migrations
psql $SUPABASE_URL -f db/migrations/2026-01-08_add_last_send_error.sql
psql $SUPABASE_URL -f db/migrations/2026-01-10_academy_invitations.sql
psql $SUPABASE_URL -f db/migrations/2026-01-10_configurable_age_groups.sql
psql $SUPABASE_URL -f db/migrations/2026-01-10_email_templates.sql
psql $SUPABASE_URL -f db/migrations/2026-01-11_add_enquiry_status.sql
psql $SUPABASE_URL -f scripts/migrations/20260102_add_booking_fields.sql
psql $SUPABASE_URL -f scripts/migrations/20260102_add_booking_reminder.sql
```

## Deployment Process

### Manual Deployment
1. **Push to main branch**:
   ```bash
   git push origin main
   ```
2. Cloudflare Pages will automatically deploy
3. Monitor deployment in Cloudflare Dashboard

### Deployment via CI/CD
Create `.github/workflows/deploy-test.yml`:
```yaml
name: Deploy to Test

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          command: pages deploy dist --project-name=egac-test
```

## Testing Checklist

Once deployed to test, verify:

### 1. Public Pages
- [ ] Homepage loads correctly
- [ ] About page displays
- [ ] Contact/Enquiry form works
- [ ] Booking system functional
- [ ] All CSS/images load

### 2. Forms
- [ ] Enquiry form submission
- [ ] Email notifications sent
- [ ] Data saved to Supabase
- [ ] Booking creation works
- [ ] Booking cancellation works

### 3. Admin Portal
- [ ] Login with test token: `https://test-site.com/admin/members?token=<ADMIN_TOKEN>`
- [ ] View enquiries and bookings
- [ ] Mark attendance
- [ ] Send Academy invitations
- [ ] Edit email templates
- [ ] Configure age groups
- [ ] View reports

### 4. Email Flow
- [ ] Enquiry confirmation email
- [ ] Booking confirmation email
- [ ] Booking reminder email
- [ ] Academy invitation email
- [ ] Template preview works
- [ ] Test email send works

### 5. Academy Flow
- [ ] Enquiries appear in Academy tab (age ≤ 10)
- [ ] Send invitation button works
- [ ] Invitation email received
- [ ] Yes/No response links work
- [ ] Response recorded in database

### 6. Performance
- [ ] Page load times < 2s
- [ ] API responses < 500ms
- [ ] No console errors
- [ ] Mobile responsive

## Rollback Plan

If issues are found:

### Quick Rollback
1. Go to Cloudflare Pages → Deployments
2. Find last known good deployment
3. Click "Rollback to this deployment"

### Code Rollback
```bash
git revert <commit-hash>
git push origin main
```

## Production Deployment Prerequisites

Before deploying to production:

- [ ] All test checklist items pass
- [ ] Performance meets requirements
- [ ] Security audit complete
- [ ] Admin token rotated
- [ ] Email templates reviewed
- [ ] Age groups configured
- [ ] Booking slots configured
- [ ] Test data cleaned from database
- [ ] Production environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Monitoring alerts set up
- [ ] Backup strategy in place

## Next Steps

1. Deploy to test environment
2. Run full testing checklist
3. Fix any issues found
4. Get stakeholder approval
5. Deploy to production

## Support

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Supabase Dashboard**: https://app.supabase.io
- **GitHub Actions**: https://github.com/egac-web/egac_1/actions
