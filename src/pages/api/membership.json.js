import { getSupabaseAdmin, getInviteByToken, createMembershipOtp, verifyMembershipOtp, createMemberFromEnquiry, appendEnquiryEvent, markInviteAccepted } from '../../lib/supabase';
import { sendInviteEmail } from '../../lib/resend';

export async function GET({ request, locals }) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) return new Response(JSON.stringify({ ok: false, error: 'Missing token' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const env = locals?.runtime?.env || process.env;
    const invite = await getInviteByToken(token, env);
    if (!invite) return new Response(JSON.stringify({ ok: false, error: 'Invalid token' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    // fetch enquiry and return prefilled fields
    const client = getSupabaseAdmin(env);
    const { data: enquiry, error } = await client.from('enquiries').select('*').eq('id', invite.enquiry_id).maybeSingle();
    if (error) return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // create an OTP and email it to the enquiry email
    const otp = await createMembershipOtp(invite.id, env);
    try {
      await sendInviteEmail({ apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM, to: enquiry.email, subject: `${env.SITE_NAME || 'EGAC'}: Your membership verification code`, text: `Your verification code is ${otp.code}` });
      try { await appendEnquiryEvent(enquiry.id, { type: 'membership_otp_sent', otp_id: otp.id, to: enquiry.email, at: new Date().toISOString() }, env); } catch (e) { console.error('Failed to append membership_otp_sent', e); }
    } catch (e) {
      console.error('Failed to send membership OTP', e);
    }

    return new Response(JSON.stringify({ ok: true, enquiry, invite_id: invite.id, otp_id: otp.id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/membership error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST({ request, locals }) {
  try {
    const env = locals?.runtime?.env || process.env;
    const body = await request.json();
    const { invite_id, otp_code, form } = body || {};
    if (!invite_id || !otp_code || !form) return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // validate OTP
    const v = await verifyMembershipOtp(invite_id, otp_code, env);
    if (!v.ok) return new Response(JSON.stringify({ ok: false, error: `OTP ${v.reason}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // fetch invite and enquiry
    const client = getSupabaseAdmin(env);
    const { data: invite, error: invErr } = await client.from('invites').select('*').eq('id', invite_id).maybeSingle();
    if (invErr || !invite) return new Response(JSON.stringify({ ok: false, error: 'Invalid invite' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    const { data: enquiry, error: enqErr } = await client.from('enquiries').select('*').eq('id', invite.enquiry_id).maybeSingle();
    if (enqErr || !enquiry) return new Response(JSON.stringify({ ok: false, error: 'Enquiry not found' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // create member record
    const memberData = await createMemberFromEnquiry({ ...enquiry, ...form }, env);

    // mark invite accepted and update enquiry status
    try { await markInviteAccepted(invite_id, env); } catch (e) { console.error('Failed to mark invite accepted', e); }
    try { await appendEnquiryEvent(enquiry.id, { type: 'membership_enrolled', member_id: memberData.id, at: new Date().toISOString() }, env); } catch (e) { console.error('Failed to append membership_enrolled', e); }

    // send confirmation
    try {
      await sendInviteEmail({ apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM, to: enquiry.email, subject: `${env.SITE_NAME || 'EGAC'}: Membership confirmed`, text: `Thank you, ${memberData.name}, your membership is now active.` });
      try { await appendEnquiryEvent(enquiry.id, { type: 'membership_confirmation_sent', member_id: memberData.id, at: new Date().toISOString() }, env); } catch (e) { console.error('Failed to append membership_confirmation_sent', e); }
    } catch (e) {
      console.error('Failed to send membership confirmation', e);
    }

    return new Response(JSON.stringify({ ok: true, member: memberData }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('POST /api/membership error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}