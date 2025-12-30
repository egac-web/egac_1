-- 2025-12-28: Create bookings table for session bookings

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid REFERENCES enquiries(id) ON DELETE CASCADE,
  invite_id uuid REFERENCES invites(id) ON DELETE SET NULL,
  session_date date NOT NULL,
  slot text NOT NULL, -- e.g., 'u13' | 'u15plus'
  session_time time,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'confirmed' -- confirmed, cancelled
);

-- index for quick lookups
CREATE INDEX IF NOT EXISTS bookings_session_date_slot_idx ON bookings (session_date, slot);
CREATE INDEX IF NOT EXISTS bookings_enquiry_idx ON bookings (enquiry_id);

-- ensure we don't create duplicate bookings for same invite & date
CREATE UNIQUE INDEX IF NOT EXISTS bookings_invite_date_uniq ON bookings (invite_id, session_date);

-- end of migration
