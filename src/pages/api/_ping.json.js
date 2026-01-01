// Simple POST health endpoint to verify Pages accepts POSTs
export const prerender = false;

export async function post() {
  return { status: 200, body: { ok: true, message: 'pong', route: '/api/_ping.json' } };
}
