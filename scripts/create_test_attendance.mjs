import { getSupabaseAdmin } from '../src/lib/supabase.ts';

// Create a test enquiry and booking
const client = getSupabaseAdmin(process.env);

// First, create a test enquiry
const { data: enquiry, error: enquiryErr } = await client.from('enquiries').insert({
  name: 'Test Attendance User',
  email: 'test-attendance@example.com',
  phone: '07700900000',
  age: 14,
  postcode: 'RH19 1AA',
  marketing_consent: false
}).select().single();

if (enquiryErr) {
  console.error('Failed to create enquiry:', enquiryErr);
  process.exit(1);
}

console.log('Created enquiry:', enquiry.id);

// Create a test booking
const { data: booking, error: bookingErr } = await client.from('bookings').insert({
  enquiry_id: enquiry.id,
  session_date: '2026-02-10',
  slot: 'u15plus',
  status: 'confirmed'
}).select().single();

if (bookingErr) {
  console.error('Failed to create booking:', bookingErr);
  process.exit(1);
}

console.log('Created booking:', booking.id);
console.log('\nTest with: curl -X POST "https://staging.eastgrinsteadac.co.uk/api/admin/booking/attendance.json?token=dev" -H "Content-Type: application/json" -d \'{"booking_id":"' + booking.id + '","status":"attended","note":"Test"}\'');
