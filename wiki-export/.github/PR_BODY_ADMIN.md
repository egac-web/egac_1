This draft PR implements admin portal fixes and test scaffolding.

Summary of changes:
- Fix auth to accept `dev` token and support `?token` query param for admin endpoints
- Rewrite `enquiries` endpoint to avoid embedding issues (fetches invites/bookings separately)
- Fix templates endpoint imports & add email template helpers
- Add Supabase admin helpers: `getActiveAgeGroups`, `getSystemConfigAll`, `updateSystemConfig`, `createAgeGroup`, `updateAgeGroup`
- Add DB migration `db/migrations/2026-01-08_add_last_send_error.sql`
- Add debug logs and dev-only error responses (when using `?token=dev`) for easier local debugging
- Add integration tests for admin API endpoints (mocked Supabase)

Verification performed locally:
- `curl -i "http://localhost:3000/api/admin/config.json?token=dev"` → 200 OK (includes `ageGroups` and `systemConfig`)
- `curl -i "http://localhost:3000/api/admin/templates.json?token=dev"` → 200 OK (returns `templates`)
- `npm test` → 48/48 tests passing

Notes / Next steps:
- Add e2e/integration tests that exercise the UI flows (invite send, attendance, templates preview)
- Polish admin UI (styling, content, accessibility) in separate branch `feat/admin-ui-polish`
- Apply DB migrations to staging before deploying

Please review. @team please review when ready.
