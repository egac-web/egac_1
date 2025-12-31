-- 2025-12-29: Add Presli confirmation fields to enquiries

ALTER TABLE IF EXISTS enquiries
  ADD COLUMN IF NOT EXISTS presli_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS presli_note text;

-- end of migration
