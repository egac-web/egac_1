export const prerender = false;

export async function GET({ locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    
    const supabaseUrl = env.SUPABASE_URL || '';
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    // Show first 10 and last 10 chars to verify without exposing full key
    const urlPreview = supabaseUrl ? `${supabaseUrl.substring(0, 20)}...${supabaseUrl.substring(supabaseUrl.length - 10)}` : 'MISSING';
    const keyPreview = supabaseKey ? `${supabaseKey.substring(0, 10)}...${supabaseKey.substring(supabaseKey.length - 10)}` : 'MISSING';
    
    return new Response(JSON.stringify({
      ok: true,
      urlLength: supabaseUrl.length,
      keyLength: supabaseKey.length,
      urlPreview,
      keyPreview,
      urlType: typeof env.SUPABASE_URL,
      keyType: typeof env.SUPABASE_SERVICE_ROLE_KEY
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      error: err.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
