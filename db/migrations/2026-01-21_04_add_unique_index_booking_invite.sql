-- 2026-01-21: Add unique index on bookings(invite_id) to prevent duplicate bookings
-- Preferred: run the CONCURRENTLY variant in an interactive psql/Supabase SQL editor (OUTSIDE any wrapping transaction):

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_invite_id_unique
ON bookings (invite_id)
WHERE invite_id IS NOT NULL;

-- If your migration runner wraps statements in a transaction and therefore cannot run CONCURRENTLY,
-- use the non-CONCURRENT variant (may take an exclusive lock while index builds):
--
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_invite_id_unique
-- ON bookings (invite_id)
-- WHERE invite_id IS NOT NULL;

-- Verify with:
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'bookings' AND indexname LIKE 'idx_bookings_invite_id%';
