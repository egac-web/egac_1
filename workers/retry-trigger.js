export default {
  async scheduled(event, env, ctx) {
    try {
      const url = `${env.SITE_BASE_URL}/api/admin/retry-invites.json?secret=${env.CRON_SECRET}`;
      const res = await fetch(url, { method: 'GET' });
      const text = await res.text();
      console.log('Retry job status', res.status, text);
    } catch (err) {
      console.error('Scheduled retry failed', err);
    }
  }
};
