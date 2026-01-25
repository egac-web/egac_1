import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create a server-side Supabase client with runtime env vars from Cloudflare Pages
// In Cloudflare Pages, env vars are accessed via context.locals.runtime.env, not process.env
export function getSupabaseAdmin(env?: any): SupabaseClient {
  // Use runtime env if provided (Cloudflare Pages), otherwise fall back to process.env (local dev)
  const runtimeEnv = env || process.env;
  const SUPABASE_URL = runtimeEnv.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = runtimeEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type Enquiry = {
  id?: string;
  created_at?: string;
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  training_days?: any;
  dob?: string | null;
  source?: string;
  processed?: boolean;
  note?: string;
  raw_payload?: any;
};

export type Invite = {
  id?: string;
  token?: string;
  enquiry_id?: string;
  created_at?: string;
  sent_at?: string | null;
  accepted_at?: string | null;
  status?: string;
};

function generateToken(length = 24) {
  // fallback token generator (hex-based): fine for small scale invites
  return Array.from(crypto.getRandomValues(new Uint8Array(Math.ceil(length / 2))))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

export async function insertEnquiry(payload: Enquiry, env?: any) {
  const client = getSupabaseAdmin(env);
  const environment = env?.APP_ENV || process.env.APP_ENV || 'production';
  const { data, error } = await client.from('enquiries').insert([{ ...payload, environment }]).select().single();
  if (error) throw error;
  return data as Enquiry;
}

export async function createInviteForEnquiry(enquiry_id: string, env?: any) {
  const client = getSupabaseAdmin(env);
  // Do not allow creating a booking invite for enquiries already on the Academy waiting list
  const { data: academyInv, error: acadErr } = await client.from('academy_invitations').select('*').eq('enquiry_id', enquiry_id).maybeSingle();
  if (acadErr) throw acadErr;
  if (academyInv) {
    throw new Error('enquiry_on_academy_waitlist');
  }

  const token = generateToken(24);
  const environment = env?.APP_ENV || process.env.APP_ENV || 'production';
  const payload = { token, enquiry_id, status: 'pending', send_attempts: 0, last_send_error: null, environment };
  const { data, error } = await client.from('invites').insert([payload]).select().single();
  if (error) throw error;
  return data as Invite;
}

export async function markInviteSendFailed(invite_id: string, errorMsg: string, env?: any) {
  const client = getSupabaseAdmin(env);
  // increment attempts and set status to failed
  const { data: existing, error: fetchErr } = await client.from('invites').select('send_attempts').eq('id', invite_id).maybeSingle();
  if (fetchErr) throw fetchErr;
  const attempts = (existing && typeof existing.send_attempts === 'number') ? existing.send_attempts + 1 : 1;
  const payload: any = { send_attempts: attempts, last_send_error: errorMsg, status: 'failed' };
  const { data, error } = await client.from('invites').update(payload).eq('id', invite_id).select().single();
  if (error) throw error;
  return data as Invite;
}

export async function appendEnquiryEvent(enquiry_id: string, event: any, env?: any) {
  const client = getSupabaseAdmin(env);
  // read current events, append and update
  const { data: current, error: fetchErr } = await client.from('enquiries').select('events').eq('id', enquiry_id).maybeSingle();
  if (fetchErr) throw fetchErr;
  const events = (current && current.events) ? current.events : [];
  events.push(event);
  const { data, error } = await client.from('enquiries').update({ events }).eq('id', enquiry_id).select().single();
  if (error) throw error;
  return data;
}
export async function getInviteByToken(token: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('invites').select('*').eq('token', token).maybeSingle();
  if (error) throw error;
  return data as Invite | null;
}

export async function getLatestInviteForEnquiry(enquiry_id: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('invites').select('*').eq('enquiry_id', enquiry_id).order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return data as Invite | null;
}

export async function markEnquiryPresliConfirmed(enquiry_id: string, note?: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const payload: any = { presli_confirmed_at: new Date().toISOString() };
  if (note !== undefined) payload.presli_note = note;
  const { data, error } = await client.from('enquiries').update(payload).eq('id', enquiry_id).select().single();
  if (error) throw error;
  return data;
}

export async function markInviteSent(invite_id: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client
    .from('invites')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', invite_id)
    .select()
    .single();
  if (error) throw error;
  return data as Invite;
}

export async function markInviteAccepted(invite_id: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client
    .from('invites')
    .update({ status: 'accepted', accepted_at: new Date().toISOString() })
    .eq('id', invite_id)
    .select()
    .single();
  if (error) throw error;
  return data as Invite;
}

export async function createMemberFromEnquiry(enquiry: Enquiry, env?: any) {
  const client = getSupabaseAdmin(env);
  const additional: any = {};
  if ((enquiry as any).medication) additional.medication = (enquiry as any).medication;
  if ((enquiry as any).illnesses) additional.illnesses = (enquiry as any).illnesses;
  if ((enquiry as any).allergies) additional.allergies = (enquiry as any).allergies;
  if ((enquiry as any).emergency_contact) additional.emergency_contact = (enquiry as any).emergency_contact;

  const memberPayload = {
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    source: enquiry.source,
    dob: enquiry.dob || null,
    address: enquiry.address || null,
    postcode: enquiry.postcode || null,
    enquiry_id: enquiry.id || null,
    additional: Object.keys(additional).length ? additional : null,
  };
  const { data, error } = await client.from('members').insert([memberPayload]).select().single();
  if (error) throw error;
  return data;
}

export async function getRecentMembers(limit = 100, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('members').select('*').order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data || [];
}

// Membership OTP helpers
export async function createMembershipOtp(invite_id: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const code = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
  const expiresAt = new Date(Date.now() + (15 * 60 * 1000)).toISOString(); // 15 minutes
  const payload = { invite_id, code, expires_at: expiresAt };
  const { data, error } = await client.from('membership_otps').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function verifyMembershipOtp(invite_id: string, code: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('membership_otps').select('*').eq('invite_id', invite_id).eq('code', code).eq('used', false).order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return { ok: false, reason: 'not_found' };
  if (new Date(data.expires_at) < new Date()) return { ok: false, reason: 'expired' };
  const { data: upd, error: updErr } = await client.from('membership_otps').update({ used: true }).eq('id', data.id).select().single();
  if (updErr) throw updErr;
  return { ok: true, row: upd };
}

// Bookings helpers
export async function countBookingsForDateSlot(session_date: string, slot: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { count, error } = await client.from('bookings').select('id', { count: 'exact', head: true }).eq('session_date', session_date).eq('slot', slot);
  if (error) throw error;
  return count || 0;
}

export async function createBooking(enquiry_id: string, invite_id: string, session_date: string, slot: string, session_time: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const environment = env?.APP_ENV || process.env.APP_ENV || 'production';
  const payload = { enquiry_id, invite_id, session_date, slot, session_time, environment };
  const { data, error } = await client.from('bookings').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function getBookingByInvite(invite_id: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('bookings').select('*').eq('invite_id', invite_id).maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function getBookingById(booking_id: string, env?: any) {
  const client = getSupabaseAdmin(env);

  // Try DB RPC first (robust single-statement join)
  try {
    const { data, error } = await client.rpc('get_booking_with_enquiry', { bid: booking_id });
    if (!error && data) {
      // RPC may return an array of rows or a single row
      const booking = Array.isArray(data) ? data[0] : data;
      if (booking) return booking;
    }
  } catch (e) {
    // RPC failed or not available; fall back to explicit fetch
    console.warn('RPC get_booking_with_enquiry failed, falling back to sequential fetch', e?.message || e);
  }

  // Fallback: fetch booking then enquiry separately
  const { data: booking, error } = await client.from('bookings').select('*').eq('id', booking_id).maybeSingle();
  if (error) throw error;
  if (!booking) return null;
  // Load related enquiry explicitly to avoid ambiguous relationship embedding
  try {
    const { data: enquiry, error: enqErr } = await client.from('enquiries').select('*').eq('id', booking.enquiry_id).maybeSingle();
    if (enqErr) throw enqErr;
    booking.enquiry = enquiry || null;
  } catch (e) {
    // any error fetching enquiry should be surfaced
    throw e;
  }
  return booking;
}

export async function updateBookingStatus(booking_id: string, status: string, note?: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const payload: any = { status };
  if (note !== undefined) payload.attendance_note = note;
  const { data, error } = await client.from('bookings').update(payload).eq('id', booking_id).select().single();
  if (error) throw error;
  return data;
}

export async function cancelBooking(booking_id: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('bookings').update({ status: 'cancelled' }).eq('id', booking_id).select().single();
  if (error) throw error;
  return data;
}

// Email templates helpers
export async function getEmailTemplate(key: string, language = 'en', env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('email_templates').select('*').eq('key', key).eq('language', language).maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function listEmailTemplates(env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('email_templates').select('*').order('key', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createEmailTemplate(payload: any, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('email_templates').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateEmailTemplate(id: string, updates: any, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('email_templates').update({ ...updates, updated_at: (new Date()).toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Additional admin helpers
export async function getActiveAgeGroups(env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('age_groups').select('*').eq('active', true).order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getSystemConfigAll(env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('system_config').select('*');
  if (error) throw error;
  const map: any = {};
  (data || []).forEach((r: any) => {
    map[r.key] = r.value;
  });
  return map;
}

export async function updateSystemConfig(key: string, value: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('system_config').upsert({ key, value, updated_at: (new Date()).toISOString() }).select().single();
  if (error) throw error;
  return data;
}

export async function createAgeGroup(payload: any, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('age_groups').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateAgeGroup(id: string, updates: any, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('age_groups').update({ ...updates, updated_at: (new Date()).toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Academy invitations helpers
export async function createAcademyInvitation(enquiry_id: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const token = generateToken(24);
  const environment = env?.APP_ENV || process.env.APP_ENV || 'production';
  const payload: any = {
    token,
    enquiry_id,
    status: 'pending',
    sent_at: null,
    response: null,
    response_at: null,
    environment,
    created_at: new Date().toISOString(),
  };
  const { data, error } = await client.from('academy_invitations').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function markAcademyInvitationSent(invitation_id: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('academy_invitations').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', invitation_id).select().single();
  if (error) throw error;
  return data;
}

export async function getAcademyInvitationByToken(token: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const { data, error } = await client.from('academy_invitations').select('*').eq('token', token).maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function updateAcademyInvitationResponse(token: string, response: string, env?: any) {
  const client = getSupabaseAdmin(env);
  const payload: any = { response, response_at: new Date().toISOString(), status: 'responded' };
  const { data, error } = await client.from('academy_invitations').update(payload).eq('token', token).select().single();
  if (error) throw error;
  return data;
}

// Named exports already provided above; do not re-export here.
export default getSupabaseAdmin;
