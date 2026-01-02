-- 2026-01-02: Add send_attempts column to invites
-- This migration is backwards-compatible: it creates the column if missing and backfills NULLs to 0.
BEGIN;

-- Add column if missing and default to 0 for new rows
ALTER TABLE invites
  ADD COLUMN IF NOT EXISTS send_attempts integer NOT NULL DEFAULT 0;

-- Backfill existing rows that somehow have NULL
UPDATE invites SET send_attempts = 0 WHERE send_attempts IS NULL;

COMMIT;

-- Rollback (if required):
-- ALTER TABLE invites DROP COLUMN IF EXISTS send_attempts;

-- Notes:
-- - Run this on your Postgres/Supabase DB (via psql, supabase SQL editor, or migration tooling).
-- - This is a safe, idempotent migration: it uses IF NOT EXISTS.
