-- 2025-12-29: Create secretaries table to manage admin users

CREATE TABLE IF NOT EXISTS secretaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS secretaries_email_idx ON secretaries ((lower(email)));

-- End of migration
