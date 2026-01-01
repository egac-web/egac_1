// Simple test script: POST an enquiry with RESEND_DRY_RUN=1 to avoid sending real emails
import fetch from 'node-fetch';

async function run() {
  const payload = {
    contact_name: 'Notify Test',
    contact_email: 'notify-test@example.com',
    contact_phone: '0123456789',
    dob: '2010-01-01',
    message: 'Testing notification helper',
    gdpr_consent: true
  };

  console.log('Posting enquiry (dry-run)');
  const res = await fetch('https://egac-1.pages.dev/api/enquiry.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    // set a query param or header to request dry-run? We rely on env RESEND_DRY_RUN in server config
  });
  const json = await res.json().catch(() => null);
  console.log('Response:', res.status, json);
}

run().catch((e) => { console.error(e); process.exit(1); });
