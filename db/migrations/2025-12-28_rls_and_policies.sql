-- 2025-12-28: Enable Row-Level Security and add baseline policies

-- Enable RLS on key tables
ALTER TABLE IF EXISTS enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS members ENABLE ROW LEVEL SECURITY;

-- NOTE: service_role bypasses RLS entirely. Policies below allow a 'secretary'
-- role (set as a custom claim in the JWT) to SELECT / UPDATE where appropriate.

-- Enquiries: allow SELECT and UPDATE for users listed in `secretaries` by email
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'enquiries' AND policyname = 'secretary_select_enquiries') THEN
    CREATE POLICY "secretary_select_enquiries" ON enquiries
      FOR SELECT USING (EXISTS (SELECT 1 FROM secretaries s WHERE lower(s.email) = lower(auth.jwt() ->> 'email')));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'enquiries' AND policyname = 'secretary_update_enquiries') THEN
    CREATE POLICY "secretary_update_enquiries" ON enquiries
      FOR UPDATE USING (EXISTS (SELECT 1 FROM secretaries s WHERE lower(s.email) = lower(auth.jwt() ->> 'email'))) WITH CHECK (EXISTS (SELECT 1 FROM secretaries s WHERE lower(s.email) = lower(auth.jwt() ->> 'email')));
  END IF;
END$$;

-- Invites: allow secretary to select and update
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'invites' AND policyname = 'secretary_select_invites') THEN
    CREATE POLICY "secretary_select_invites" ON invites
      FOR SELECT USING (EXISTS (SELECT 1 FROM secretaries s WHERE lower(s.email) = lower(auth.jwt() ->> 'email')));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'invites' AND policyname = 'secretary_update_invites') THEN
    CREATE POLICY "secretary_update_invites" ON invites
      FOR UPDATE USING (EXISTS (SELECT 1 FROM secretaries s WHERE lower(s.email) = lower(auth.jwt() ->> 'email'))) WITH CHECK (EXISTS (SELECT 1 FROM secretaries s WHERE lower(s.email) = lower(auth.jwt() ->> 'email')));
  END IF;
END$$;

-- Bookings: allow secretary to manage bookings
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'bookings' AND policyname = 'secretary_select_bookings') THEN
    CREATE POLICY "secretary_select_bookings" ON bookings
      FOR SELECT USING (EXISTS (SELECT 1 FROM secretaries s WHERE lower(s.email) = lower(auth.jwt() ->> 'email')));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'bookings' AND policyname = 'secretary_update_bookings') THEN
    CREATE POLICY "secretary_update_bookings" ON bookings
      FOR UPDATE USING (EXISTS (SELECT 1 FROM secretaries s WHERE lower(s.email) = lower(auth.jwt() ->> 'email'))) WITH CHECK (EXISTS (SELECT 1 FROM secretaries s WHERE lower(s.email) = lower(auth.jwt() ->> 'email')));
  END IF;
END$$;

-- Members: allow secretary to manage members
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'members' AND policyname = 'secretary_select_members') THEN
    CREATE POLICY "secretary_select_members" ON members
      FOR SELECT USING ((auth.jwt() ->> 'role') = 'secretary');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = current_schema() AND tablename = 'members' AND policyname = 'secretary_update_members') THEN
    CREATE POLICY "secretary_update_members" ON members
      FOR UPDATE USING ((auth.jwt() ->> 'role') = 'secretary') WITH CHECK ((auth.jwt() ->> 'role') = 'secretary');
  END IF;
END$$;

-- Optionally: allow authenticated inserts for members (if you want to allow signup flow)
-- CREATE POLICY IF NOT EXISTS "authenticated_insert_members" ON members
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Helpful comment: service_role key is the only method to bypass these policies when executing server-side actions.


-- End of RLS migration
