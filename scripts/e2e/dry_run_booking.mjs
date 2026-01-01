// Use built-in fetch in Node 18+ and Supabase client for DB checks
import { createClient } from '@supabase/supabase-js';

// This script performs a dry-run end-to-end booking flow against local dev server
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/e2e/dry_run_booking.mjs

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE = process.env.BASE_URL || 'http://localhost:3000';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in env to run this script.');
  process.exit(2);
}

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  console.log('Creating enquiry...');
  const enquiryPayload = {
    contact_name: 'E2E Test',
    contact_email: `e2e+${Date.now()}@example.com`,
    gdpr_consent: 'true',
    interest: 'Training',
    dob: '2009-01-01'
  };

  const res = await fetch(`${BASE}/api/enquiry.json`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(enquiryPayload) });
  const body = await res.json();
  if (!res.ok || !body.ok) {
    console.error('Enquiry creation failed', body);
    process.exit(1);
  }
  console.log('Enquiry created', body);

  const inviteId = body.invite_id;
  if (!inviteId) {
    console.error('No invite created, cannot continue');
    process.exit(1);
  }

  // Fetch invite row to get token
  const { data: inviteRow, error } = await client.from('invites').select('*').eq('id', inviteId).maybeSingle();
  if (error || !inviteRow) {
    console.error('Could not fetch invite row', error);
    process.exit(1);
  }
  console.log('Invite token:', inviteRow.token);

  // Query booking availability for invite
  console.log('Checking availability via API...');
  const checkRes = await fetch(`${BASE}/api/booking.json?invite=${encodeURIComponent(inviteRow.token)}`);
  const checkBody = await checkRes.json();
  if (!checkRes.ok || !checkBody.ok) {
    console.error('Availability check failed', checkBody);
    process.exit(1);
  }

  // Find first eligible date
  const first = (checkBody.availability || []).find((a) => a.eligibleSlot && a.slots && (a.slots[a.eligibleSlot] > 0));
  if (!first) {
    console.error('No eligible slot found for invite');
    process.exit(1);
  }

  console.log('Booking slot', first.date, first.eligibleSlot);

  // Attempt booking
  const bookRes = await fetch(`${BASE}/api/booking.json`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ invite: inviteRow.token, session_date: first.date }) });
  const bookBody = await bookRes.json();
  if (!bookRes.ok || !bookBody.ok) {
    console.error('Booking failed', bookBody);
    process.exit(1);
  }

  console.log('Booking created', bookBody.booking);

  // Verify booking exists in DB
  const { data: dbBooking, error: bErr } = await client.from('bookings').select('*').eq('id', bookBody.booking.id).maybeSingle();
  if (bErr || !dbBooking) {
    console.error('Booking not found in DB', bErr);
    process.exit(1);
  }
  console.log('Booking verified in DB', dbBooking);

  // Check enquiry events for booking_created
  const { data: enq } = await client.from('enquiries').select('events').eq('id', body.enquiry_id).maybeSingle();
  const events = enq?.events || [];
  const bookingEvent = events.find((e) => e.type === 'booking_created');
  if (!bookingEvent) {
    console.warn('booking_created event not found in enquiry events', events);
  } else {
    console.log('Found booking_created event:', bookingEvent);
  }

  console.log('E2E dry-run booking flow completed successfully');
}

run().catch((err) => { console.error('E2E script failed', err); process.exit(1); });
