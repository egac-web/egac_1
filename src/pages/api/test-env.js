export const prerender = false;

export async function GET({ locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    
    const hasSupabaseUrl = !!env.SUPABASE_URL;
    const hasSupabaseKey = !!env.SUPABASE_SERVICE_ROLE_KEY;
    
    return new Response(JSON.stringify({
      ok: true,
      hasLocals: !!locals,
      hasRuntime: !!locals?.runtime,
      hasEnv: !!locals?.runtime?.env,
      hasSupabaseUrl,
      hasSupabaseKey,
      envType: typeof env,
      localsKeys: locals ? Object.keys(locals) : [],
      runtimeKeys: locals?.runtime ? Object.keys(locals.runtime) : []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      error: err.message,
      stack: err.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
