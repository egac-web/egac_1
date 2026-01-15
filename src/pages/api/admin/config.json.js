import * as supabase from '../../../lib/supabase';

export const prerender = false;

export async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get('x-admin-token') || url.searchParams.get('token');

    // Debug: surface token presence and supabase env for troubleshooting
    console.debug('Config GET - token present:', !!token, 'tokenPreview:', token ? token.substring(0, 4) + '...' : 'none');
    console.debug('Config GET - SUPABASE_URL present:', !!env.SUPABASE_URL, 'SERVICE_ROLE present:', !!env.SUPABASE_SERVICE_ROLE_KEY);

    if (!token || (token !== 'dev' && token !== env.ADMIN_TOKEN)) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure Supabase credentials are available before making requests
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Config GET missing Supabase env vars - SUPABASE_URL:', !!env.SUPABASE_URL, 'SERVICE_ROLE:', !!env.SUPABASE_SERVICE_ROLE_KEY);
      return new Response(JSON.stringify({ ok: false, error: 'Missing Supabase credentials (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Debug: inspect supabase exports
    console.debug('Config GET - supabase exports:', Object.keys(supabase).join(', '));
    console.debug('Config GET - getActiveAgeGroups type:', typeof supabase.getActiveAgeGroups, 'getSystemConfigAll type:', typeof supabase.getSystemConfigAll);

    // Get all age groups (including inactive)
    const ageGroups = await supabase.getActiveAgeGroups(env);

    // Get system configuration
    const systemConfig = await supabase.getSystemConfigAll(env);

    return new Response(
      JSON.stringify({ ok: true, ageGroups: ageGroups || [], systemConfig: systemConfig || {} }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Config GET error', err && err.stack ? err.stack : err);
    // If dev token is used, return the underlying error to help debug locally
    const urlDbg = new URL(request.url);
    const requestToken = request.headers.get('x-admin-token') || urlDbg.searchParams.get('token');
    if (requestToken === 'dev') {
      return new Response(JSON.stringify({ ok: false, error: String(err && err.message ? err.message : 'Server error') }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const url = new URL(request.url);
    const token = request.headers.get('x-admin-token') || url.searchParams.get('token');

    if (!token || (token !== 'dev' && token !== env.ADMIN_TOKEN)) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'update_system') {
      // Update system configuration
      let updates = {};
      if (body.academy_max_age !== undefined) updates.academy_max_age = body.academy_max_age;
      if (body.weeks_ahead_booking !== undefined)
        updates.weeks_ahead_booking = body.weeks_ahead_booking;

      // Persist each setting separately
      for (const k of Object.keys(updates)) {
        await updateSystemConfig(k, String(updates[k]), env);
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_age_group') {
      // Create new age group
      const { code, label, min_age, max_age, session_day, session_time, capacity } = body;

      if (!code || !label || min_age === undefined || !session_day || !session_time) {
        return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const newAgeGroup = await createAgeGroup(
        {
          code,
          label,
          min_age,
          max_age: max_age || null,
          session_day,
          session_time,
          capacity: capacity || 2,
          active: true,
        },
        env
      );

      return new Response(JSON.stringify({ ok: true, ageGroup: newAgeGroup }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update_age_group') {
      // Update existing age group
      const { id, code, label, min_age, max_age, session_day, session_time, capacity, active } =
        body;

      if (!id) {
        return new Response(JSON.stringify({ ok: false, error: 'Age group ID required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      let updates = {};
      if (code !== undefined) updates.code = code;
      if (label !== undefined) updates.label = label;
      if (min_age !== undefined) updates.min_age = min_age;
      if (max_age !== undefined) updates.max_age = max_age;
      if (session_day !== undefined) updates.session_day = session_day;
      if (session_time !== undefined) updates.session_time = session_time;
      if (capacity !== undefined) updates.capacity = capacity;
      if (active !== undefined) updates.active = active;

      await updateAgeGroup(id, updates, env);

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Unknown action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Config POST error', err && err.stack ? err.stack : err);
    // Surface error details for local dev when using dev token to aid debugging
    const urlDbg = new URL(request.url);
    const requestToken = request.headers.get('x-admin-token') || urlDbg.searchParams.get('token');
    if (requestToken === 'dev') {
      return new Response(JSON.stringify({ ok: false, error: String(err && err.message ? err.message : 'Server error') }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
