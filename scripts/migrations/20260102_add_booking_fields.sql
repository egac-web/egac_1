-- 2026-01-02: Add booking metadata fields
-- Adds booking_for and subject_dob columns to bookings table to store who the booking is for
BEGIN;

ALTER TABLE IF EXISTS bookings
  ADD COLUMN IF NOT EXISTS booking_for text;

ALTER TABLE IF EXISTS bookings
  ADD COLUMN IF NOT EXISTS subject_dob date;

COMMIT;

-- Rollback:
-- ALTER TABLE bookings DROP COLUMN IF EXISTS booking_for;
-- ALTER TABLE bookings DROP COLUMN IF EXISTS subject_dob;
