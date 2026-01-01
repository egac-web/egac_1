// Minimal test endpoint to verify POST routing on Pages
export const prerender = false;

export async function POST({ request }) {
  return new Response(JSON.stringify({ 
    ok: true, 
    message: 'POST received successfully',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function GET() {
  return new Response(JSON.stringify({ 
    ok: true, 
    message: 'GET received successfully',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
