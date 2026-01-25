-- 2026-01-21: Backup duplicate bookings to allow safe deletion
-- This creates a backup table (if missing) and copies any rows for invite_ids that occur more than once.
-- Run this BEFORE running the delete migration so you can recover if necessary.

BEGIN;

CREATE TABLE IF NOT EXISTS bookings_duplicates_backup (LIKE bookings INCLUDING ALL);

INSERT INTO bookings_duplicates_backup
SELECT b.*
FROM bookings b
WHERE b.invite_id IS NOT NULL
  AND b.invite_id IN (
    SELECT invite_id FROM bookings GROUP BY invite_id HAVING COUNT(*) > 1
  );

COMMIT;

-- Note: you can inspect the backup with:
-- SELECT * FROM bookings_duplicates_backup WHERE invite_id = '<problem-invite-id>';
