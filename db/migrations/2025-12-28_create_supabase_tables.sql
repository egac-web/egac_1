-- 2025-12-28: Create initial tables for enquiries, invites and members

-- Enable pgcrypto for gen_random_uuid & gen_random_bytes
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper to generate an invite token (hex)
CREATE OR REPLACE FUNCTION generate_invite_token()
RETURNS text AS $$
  SELECT encode(gen_random_bytes(12), 'hex');
$$ LANGUAGE SQL VOLATILE;

-- enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text,
  email text,
  phone text,
  interest text,
  training_days jsonb,
  dob date,
  source text,
  processed boolean NOT NULL DEFAULT false,
  note text,
  raw_payload jsonb
);

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at);
CREATE INDEX IF NOT EXISTS enquiries_email_idx ON enquiries ((lower(email)));

-- invites table
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  enquiry_id uuid REFERENCES enquiries(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  accepted_at timestamptz,
  status text NOT NULL DEFAULT 'pending' -- pending, sent, accepted, expired
);

CREATE INDEX IF NOT EXISTS invites_token_idx ON invites (token);

-- members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE,
  phone text,
  joined_at timestamptz NOT NULL DEFAULT now(),
  membership_type text,
  notes text,
  source text
);

-- Optional: columns and FK to link enquiries -> invites (useful for quick lookups)
ALTER TABLE IF EXISTS enquiries
  ADD COLUMN IF NOT EXISTS invite_id uuid REFERENCES invites(id) ON DELETE SET NULL;

-- Add simple policy placeholder (RLS to be added later during implementation)
-- Note: Add Row-Level Security rules after deploying the schema, and ensure service_role key is only used server-side.

-- End of migration
