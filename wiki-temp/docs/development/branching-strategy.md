# Branching Strategy

## Overview

This project uses a **staging + main** branching strategy with feature branches for development.

```
┌─────────────────┐
│ Feature Branch  │
│ feat/xyz        │
└────────┬────────┘
         │ PR & merge
         ▼
┌─────────────────┐      ┌──────────────────────────┐
│ Staging Branch  │─────▶│ staging.eastgrinsteadac  │
│ staging         │      │ .co.uk                   │
└────────┬────────┘      └──────────────────────────┘
         │ PR & merge (after testing)
         ▼
┌─────────────────┐      ┌──────────────────────────┐
│ Main Branch     │─────▶│ eastgrinsteadac.co.uk    │
│ main            │      │ (PRODUCTION)             │
└─────────────────┘      └──────────────────────────┘
```

## Branches

### `main` - Production
- **Purpose**: Production-ready code only
- **Deploys to**: `eastgrinsteadac.co.uk` (Cloudflare Pages: `egac-production`)
- **Protection**: 
  - Requires pull request
  - Requires approval
  - Requires CI to pass
  - No direct commits
- **Updates**: Only merge from `staging` after thorough testing

### `staging` - Pre-Production Testing
- **Purpose**: Integration testing and QA
- **Deploys to**: `staging.eastgrinsteadac.co.uk` (Cloudflare Pages: `egac-staging`)
- **Protection**:
  - Requires pull request
  - Requires CI to pass
- **Updates**: Merge feature branches here first

### Feature Branches
- **Naming**: `feat/`, `fix/`, `docs/`, `chore/`
- **Base**: Create from `staging`
- **Merge to**: `staging` via pull request
- **Lifecycle**: Delete after merge

## Workflow

### 1. Create Feature Branch

```bash
# Start from staging
git checkout staging
git pull origin staging

# Create feature branch
git checkout -b feat/my-new-feature

# Work on your feature
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feat/my-new-feature
```

### 2. Merge to Staging

```bash
# Create pull request to staging
# Via GitHub UI or:
gh pr create --base staging --title "Add new feature"

# After PR approval and CI passes, merge
# Delete feature branch after merge
```

### 3. Test on Staging

- Visit `https://staging.eastgrinsteadac.co.uk`
- Run through testing checklist
- Verify all features work
- Check email delivery
- Test admin portal
- Monitor for errors

### 4. Promote to Production

```bash
# Create pull request from staging to main
git checkout staging
git pull origin staging

# Via GitHub UI:
# Create PR: staging → main

# After approval and final testing:
# Merge to main (deploys to production)
```

## Cloudflare Pages Configuration

### Staging Project
- **Name**: `egac-staging`
- **Branch**: `staging`
- **Domain**: `staging.eastgrinsteadac.co.uk`
- **Auto-deploy**: ✅ Yes (on push to `staging`)

### Production Project
- **Name**: `egac-production`
- **Branch**: `main`
- **Domain**: `eastgrinsteadac.co.uk`
- **Auto-deploy**: ✅ Yes (on push to `main`)

## Environment Variables

### Staging Environment
```bash
SITE_BASE_URL=https://staging.eastgrinsteadac.co.uk
# NOTE: When adding to Cloudflare Pages environment variables, do NOT include surrounding quotes. Use:
#   RESEND_FROM=EGAC Staging <noreply@eastgrinsteadac.co.uk>
RESEND_FROM=EGAC Staging <noreply@eastgrinsteadac.co.uk>
# Admin access: protect via Cloudflare Access (ZTNA). For CI use `STAGING_ACCESS_JWT`.
MEMBERSHIP_SECRETARY_EMAIL=staging-membership@eastgrinsteadac.co.uk
# Staging Supabase database
SUPABASE_URL=<staging-db-url>
```

### Production Environment
```bash
SITE_BASE_URL=https://eastgrinsteadac.co.uk
# NOTE: When adding to Cloudflare Pages environment variables, do NOT include surrounding quotes. Use:
#   RESEND_FROM=EGAC <noreply@eastgrinsteadac.co.uk>
RESEND_FROM=EGAC <noreply@eastgrinsteadac.co.uk>
# Admin access: protect via Cloudflare Access (ZTNA) in production; do not use legacy ADMIN_TOKEN fallbacks.
MEMBERSHIP_SECRETARY_EMAIL=membership@eastgrinsteadac.co.uk
# Production Supabase database
SUPABASE_URL=<production-db-url>
```

## Branch Protection Rules

### For `main` (Production)
Configure in GitHub Settings → Branches → Add rule:
- Branch name pattern: `main`
- ✅ Require pull request before merging
- ✅ Require approvals (1)
- ✅ Require status checks to pass before merging
  - `test` (CI workflow)
  - `lint` (CI workflow)
- ✅ Require branches to be up to date before merging
- ✅ Include administrators
- ✅ Restrict who can push (only admins)

### For `staging`
Configure in GitHub Settings → Branches → Add rule:
- Branch name pattern: `staging`
- ✅ Require pull request before merging
- ✅ Require status checks to pass before merging
  - `test` (CI workflow)
  - `lint` (CI workflow)
- ✅ Require branches to be up to date before merging

## Hotfix Process

For urgent production fixes:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix the issue
git add .
git commit -m "fix: resolve critical bug"
git push origin hotfix/critical-bug

# Create PR to main (urgent review)
# After merge, also merge main back to staging
git checkout staging
git pull origin staging
git merge main
git push origin staging
```

## Release Process

1. **Development**: Work on feature branches
2. **Integration**: Merge to `staging`, auto-deploys
3. **Testing**: QA on `staging.eastgrinsteadac.co.uk`
4. **Approval**: Get stakeholder sign-off
5. **Production**: Merge `staging` → `main`, auto-deploys
6. **Monitoring**: Watch for errors post-deployment

## Database Migrations

- **Test migrations on staging first**
- Apply manually before deploying code changes
- Document in `db/migrations/`
- Rollback plan required for production

## Common Commands

```bash
# Switch between environments
git checkout staging  # Work on staging
git checkout main     # View production code

# Update from remote
git pull origin staging
git pull origin main

# Create feature branch
git checkout staging
git checkout -b feat/my-feature

# Push feature branch
git push origin feat/my-feature

# Clean up merged branches
git branch -d feat/my-feature
git push origin --delete feat/my-feature
```

## Best Practices

1. **Always create feature branches from `staging`**
2. **Never commit directly to `main` or `staging`**
3. **Test thoroughly on staging before promoting to production**
4. **Keep staging in sync with main** (merge main to staging regularly)
5. **Delete feature branches after merge**
6. **Use semantic commit messages** (feat:, fix:, docs:, chore:)
7. **Run tests locally before pushing**
8. **Small, focused PRs** (easier to review)

## Troubleshooting

### Staging is behind main
```bash
git checkout staging
git pull origin staging
git merge main
git push origin staging
```

### Need to rollback production
```bash
# Option 1: Revert in Cloudflare Pages UI
# Go to Deployments → Select previous → Rollback

# Option 2: Git revert
git checkout main
git revert <commit-hash>
git push origin main
```

### Merge conflict
```bash
git checkout staging
git pull origin staging
git merge main  # or feature branch

# Resolve conflicts in files
git add .
git commit -m "chore: resolve merge conflicts"
git push origin staging
```

---

**Last Updated**: January 15, 2026  
**Current State**: 
- ✅ `staging` branch created
- ✅ `main` branch ready for production
- 🔄 Branch protection rules to be configured
