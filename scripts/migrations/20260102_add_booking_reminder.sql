-- 2026-01-02: Add booking reminder support and uniqueness on invite
-- Safe, idempotent migration to add reminder_sent flag, unique constraint on invite_id
-- and an index on session_date to speed reminder queries.

BEGIN;

-- Add reminder_sent column (default false)
ALTER TABLE IF EXISTS bookings
  ADD COLUMN IF NOT EXISTS reminder_sent boolean NOT NULL DEFAULT false;

-- Backfill any NULLs if present
UPDATE bookings SET reminder_sent = false WHERE reminder_sent IS NULL;

-- Add a unique index on invite_id to prevent more than one booking per invite
-- NOTE: If duplicates already exist, this will fail. Check duplicates BEFORE running.
CREATE UNIQUE INDEX IF NOT EXISTS bookings_invite_id_key ON bookings(invite_id);

-- Index session_date for efficient range queries when selecting reminders
CREATE INDEX IF NOT EXISTS bookings_session_date_idx ON bookings(session_date);

COMMIT;

-- Rollback guidance (manual):
-- ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_invite_id_key;
-- DROP INDEX IF EXISTS bookings_session_date_idx;
-- ALTER TABLE bookings DROP COLUMN IF EXISTS reminder_sent;

-- Pre-migration checks (recommended):
-- -- Check for duplicate invite_id values
-- SELECT invite_id, count(*) FROM bookings GROUP BY invite_id HAVING count(*) > 1;
-- If duplicates exist, resolve them (merge or delete) before applying this migration.
