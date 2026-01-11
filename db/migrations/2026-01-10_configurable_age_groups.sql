-- 2026-01-10: Make age groups configurable for future England Athletics changes
BEGIN;

-- Create age_groups configuration table
CREATE TABLE IF NOT EXISTS age_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  min_age INTEGER NOT NULL,
  max_age INTEGER,
  session_day TEXT,
  session_time TEXT,
  capacity_per_session INTEGER DEFAULT 2,
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create system_config table for general settings
CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default age groups (current U13/U15+ setup)
INSERT INTO age_groups (code, label, min_age, max_age, session_day, session_time, sort_order, active)
VALUES 
  ('u13', 'U13 (Tue 18:30)', 11, 12, 'Tuesday', '18:30', 1, true),
  ('u15plus', 'U15+ (Tue 19:30)', 13, NULL, 'Tuesday', '19:30', 2, true)
ON CONFLICT (code) DO NOTHING;

-- Insert system config for Academy threshold
INSERT INTO system_config (key, value, description)
VALUES 
  ('academy_max_age', '10', 'Maximum age for Academy (U11). Athletes this age or younger go to Academy instead of taster sessions.'),
  ('weeks_ahead_booking', '8', 'Number of weeks ahead that booking slots are available'),
  ('site_name', 'EGAC', 'Site/club name used in emails and UI')
ON CONFLICT (key) DO NOTHING;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_age_groups_active ON age_groups(active);
CREATE INDEX IF NOT EXISTS idx_age_groups_sort_order ON age_groups(sort_order);

-- Enable RLS
ALTER TABLE age_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Service role has full access (admin endpoints use service_role key)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = current_schema() 
    AND tablename = 'age_groups' 
    AND policyname = 'service_role_age_groups'
  ) THEN
    CREATE POLICY "service_role_age_groups" ON age_groups
      FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = current_schema() 
    AND tablename = 'system_config' 
    AND policyname = 'service_role_system_config'
  ) THEN
    CREATE POLICY "service_role_system_config" ON system_config
      FOR ALL USING (true);
  END IF;
END$$;

-- Allow public read access to age_groups (for booking form)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = current_schema() 
    AND tablename = 'age_groups' 
    AND policyname = 'public_read_age_groups'
  ) THEN
    CREATE POLICY "public_read_age_groups" ON age_groups
      FOR SELECT USING (active = true);
  END IF;
END$$;

COMMIT;
