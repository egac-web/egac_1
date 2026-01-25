export const prerender = false;

// Read build info from the generated module (set during build by prebuild script)
import buildInfo from '../../lib/buildInfo.json';

export async function GET() {
  try {
    const info = {
      sha: buildInfo.sha || process.env.BUILD_SHA || 'unknown',
      built_at: buildInfo.built_at || process.env.BUILD_TIME || new Date().toISOString()
    };
    return new Response(JSON.stringify({ ok: true, version: info }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Version endpoint error', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
