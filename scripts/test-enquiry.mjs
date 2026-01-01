import * as api from '../src/pages/api/enquiry.json.js';

async function run() {
  try {
    const fakeReq = {
      json: async () => ({
        contact_name: 'Script Test',
        contact_email: 'script+test@example.com',
        gdpr_consent: 'true',
        interest: 'Training',
        dob: '2008-01-01',
      }),
      url: 'http://localhost'
    };

    const res = await api.post({ request: fakeReq });
    console.log('API response:', res);
  } catch (err) {
    console.error('Error calling API:', err);
  }
}

run();
