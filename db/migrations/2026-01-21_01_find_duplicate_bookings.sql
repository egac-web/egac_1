-- 2026-01-21: Find duplicate bookings by invite_id
-- Run this first to inspect duplicates before making any changes.

SELECT invite_id, array_agg(id ORDER BY created_at DESC) AS ids, count(*) AS cnt
FROM bookings
WHERE invite_id IS NOT NULL
GROUP BY invite_id
HAVING count(*) > 1
ORDER BY cnt DESC;
