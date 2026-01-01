// Simple POST health endpoint to verify Pages accepts POSTs
export const prerender = false;

export async function POST() {
  return new Response(JSON.stringify({ ok: true, message: 'pong', route: '/api/_ping.json' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
