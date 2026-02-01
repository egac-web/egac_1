(async () => {
  const path = require('path');
  const modPath = path.resolve(__dirname, '../src/pages/api/admin/booking/attendance.json.js');
  const mod = require(modPath);
  const bookingId = process.argv[2];
  const status = process.argv[3] || 'attended';
  const send_membership_link = process.argv[4] === 'true';
  const req = {
    // Local dev uses the dev auto-login token (only valid in test/local dev environment)
    headers: { get: (k) => 'dev' },
    json: async () => ({ booking_id: bookingId, status, send_membership_link }),
  };
  try {
    const res = await mod.post({ request: req });
    console.log('Response status:', res.status);
    console.log('Body:', JSON.stringify(res.body, null, 2));
  } catch (err) {
    console.error('Error calling attendance endpoint:', err);
    process.exit(1);
  }
})();
