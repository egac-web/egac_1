-- 2026-01-24: Add additional jsonb and created_at to members

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS additional jsonb,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS members_created_at_idx ON members(created_at DESC);