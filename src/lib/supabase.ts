import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazily create a server-side Supabase client. This avoids throwing during import time (e.g. when env vars are not present in local builds).
let _supabaseAdmin: SupabaseClient | null = null;
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  }
  _supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _supabaseAdmin;
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

export async function insertEnquiry(payload: Enquiry) {
  const client = getSupabaseAdmin();
  const { data, error } = await client.from('enquiries').insert([{ ...payload }]).select().single();
  if (error) throw error;
  return data as Enquiry;
}

export async function createInviteForEnquiry(enquiry_id: string) {
  const client = getSupabaseAdmin();
  const token = generateToken(24);
  const { data, error } = await client.from('invites').insert([{ token, enquiry_id }]).select().single();
  if (error) throw error;
  return data as Invite;
}

export async function appendEnquiryEvent(enquiry_id: string, event: any) {
  const client = getSupabaseAdmin();
  // read current events, append and update
  const { data: current, error: fetchErr } = await client.from('enquiries').select('events').eq('id', enquiry_id).maybeSingle();
  if (fetchErr) throw fetchErr;
  const events = (current && current.events) ? current.events : [];
  events.push(event);
  const { data, error } = await client.from('enquiries').update({ events }).eq('id', enquiry_id).select().single();
  if (error) throw error;
  return data;
}
export async function getInviteByToken(token: string) {
  const client = getSupabaseAdmin();
  const { data, error } = await client.from('invites').select('*').eq('token', token).maybeSingle();
  if (error) throw error;
  return data as Invite | null;
}

export async function getLatestInviteForEnquiry(enquiry_id: string) {
  const client = getSupabaseAdmin();
  const { data, error } = await client.from('invites').select('*').eq('enquiry_id', enquiry_id).order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return data as Invite | null;
}

export async function markEnquiryPresliConfirmed(enquiry_id: string, note?: string) {
  const client = getSupabaseAdmin();
  const payload: any = { presli_confirmed_at: new Date().toISOString() };
  if (note !== undefined) payload.presli_note = note;
  const { data, error } = await client.from('enquiries').update(payload).eq('id', enquiry_id).select().single();
  if (error) throw error;
  return data;
}

export async function markInviteSent(invite_id: string) {
  const client = getSupabaseAdmin();
  const { data, error } = await client
    .from('invites')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', invite_id)
    .select()
    .single();
  if (error) throw error;
  return data as Invite;
}

export async function markInviteAccepted(invite_id: string) {
  const client = getSupabaseAdmin();
  const { data, error } = await client
    .from('invites')
    .update({ status: 'accepted', accepted_at: new Date().toISOString() })
    .eq('id', invite_id)
    .select()
    .single();
  if (error) throw error;
  return data as Invite;
}

export async function createMemberFromEnquiry(enquiry: Enquiry) {
  const client = getSupabaseAdmin();
  const memberPayload = {
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    source: enquiry.source,
  };
  const { data, error } = await client.from('members').insert([memberPayload]).select().single();
  if (error) throw error;
  return data;
}

// Bookings helpers
export async function countBookingsForDateSlot(session_date: string, slot: string) {
  const client = getSupabaseAdmin();
  const { count, error } = await client.from('bookings').select('id', { count: 'exact', head: true }).eq('session_date', session_date).eq('slot', slot);
  if (error) throw error;
  return count || 0;
}

export async function createBooking(enquiry_id: string, invite_id: string, session_date: string, slot: string, session_time: string) {
  const client = getSupabaseAdmin();
  const payload = { enquiry_id, invite_id, session_date, slot, session_time };
  const { data, error } = await client.from('bookings').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function getBookingByInvite(invite_id: string) {
  const client = getSupabaseAdmin();
  const { data, error } = await client.from('bookings').select('*').eq('invite_id', invite_id).maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function getBookingById(booking_id: string) {
  const client = getSupabaseAdmin();
  const { data, error } = await client.from('bookings').select('*, enquiry:enquiries(*)').eq('id', booking_id).maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function updateBookingStatus(booking_id: string, status: string, note?: string) {
  const client = getSupabaseAdmin();
  const payload: any = { status };
  if (note !== undefined) payload.attendance_note = note;
  const { data, error } = await client.from('bookings').update(payload).eq('id', booking_id).select().single();
  if (error) throw error;
  return data;
}

export async function cancelBooking(booking_id: string) {
  const client = getSupabaseAdmin();
  const { data, error } = await client.from('bookings').update({ status: 'cancelled' }).eq('id', booking_id).select().single();
  if (error) throw error;
  return data;
}

export {
  getBookingByInvite,
  getInviteByToken,
  cancelBooking,
  appendEnquiryEvent
};
export default getSupabaseAdmin;
