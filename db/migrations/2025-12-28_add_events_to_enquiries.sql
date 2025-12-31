-- 2025-12-28: Add events column to enquiries to keep an audit trail

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS events jsonb DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS enquiries_events_idx ON enquiries USING gin (events jsonb_path_ops);

-- Optional: helper function to append an event (not strictly required but convenient)
CREATE OR REPLACE FUNCTION append_enquiry_event(enq_id uuid, ev jsonb)
RETURNS void AS $$
BEGIN
  UPDATE enquiries
  SET events = COALESCE(events, '[]'::jsonb) || ev
  WHERE id = enq_id;
END;
$$ LANGUAGE plpgsql VOLATILE;
