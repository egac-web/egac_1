-- Migration: Add "someone else" enquiry fields
-- Date: 2025-12-30
-- Description: Adds fields to support parent/guardian enquiries for child/athlete

ALTER TABLE enquiries 
  ADD COLUMN IF NOT EXISTS enquiry_type text,
  ADD COLUMN IF NOT EXISTS enquiry_for text,
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS subject_first_name text,
  ADD COLUMN IF NOT EXISTS subject_last_name text,
  ADD COLUMN IF NOT EXISTS subject_dob date;

-- Update name field to be computed from first_name + last_name for backwards compat
-- (or null if using new split fields)
COMMENT ON COLUMN enquiries.name IS 'Deprecated: Use first_name + last_name instead';
COMMENT ON COLUMN enquiries.phone IS 'Deprecated: Use contact_phone instead';

-- Add index on enquiry_type for filtering
CREATE INDEX IF NOT EXISTS enquiries_enquiry_type_idx ON enquiries (enquiry_type);
CREATE INDEX IF NOT EXISTS enquiries_enquiry_for_idx ON enquiries (enquiry_for);
