-- 2026-01-01: Add booking relationship fields to enquiries

ALTER TABLE IF EXISTS enquiries
  ADD COLUMN IF NOT EXISTS booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS booking_date date;

CREATE INDEX IF NOT EXISTS enquiries_booking_id_idx ON enquiries (booking_id);
CREATE INDEX IF NOT EXISTS enquiries_booking_date_idx ON enquiries (booking_date);

-- end of migration
