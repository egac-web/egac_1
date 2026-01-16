import { appendEnquiryEvent, markInviteSent, getEmailTemplate } from './supabase';
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

export async function sendReminderNotification({ enquiryId, to, date, slotLabel, env }: { enquiryId: string; to: string; date: string; slotLabel: string; env?: any }): Promise<NotifyResult> {
  const dry = !!env?.RESEND_DRY_RUN;
  if (!env?.RESEND_API_KEY || !env?.RESEND_FROM) {
    try { await appendEnquiryEvent(enquiryId, { type: 'reminder_email_failed', date, slotLabel, error: 'Resend not configured', at: nowISO() }, env); } catch (e) { console.error('Failed to append reminder_email_failed', e); }
    return { ok: false, error: 'no_resend_config' };
  }

  // Load template
  let subject = `Reminder: your taster session on ${date} (${slotLabel}) is tomorrow`;
  let html = `<p>This is a reminder that your free taster session is scheduled for <strong>${date}</strong> (${slotLabel}) tomorrow.</p>`;
  let text = `Reminder: your taster session on ${date} (${slotLabel}) is tomorrow.`;

  try {
    const tpl = await getEmailTemplate('reminder', 'en', env);
    if (tpl && tpl.body) {
      html = tpl.body.replace(/\{\{date\}\}/g, date).replace(/\{\{slotLabel\}\}/g, slotLabel);
      subject = tpl.subject ? tpl.subject.replace(/\{\{date\}\}/g, date).replace(/\{\{slotLabel\}\}/g, slotLabel) : subject;
      text = tpl.plain || text;
    }
  } catch (e) {
    console.error('Failed to load reminder template', e);
  }

  // Staging interception
  const appEnv = env?.APP_ENV || process.env.APP_ENV || 'production';
  const stagingAllowed = (env?.STAGING_ALLOWED_EMAILS || process.env.STAGING_ALLOWED_EMAILS || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const stagingRedirect = (env?.STAGING_REDIRECT_EMAILS || process.env.STAGING_REDIRECT_EMAILS || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  let effectiveTo = to;
  let effectiveSubject = subject;

  if (appEnv === 'staging') {
    const isAllowed = stagingAllowed.length === 0 || stagingAllowed.includes(to);
    if (!isAllowed) {
      effectiveTo = stagingRedirect.length > 0 ? stagingRedirect.join(',') : (env?.MEMBERSHIP_SECRETARY_EMAIL || to);
      effectiveSubject = `[STAGING] ${subject} (original: ${to})`;
      try { await appendEnquiryEvent(enquiryId, { type: 'staging_email_redirected', original_to: to, redirected_to: effectiveTo, at: nowISO() }, env); } catch (e) { console.error('Failed to append staging_email_redirected for reminder', e); }
    } else {
      effectiveSubject = `[STAGING] ${subject}`;
    }
  }

  if (dry) {
    try { await appendEnquiryEvent(enquiryId, { type: 'reminder_email_dry_run', date, slotLabel, to: effectiveTo, at: nowISO() }, env); } catch (e) { console.error('Failed to append reminder_email_dry_run', e); }
    return { ok: true, dryRun: true };
  }

  try {
    const res = await sendInviteEmail({ apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM, to: effectiveTo, subject: effectiveSubject, html, text });
    try { await appendEnquiryEvent(enquiryId, { type: 'reminder_email_sent', date, slotLabel, resend_id: res.id, at: nowISO(), meta: res.raw }, env); } catch (e) { console.error('Failed to append reminder_email_sent', e); }
    return { ok: true, resendId: res.id };
  } catch (err) {
    console.error('sendReminderNotification failed', err);
    try { await appendEnquiryEvent(enquiryId, { type: 'reminder_email_failed', date, slotLabel, error: (err && err.response) ? err.response : String(err), at: nowISO() }, env); } catch (e) { console.error('Failed to append reminder_email_failed', e); }
    return { ok: false, error: err };
  }
}

export async function sendAcademyInvitation(invitation: any, enquiry: any, env?: any): Promise<{ success: boolean; resendId?: string | null; error?: any }> {
  const dry = !!env?.RESEND_DRY_RUN;
  if (!env?.RESEND_API_KEY || !env?.RESEND_FROM) {
    try { await appendEnquiryEvent(enquiry.id || invitation.enquiry_id, { type: 'academy_invite_failed', invite_id: invitation.id, error: 'Resend not configured', at: nowISO() }, env); } catch (e) { console.error('Failed to append academy_invite_failed', e); }
    return { success: false, error: 'no_resend_config' };
  }

  const siteBase = env?.SITE_BASE_URL || process.env.SITE_BASE_URL || '';
  const yesUrl = `${siteBase}/academy-response?token=${invitation.token}&response=yes`;
  const noUrl = `${siteBase}/academy-response?token=${invitation.token}&response=no`;

  // try to load a template from DB
  let subject = 'EGAC: Academy Invitation';
  let html = `<p>Hello,</p><p>We'd like to invite your child to the EGAC Academy. Please choose:</p><p><a href="${yesUrl}">Yes, I'm interested</a></p><p><a href="${noUrl}">No, thanks</a></p>`;
  let text = `Please respond: ${yesUrl} (yes) or ${noUrl} (no)`;

  try {
    const tpl = await getEmailTemplate('academy_invitation', 'en', env);
    if (tpl && tpl.body) {
      html = tpl.body.replace(/\{\{responseYesUrl\}\}/g, yesUrl).replace(/\{\{responseNoUrl\}\}/g, noUrl).replace(/\{\{childName\}\}/g, enquiry.name || '');
      subject = tpl.subject || subject;
      text = html.replace(/<[^>]+>/g, '');
    }
  } catch (e) {
    console.error('Failed to load academy template', e);
  }

  // Staging interception (reuse logic)
  const appEnv = env?.APP_ENV || process.env.APP_ENV || 'production';
  const stagingAllowed = (env?.STAGING_ALLOWED_EMAILS || process.env.STAGING_ALLOWED_EMAILS || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const stagingRedirect = (env?.STAGING_REDIRECT_EMAILS || process.env.STAGING_REDIRECT_EMAILS || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  let effectiveTo = enquiry.email;
  let effectiveSubject = subject;

  if (appEnv === 'staging') {
    const isAllowed = stagingAllowed.length === 0 || stagingAllowed.includes(enquiry.email);
    if (!isAllowed) {
      effectiveTo = stagingRedirect.length > 0 ? stagingRedirect.join(',') : (env?.MEMBERSHIP_SECRETARY_EMAIL || enquiry.email);
      effectiveSubject = `[STAGING] ${subject} (original: ${enquiry.email})`;
      try { await appendEnquiryEvent(enquiry.id || invitation.enquiry_id, { type: 'staging_email_redirected', invite_id: invitation.id, original_to: enquiry.email, redirected_to: effectiveTo, at: nowISO() }, env); } catch (e) { console.error('Failed to append staging_email_redirected for academy', e); }
    } else {
      effectiveSubject = `[STAGING] ${subject}`;
    }
  }

  if (dry) {
    try { await appendEnquiryEvent(enquiry.id || invitation.enquiry_id, { type: 'academy_invite_dry_run', invite_id: invitation.id, to: effectiveTo, at: nowISO() }, env); } catch (e) { console.error('Failed to append academy_invite_dry_run', e); }
    return { success: true };
  }

  try {
    const res = await sendInviteEmail({ apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM, to: effectiveTo, subject: effectiveSubject, html, text });
    try { await appendEnquiryEvent(enquiry.id || invitation.enquiry_id, { type: 'academy_invite_sent', invite_id: invitation.id, resend_id: res.id, at: nowISO(), meta: res.raw }, env); } catch (e) { console.error('Failed to append academy_invite_sent', e); }
    return { success: true, resendId: res.id };
  } catch (err) {
    console.error('sendAcademyInvitation failed', err);
    try { await appendEnquiryEvent(enquiry.id || invitation.enquiry_id, { type: 'academy_invite_failed', invite_id: invitation.id, error: (err && err.response) ? err.response : String(err), at: nowISO() }, env); } catch (e) { console.error('Failed to append academy_invite_failed', e); }
    return { success: false, error: err };
  }
}