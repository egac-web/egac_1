import {
  getActiveAgeGroups,
  getSystemConfigAll,
  updateSystemConfig,
  createAgeGroup,
  updateAgeGroup,
  getSupabaseAdmin,
} from '../../../lib/supabase';

export const prerender = false;

export async function GET({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const token = request.headers.get('x-admin-token');
    const isDev =
      (env.NODE_ENV === 'development' || env.ENVIRONMENT === 'development') && token === 'dev';

    if (!token || (token !== env.ADMIN_TOKEN && !isDev)) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all age groups (including inactive)
    const client = getSupabaseAdmin(env);
    const { data: ageGroups, error: agError } = await client
      .from('age_groups')
      .select('*')
      .order('sort_order', { ascending: true });

    if (agError) throw agError;

    // Get system configuration
    const systemConfig = await getSystemConfigAll(env);

    return new Response(
      JSON.stringify({ ok: true, ageGroups: ageGroups || [], systemConfig: systemConfig || {} }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Config GET error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const token = request.headers.get('x-admin-token');
    const isDev =
      (env.NODE_ENV === 'development' || env.ENVIRONMENT === 'development') && token === 'dev';

    if (!token || (token !== env.ADMIN_TOKEN && !isDev)) {
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
    console.error('Config POST error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
