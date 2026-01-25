-- 2026-01-21: Remove duplicate bookings keeping the most recent row per invite_id
-- IMPORTANT: Run only after verifying results of the find and backup migrations above.

WITH ranked AS (
  SELECT id, row_number() OVER (PARTITION BY invite_id ORDER BY created_at DESC) rn
  FROM bookings
  WHERE invite_id IS NOT NULL
)
DELETE FROM bookings
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- This deletes all but the most recent booking for any invite_id that had >1 rows.
-- The backups are stored in bookings_duplicates_backup (see previous migration).
