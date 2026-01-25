-- 2026-01-24: Add RPC to fetch booking with its enquiry to avoid ambiguous Supabase embeds

CREATE OR REPLACE FUNCTION public.get_booking_with_enquiry(bid uuid)
RETURNS TABLE (
  id uuid,
  enquiry_id uuid,
  invite_id uuid,
  session_date date,
  slot text,
  session_time text,
  status text,
  attendance_note text,
  environment text,
  created_at timestamptz,
  updated_at timestamptz,
  enquiry jsonb
) AS $$
  SELECT
    b.id,
    b.enquiry_id,
    b.invite_id,
    b.session_date,
    b.slot,
    b.session_time,
    b.status,
    b.attendance_note,
    b.environment,
    b.created_at,
    b.updated_at,
    to_jsonb(e.*) AS enquiry
  FROM bookings b
  LEFT JOIN enquiries e ON e.id = b.enquiry_id
  WHERE b.id = bid
$$ LANGUAGE sql STABLE;

-- Grant execute to service_role (optional, adjust as necessary)
GRANT EXECUTE ON FUNCTION public.get_booking_with_enquiry(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_booking_with_enquiry(uuid) TO anon;