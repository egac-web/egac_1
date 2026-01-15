import { appendEnquiryEvent, markInviteSent } from './supabase';
import { sendInviteEmail, sendBookingConfirmation } from './resend';

export type NotifyResult = {
  ok: boolean;
  dryRun?: boolean;
  resendId?: string | null;
  error?: any;
};

function nowISO() {
  return new Date().toISOString();
}

export async function sendInviteNotification({ enquiryId, inviteId, to, inviteUrl, env }: { enquiryId: string; inviteId: string; to: string; inviteUrl: string; env?: any }): Promise<NotifyResult> {
  const dry = !!env?.RESEND_DRY_RUN;
  if (!env?.RESEND_API_KEY || !env?.RESEND_FROM) {
    // append a failed-send event so it's visible in the DB
    try {
      await appendEnquiryEvent(enquiryId, { type: 'invite_send_failed', invite_id: inviteId, error: 'Resend not configured', at: nowISO() }, env);
    } catch (e) { console.error('Failed to append invite_send_failed', e); }
    return { ok: false, error: 'no_resend_config' };
  }

  // Build message
  const baseSubject = 'EGAC: Book a taster / session';
  const html = `<p>Hello,</p><p>Thanks for your enquiry. To book a free taster, please follow this link:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p><p>If you did not request this, ignore this email.</p>`;
  const text = `Book here: ${inviteUrl}`;

  // Handle staging interception
  const appEnv = env?.APP_ENV || process.env.APP_ENV || 'production';
  let effectiveTo = to;
  let effectiveSubject = baseSubject;
  const stagingAllowed = (env?.STAGING_ALLOWED_EMAILS || process.env.STAGING_ALLOWED_EMAILS || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);
  const stagingRedirect = (env?.STAGING_REDIRECT_EMAILS || process.env.STAGING_REDIRECT_EMAILS || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  if (appEnv === 'staging') {
    // If original recipient not whitelisted, redirect to staging mailbox/es
    const isAllowed = stagingAllowed.length === 0 || stagingAllowed.includes(to);
    if (!isAllowed) {
      if (stagingRedirect.length > 0) {
        effectiveTo = stagingRedirect.join(',');
      } else if (env?.MEMBERSHIP_SECRETARY_EMAIL) {
        effectiveTo = env.MEMBERSHIP_SECRETARY_EMAIL;
      }
      // Prefix subject and append original recipient info
      effectiveSubject = `[STAGING] ${baseSubject} (original: ${to})`;
      try { await appendEnquiryEvent(enquiryId, { type: 'staging_email_redirected', invite_id: inviteId, original_to: to, redirected_to: effectiveTo, at: nowISO() }, env); } catch (e) { console.error('Failed to append staging_email_redirected', e); }
    } else {
      // add [STAGING] to subject to make it obvious
      effectiveSubject = `[STAGING] ${baseSubject}`;
    }
  }

  if (dry) {
    try {
      await appendEnquiryEvent(enquiryId, { type: 'invite_send_dry_run', invite_id: inviteId, to: effectiveTo, at: nowISO(), meta: { inviteUrl } }, env);
    } catch (e) { console.error('Failed to append invite_send_dry_run', e); }
    return { ok: true, dryRun: true };
  }

  try {
    const res = await sendInviteEmail({ apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM, to: effectiveTo, subject: effectiveSubject, html, text });
    try {
      await appendEnquiryEvent(enquiryId, { type: 'invite_sent', invite_id: inviteId, resend_id: res.id, at: nowISO(), meta: res.raw }, env);
    } catch (e) { console.error('Failed to append enquiry event after invite_sent', e); }
    try { await markInviteSent(inviteId, env); } catch (e) { console.error('Failed to mark invite sent', e); }
    return { ok: true, resendId: res.id };
  } catch (err) {
    console.error('sendInviteEmail failed', err);
    try {
      await appendEnquiryEvent(enquiryId, { type: 'invite_send_failed', invite_id: inviteId, error: (err && err.response) ? err.response : String(err), at: nowISO() }, env);
    } catch (e) { console.error('Failed to append enquiry event for failed send', e); }
    try {
      const { markInviteSendFailed } = await import('./supabase');
      await markInviteSendFailed(inviteId, (err && err.response) ? JSON.stringify(err.response) : String(err), env);
    } catch (e) { console.error('Failed to mark invite send failed', e); }
    return { ok: false, error: err };
  }
}

export async function sendBookingConfirmationNotification({ enquiryId, bookingId, to, date, slotLabel, env }: { enquiryId: string; bookingId: string; to: string; date: string; slotLabel: string; env?: any }): Promise<NotifyResult> {
  const dry = !!env?.RESEND_DRY_RUN;
  if (!env?.RESEND_API_KEY || !env?.RESEND_FROM) {
    try { await appendEnquiryEvent(enquiryId, { type: 'booking_confirm_email_failed', booking_id: bookingId, error: 'Resend not configured', at: nowISO() }, env); } catch (e) { console.error('Failed to append booking_confirm_email_failed', e); }
    return { ok: false, error: 'no_resend_config' };
  }

  // Handle staging interception
  const appEnv = env?.APP_ENV || process.env.APP_ENV || 'production';
  let effectiveTo = to;
  let effectiveSubjectPrefix = '';
  const stagingAllowed = (env?.STAGING_ALLOWED_EMAILS || process.env.STAGING_ALLOWED_EMAILS || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);
  const stagingRedirect = (env?.STAGING_REDIRECT_EMAILS || process.env.STAGING_REDIRECT_EMAILS || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  if (appEnv === 'staging') {
    const isAllowed = stagingAllowed.length === 0 || stagingAllowed.includes(to);
    if (!isAllowed) {
      if (stagingRedirect.length > 0) {
        effectiveTo = stagingRedirect.join(',');
      } else if (env?.MEMBERSHIP_SECRETARY_EMAIL) {
        effectiveTo = env.MEMBERSHIP_SECRETARY_EMAIL;
      }
      effectiveSubjectPrefix = '[STAGING] (original: ' + to + ') ';
      try { await appendEnquiryEvent(enquiryId, { type: 'staging_email_redirected', booking_id: bookingId, original_to: to, redirected_to: effectiveTo, at: nowISO() }, env); } catch (e) { console.error('Failed to append staging_email_redirected', e); }
    } else {
      effectiveSubjectPrefix = '[STAGING] ';
    }
  }

  if (dry) {
    try { await appendEnquiryEvent(enquiryId, { type: 'booking_confirm_email_dry_run', booking_id: bookingId, to: effectiveTo, at: nowISO() }, env); } catch (e) { console.error('Failed to append booking_confirm_email_dry_run', e); }
    return { ok: true, dryRun: true };
  }

  try {
    const res = await sendBookingConfirmation({ apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM, to: effectiveTo, date, slotLabel });
    try { await appendEnquiryEvent(enquiryId, { type: 'booking_confirm_email_sent', booking_id: bookingId, resend_id: res.id, at: nowISO(), meta: res.raw }, env); } catch (e) { console.error('Failed to append booking_confirm_email_sent event', e); }
    return { ok: true, resendId: res.id };
  } catch (err) {
    console.error('sendBookingConfirmation failed', err);
    try { await appendEnquiryEvent(enquiryId, { type: 'booking_confirm_email_failed', booking_id: bookingId, error: (err && err.response) ? err.response : String(err), at: nowISO() }, env); } catch (e) { console.error('Failed to append booking_confirm_email_failed event', e); }
    return { ok: false, error: err };
  }
}
