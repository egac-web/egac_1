# Pre-Production Launch Checklist

## Security

### Authentication & Secrets
- [ ] Ensure Cloudflare Access is configured for production and rotate any Access-related secrets (do not rely on legacy ADMIN_TOKEN fallbacks)
- [ ] Generate new RESEND_API_KEY for production
- [ ] Review and secure all Supabase RLS policies
- [ ] Remove or disable `?token=dev` auto-login in production
- [ ] Ensure .env is not committed to git
- [ ] Verify all secrets are in Cloudflare environment variables only

### Access Control
- [ ] Review Supabase row-level security policies
- [ ] Test that non-admin users cannot access `/admin/*` endpoints
- [ ] Verify email templates cannot be modified by unauthorized users
- [ ] Check that booking cancellation requires valid token

### Code Security
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Review all API endpoints for injection vulnerabilities
- [ ] Ensure HTML sanitization is enabled for templates
- [ ] Test CSRF protection on forms

## Database

### Schema & Migrations
- [ ] All migrations applied to production database
- [ ] Verify indexes are created for performance
- [ ] Check foreign key constraints are in place
- [ ] Backup production database before launch

### Data Integrity
- [ ] Remove all test data from production database
- [ ] Seed initial email templates
- [ ] Configure production age groups
- [ ] Set system configuration (academy_max_age, weeks_ahead_booking)
- [ ] Verify no duplicate records exist

### Performance
- [ ] Add indexes on frequently queried columns
- [ ] Test query performance with realistic data volume
- [ ] Configure connection pooling if needed
- [ ] Set up database monitoring

## Email Configuration

### Templates
- [ ] Review all email template content
- [ ] Test variable substitution in all templates
- [ ] Verify email formatting (HTML + plain text)
- [ ] Check email subject lines
- [ ] Test template preview functionality

### Delivery
- [ ] Verify SPF/DKIM records for sending domain
- [ ] Test email deliverability to major providers (Gmail, Outlook)
- [ ] Set up Resend webhook for bounce/complaint handling
- [ ] Configure reply-to addresses
- [ ] Test email sending limits (Resend quotas)

### Content
- [ ] Enquiry confirmation email
- [ ] Booking confirmation email
- [ ] Booking reminder email (24-48h before)
- [ ] Academy invitation email
- [ ] Academy response confirmation

## Site Configuration

### Age Groups
- [ ] U11 (ages 8-10)
- [ ] U13 (ages 11-12)
- [ ] U15 (ages 13-14)
- [ ] U17 (ages 15-16)
- [ ] U20 (ages 17-19)
- [ ] Senior (ages 20+)
- [ ] Verify slot_code matches booking system
- [ ] Check session_day and session_time are correct

### System Settings
- [ ] Academy max age set to 10
- [ ] Weeks ahead booking set to 4 (or desired value)
- [ ] Verify settings persist correctly

### Booking Slots
- [ ] Create booking slots for next 4 weeks
- [ ] Test slot visibility and capacity
- [ ] Verify age group filtering works

## Testing

### Automated Tests
- [ ] All 50+ unit tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] Format check passes: `npm run format:check`
- [ ] No TypeScript annotations in JS: `npm run check:js-no-ts`
- [ ] CI workflow passes on main branch

### Manual Testing
- [ ] Public pages load correctly
- [ ] Enquiry form submission works end-to-end
- [ ] Booking creation works
- [ ] Booking cancellation works
- [ ] Email notifications are received
- [ ] Admin portal login works
- [ ] Admin can mark attendance
- [ ] Admin can send Academy invitations
- [ ] Admin can edit templates
- [ ] Admin can configure age groups
- [ ] Reports show correct data

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] API response times < 500ms
- [ ] No console errors in browser

## Deployment

### Environment Setup
- [ ] Production Cloudflare Pages project created
- [ ] Custom domain configured: `eastgrinsteadac.co.uk`
- [ ] SSL certificate active and valid
- [ ] All environment variables set in Cloudflare
- [ ] Build settings configured correctly

### DNS Configuration
- [ ] A/AAAA records point to Cloudflare Pages
- [ ] CNAME for www subdomain
- [ ] MX records for email (if applicable)
- [ ] TXT records for SPF/DKIM
- [ ] Verify DNS propagation

### CDN & Caching
- [ ] Cloudflare caching rules configured
- [ ] Static assets have long cache headers
- [ ] API endpoints have appropriate cache headers
- [ ] Purge cache after deployment

## Monitoring & Alerts

### Application Monitoring
- [ ] Set up error tracking (Sentry, Cloudflare Workers Analytics)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Enable Cloudflare Web Analytics

### Alerts
- [ ] Email delivery failures
- [ ] Database connection issues
- [ ] High error rates (>1% of requests)
- [ ] Slow API responses (>2s)
- [ ] Failed bookings
- [ ] Failed Academy invitations

### Logging
- [ ] Application logs to Cloudflare Workers Tail
- [ ] Database query logs enabled
- [ ] Email send logs tracked in Resend dashboard

## Documentation

### User Guides
- [ ] Admin portal user guide
- [ ] How to manage enquiries
- [ ] How to send Academy invitations
- [ ] How to edit email templates
- [ ] How to configure age groups

### Technical Documentation
- [ ] API endpoint documentation
- [ ] Database schema diagram
- [ ] Deployment runbook
- [ ] Rollback procedures
- [ ] Troubleshooting guide

### Handoff
- [ ] Admin credentials documented (securely)
- [ ] Emergency contact list
- [ ] Escalation procedures
- [ ] Support SLAs defined

## Content

### Site Content
- [ ] About page content reviewed
- [ ] Contact information verified
- [ ] Training times and locations correct
- [ ] Policies and codes of conduct up to date
- [ ] Records are current

### Legal & Compliance
- [ ] Privacy policy published
- [ ] Cookie policy (if using analytics)
- [ ] Terms of service
- [ ] GDPR compliance verified
- [ ] Data retention policy documented

## Backup & Recovery

### Backup Strategy
- [ ] Database backup schedule (daily)
- [ ] Test restore from backup
- [ ] Backup retention policy (30 days)
- [ ] Off-site backup storage

### Disaster Recovery
- [ ] Rollback procedure documented
- [ ] Recovery Time Objective (RTO) defined
- [ ] Recovery Point Objective (RPO) defined
- [ ] DR runbook tested

## Launch Plan

### Pre-Launch
- [ ] All checklist items completed
- [ ] Stakeholder sign-off obtained
- [ ] Launch date/time scheduled
- [ ] Communication plan ready
- [ ] Support team briefed

### Launch Day
- [ ] Deploy to production during low-traffic period
- [ ] Monitor error rates for 1 hour post-launch
- [ ] Test critical user flows
- [ ] Verify email delivery
- [ ] Check database connections

### Post-Launch
- [ ] Send launch announcement
- [ ] Monitor for 24 hours
- [ ] Review analytics and logs
- [ ] Address any issues promptly
- [ ] Collect user feedback

## Post-Launch Monitoring (First Week)

### Daily Checks
- [ ] Error rates
- [ ] Email delivery success rate
- [ ] Booking conversion rate
- [ ] Page load times
- [ ] Database performance

### Weekly Review
- [ ] User feedback summary
- [ ] Bug reports and resolutions
- [ ] Feature requests
- [ ] Performance trends
- [ ] Security incidents (if any)

## Success Metrics

Define and track:
- [ ] Enquiry form submission rate
- [ ] Booking completion rate
- [ ] Email delivery success rate
- [ ] Academy invitation response rate
- [ ] Admin portal usage
- [ ] Page views and engagement
- [ ] Error rate < 0.1%
- [ ] Uptime > 99.9%

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Technical Lead | | | |
| Product Owner | | | |
| Security Review | | | |
| Operations | | | |

---

**Notes:**
- This checklist should be completed before production launch
- Mark items as complete with date and initials
- Any items that cannot be completed should be documented with reason
- Critical items (security, database, testing) must be 100% complete before launch
