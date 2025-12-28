import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client. Use the service_role key stored in env vars ONLY on server.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

export const supabaseAdmin: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

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
  const { data, error } = await supabaseAdmin.from<Enquiry>('enquiries').insert([{ ...payload }]).select().single();
  if (error) throw error;
  return data as Enquiry;
}

export async function createInviteForEnquiry(enquiry_id: string) {
  const token = generateToken(24);
  const { data, error } = await supabaseAdmin.from<Invite>('invites').insert([{ token, enquiry_id }]).select().single();
  if (error) throw error;
  return data as Invite;
}

export async function getInviteByToken(token: string) {
  const { data, error } = await supabaseAdmin.from<Invite>('invites').select('*').eq('token', token).maybeSingle();
  if (error) throw error;
  return data as Invite | null;
}

export async function markInviteSent(invite_id: string) {
  const { data, error } = await supabaseAdmin.from<Invite>('invites').update({ status: 'sent', sent_at: new Date() }).eq('id', invite_id).select().single();
  if (error) throw error;
  return data as Invite;
}

export async function markInviteAccepted(invite_id: string) {
  const { data, error } = await supabaseAdmin.from<Invite>('invites').update({ status: 'accepted', accepted_at: new Date() }).eq('id', invite_id).select().single();
  if (error) throw error;
  return data as Invite;
}

export async function createMemberFromEnquiry(enquiry: Enquiry) {
  const memberPayload = {
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    source: enquiry.source,
  };
  const { data, error } = await supabaseAdmin.from('members').insert([memberPayload]).select().single();
  if (error) throw error;
  return data;
}

export default supabaseAdmin;
