-- 2026-01-08: Add last_send_error column to invites
BEGIN;

ALTER TABLE invites
  ADD COLUMN IF NOT EXISTS last_send_error jsonb;

COMMIT;