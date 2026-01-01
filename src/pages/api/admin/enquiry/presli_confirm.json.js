import { getSupabaseAdmin, markEnquiryPresliConfirmed, getLatestInviteForEnquiry, createInviteForEnquiry, appendEnquiryEvent, markInviteSent } from '../../../../lib/supabase';
import { sendInviteEmail } from '../../../../lib/resend';

export async function POST({ request }) {
  try {
    const token = request.headers.get('x-admin-token') || '';
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return { status: 401, body: { ok: false, error: 'Unauthorized' } };

    const body = await request.json();
    const { enquiry_id, note, send_membership_link } = body || {};
    if (!enquiry_id) return { status: 400, body: { ok: false, error: 'Missing enquiry_id' } };

    const client = getSupabaseAdmin();
    const { data: enquiry, error: fetchErr } = await client.from('enquiries').select('*').eq('id', enquiry_id).maybeSingle();
    if (fetchErr) return { status: 500, body: { ok: false, error: fetchErr.message } };
    if (!enquiry) return { status: 404, body: { ok: false, error: 'Enquiry not found' } };

    // mark presli confirmed and store note
    const updatedEnquiry = await markEnquiryPresliConfirmed(enquiry_id, note || null);
    const event = { type: 'presli_confirmed', note: note || null, timestamp: new Date().toISOString() };
    await appendEnquiryEvent(enquiry_id, event);

    const response = { ok: true, enquiry: updatedEnquiry, event };

    // Optionally create/send membership link
    if (send_membership_link) {
      try {
        // find existing invite or create
        let invite = await getLatestInviteForEnquiry(enquiry_id);
        if (!invite) invite = await createInviteForEnquiry(enquiry_id);

        const membershipUrl = `${process.env.SITE_URL || ''}/membership?token=${invite.token}`;
        if (enquiry.email) {
          const html = `<p>Hello ${enquiry.name || ''},</p><p>Your attendance has been confirmed. To complete your membership, please complete the form: <a href="${membershipUrl}">Complete membership</a></p>`;
          const text = `Complete your membership: ${membershipUrl}`;
          await sendInviteEmail({ apiKey: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM, to: enquiry.email, subject: 'EGAC: Complete your membership', html, text });
          await markInviteSent(invite.id);
          const ev = { type: 'membership_link_sent', invite_id: invite.id, to: enquiry.email, timestamp: new Date().toISOString() };
          await appendEnquiryEvent(enquiry_id, ev);
          response.membership_sent = true;
        } else {
          response.membership_sent = false;
          response.warning = 'No email found for enquiry';
        }
      } catch (err) {
        console.error('Presli confirm membership send error', err);
        response.membership_error = err.message || String(err);
      }
    }

    return { status: 200, body: response };
  } catch (err) {
    console.error('Presli confirm error', err);
    return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}