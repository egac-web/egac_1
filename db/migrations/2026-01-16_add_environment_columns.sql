-- 2026-01-16: Add `environment` column to key tables to support environment tagging (staging/production)
BEGIN;

-- Add environment to enquiries
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production';
CREATE INDEX IF NOT EXISTS idx_enquiries_environment ON enquiries(environment);

-- Add environment to invites
ALTER TABLE invites ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production';
CREATE INDEX IF NOT EXISTS idx_invites_environment ON invites(environment);

-- Add environment to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production';
CREATE INDEX IF NOT EXISTS idx_bookings_environment ON bookings(environment);

-- Add environment to academy_invitations (if table exists)
ALTER TABLE academy_invitations ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production';
CREATE INDEX IF NOT EXISTS idx_academy_invitations_environment ON academy_invitations(environment);

COMMIT;
