-- 2025-12-29: Add attendance support to bookings

ALTER TABLE IF EXISTS bookings
  ADD COLUMN IF NOT EXISTS attendance_note text;

-- no destructive changes to status column; we'll reuse text states 'scheduled'|'attended'|'no_show'|'cancelled'

-- end of migration
