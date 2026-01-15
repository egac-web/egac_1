-- 2026-01-11: Add status tracking to enquiries table
BEGIN;

-- Add status column to track enquiry lifecycle
ALTER TABLE enquiries 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'joined', 'not_joined', 'no_response'));

-- Add notes column for admin notes
ALTER TABLE enquiries
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add index on status for filtering
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

-- Backfill existing records to 'pending' if NULL
UPDATE enquiries SET status = 'pending' WHERE status IS NULL;

COMMIT;
