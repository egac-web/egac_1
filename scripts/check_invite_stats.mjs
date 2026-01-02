#!/usr/bin/env node
/*
  scripts/check_invite_stats.mjs
  - Call the Pages endpoint /api/admin/invite-stats.json?secret=... and exit non-zero if failed invites > 0
  - Usage:
      CRON_SECRET=<secret> PAGES_SITE_URL=https://egac-1.pages.dev node scripts/check_invite_stats.mjs
*/

const SITE = process.env.PAGES_SITE_URL || 'https://egac-1.pages.dev';
const SECRET = process.env.CRON_SECRET;

if (!SECRET) {
  console.error('ERROR: CRON_SECRET not set in environment');
  process.exit(2);
}

const url = new URL('/api/admin/invite-stats.json', SITE);
url.searchParams.set('secret', SECRET);

(async () => {
  try {
    const res = await fetch(url.toString(), { method: 'GET' });
    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    if (!res.ok) {
      console.error('Request failed:', res.status, text);
      process.exit(3);
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON from invite-stats:', text);
      process.exit(4);
    }

    const counts = (json && json.counts) ? json.counts : { pending: 0, failed: 0, sent: 0 };
    console.log('Invite counts:', JSON.stringify(counts));

    if ((counts.failed || 0) > 0) {
      console.error('ALERT: failed invites > 0:', counts.failed);
      process.exit(1);
    }

    // If you also want to alert on pending > X, change the condition above.
    process.exit(0);
  } catch (err) {
    console.error('Error calling invite-stats endpoint:', err);
    process.exit(5);
  }
})();
