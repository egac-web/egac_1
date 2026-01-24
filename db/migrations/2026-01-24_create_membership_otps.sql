-- 2026-01-24: Create membership_otps table to store OTPs sent for membership confirmation

CREATE TABLE IF NOT EXISTS membership_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id uuid NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index to find active OTPs quickly
CREATE INDEX IF NOT EXISTS membership_otps_invite_idx ON membership_otps(invite_id);
