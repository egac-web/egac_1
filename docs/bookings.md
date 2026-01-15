# Booking (Taster sessions) — Design & Implementation 📋

**Purpose:** Document the booking/taster session flows, key files, business rules, and operational scripts to onboard developers and operators.

---

## Overview

Taster sessions (bookings) are a workflow that starts with a public enquiry, issues an invite to the enquirer, and allows invite-holders to book a taster session (per-slot capacity). The system records events on enquiries for auditability and supports confirmation, reminders, attendance recording and membership followups.

---

## Key endpoints

- `POST /api/enquiry` — create an enquiry; creates an invite and attempts to email it. (See `src/pages/api/enquiry.json.js`)
- `GET /api/booking` — fetch availability and invite/enquiry details for a token (or general availability when no token). (See `src/pages/api/booking.json.js`)
- `POST /api/booking` — create a booking for a valid invite and session date. (See `src/pages/api/booking.json.js`)
- `POST /api/booking/cancel` — cancel an existing booking (validated by invite token + booking id). (See `src/pages/api/booking/cancel.json.js`)
- Admin endpoints: `POST /api/admin/booking/attendance` (mark attendance and optionally send membership invite), `GET /api/admin/send-reminders.json` (send reminders), and `POST|GET /api/admin/retry-invites.json` (retry failed invite sends).

---

## Core implementation details

- Age calculation and slot selection: `src/lib/booking.ts`
  - Age boundary: under 13 -> `u13`; 13 and older -> `u15plus`
  - `getNextNWeekdayDates` returns upcoming Tuesdays to allow booking across weeks.
- Capacity checks: `countBookingsForDateSlot(session_date, slot)` in `src/lib/supabase.ts` ensures capacity (configurable via `CONFIG.capacityPerSlot`).
- Booking creation: `createBooking(...)` writes to the `bookings` table and returns the inserted row.
- Invite handling: invites are stored in `invites` with a `status` (pending/sent/accepted/failed) and a `token` used by invitees to book.
- Event trail: `appendEnquiryEvent` stores events (invite_sent, booking_created, booking_confirm_email_sent, reminder_sent, attendance, etc.) on the `enquiries.events` JSON field for audit and debugging.

---

## Database

- Table: `bookings` (see `db/migrations/2025-12-28_create_bookings_table.sql`)
  - Important fields: `id`, `enquiry_id`, `invite_id`, `session_date`, `slot`, `session_time`, `status`
  - Unique index: `bookings_invite_date_uniq` (prevents more than one booking per invite per date)
  - Indexes: `bookings_session_date_slot_idx`, `bookings_enquiry_idx`
- RLS & policies: `db/migrations/2025-12-28_rls_and_policies.sql` defines secretary policies (select/update) and enables RLS on `bookings`.

---

## Emails & notifications

- Invite emails, booking confirmations, reminder emails, and secretary notifications are sent via Resend API helpers: `src/lib/resend.ts` and orchestrated in `src/lib/notifications.ts`.
- Each email send attempts to append an event to the `enquiries` record (e.g., `booking_confirm_email_sent`) with metadata about the send.

---

## Operational scripts & tests

- Smoke/E2E scripts: `scripts/smoke-test-supabase.js`, `scripts/e2e/dry_run_booking.mjs`, `scripts/test-booking-dist.mjs` — useful to validate booking flows against a staging Supabase instance or a local dev server.
- Retry & scheduled jobs: `scripts/retry_failed_invites.mjs` (CLI) and `src/workers/retry-trigger.js` (Cloudflare Worker scheduled to call retry/reminders endpoints).
- Admin helpers: `scripts/run_attendance.js`, `scripts/run_attendance_direct.js` to mark attendance programmatically.

---

## Business rules & edge cases

- Invite must be `pending` to be used for booking; booking will `markInviteAccepted` and append a `booking_created` event.
- Capacity is enforced atomically on insert (app-level check + DB constraints/uniqueness help prevent inconsistencies). Consider stronger DB-level checks or transactional logic for high-concurrency scenarios.
- For bookings on behalf of someone else, `subject_dob` is required and preference is given to `subject_dob` for age calculation.

---

## Recommendations / Next steps

- Add unit tests for `slotForAge`, `computeAgeOnDate`, and API endpoint tests for the booking flow (including double-booking and capacity exhaustion cases).
- Add an integration E2E job that runs the dry-run scripts against a staging Supabase instance as part of CI or a scheduled check.
- Review and test email fail cases (Resend dry-run support is present) and ensure events are recorded for failed sends.
- Evaluate using DB transactions for booking creation + invite acceptance updates to minimise race conditions.

---

## Files to review quickly

- `src/pages/api/enquiry.json.js`
- `src/pages/api/booking.json.js`
- `src/pages/api/booking/cancel.json.js`
- `src/pages/api/admin/booking/attendance.json.js`
- `src/lib/booking.ts` and `src/lib/supabase.ts`
- `db/migrations/2025-12-28_create_bookings_table.sql`
- `scripts/smoke-test-supabase.js`, `scripts/e2e/dry_run_booking.mjs`

---

If you'd like I can add a basic test suite that covers booking creation, capacity limits, and cancellation flows and wire it into CI; tell me how you prefer tests to be executed (Node-based tests with a mocked Supabase client, or an integration test against staging).
