-- 2026-01-10: Add Academy invitation tracking for U11 athletes
BEGIN;

-- Add academy flag to enquiries to identify U11 applicants
ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS is_academy BOOLEAN DEFAULT FALSE;

-- Create academy_invitations table to track invitation status
CREATE TABLE IF NOT EXISTS academy_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  response TEXT CHECK (response IN ('yes', 'no', NULL)),
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'declined', 'failed')),
  UNIQUE(enquiry_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_academy_invitations_token ON academy_invitations(token);
CREATE INDEX IF NOT EXISTS idx_academy_invitations_enquiry_id ON academy_invitations(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_is_academy ON enquiries(is_academy);

-- Enable RLS
ALTER TABLE academy_invitations ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (admin endpoints use service_role key)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = current_schema() 
    AND tablename = 'academy_invitations' 
    AND policyname = 'service_role_academy_invitations'
  ) THEN
    CREATE POLICY "service_role_academy_invitations" ON academy_invitations
      FOR ALL USING (true);
  END IF;
END$$;

COMMIT;
