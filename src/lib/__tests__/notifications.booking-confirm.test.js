import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../supabase', () => ({
  getEmailTemplate: vi.fn(),
  appendEnquiryEvent: vi.fn(),
}));

vi.mock('../mjmlRenderer', () => ({
  renderMjmlTemplate: vi.fn(),
}));

vi.mock('../resend', () => ({
  sendInviteEmail: vi.fn(),
}));

import { sendBookingConfirmationNotification } from '../notifications';
import { getEmailTemplate, appendEnquiryEvent } from '../supabase';
import { renderMjmlTemplate } from '../mjmlRenderer';
import { sendInviteEmail } from '../resend';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('sendBookingConfirmationNotification', () => {
  it('prefers MJML rendered HTML when available and appends template_key', async () => {
    const env = { RESEND_API_KEY: 'abc', RESEND_FROM: 'no-reply@example.com', SITE_NAME: 'EGAC' };
    renderMjmlTemplate.mockReturnValue('<div>MJML HTML</div>');
    getEmailTemplate.mockResolvedValue({ html: '<p>tpl</p>', text: 'tpl text', subject: 'Booked' });
    sendInviteEmail.mockResolvedValue({ id: 'resend-1', raw: {} });

    const res = await sendBookingConfirmationNotification({ enquiryId: 'e1', bookingId: 'b1', to: 'parent@example.com', date: '2026-03-15', slotLabel: 'U13', env });
    expect(res.ok).toBe(true);
    expect(sendInviteEmail).toHaveBeenCalled();
    const args = sendInviteEmail.mock.calls[0][0];
    expect(args.html).toBe('<div>MJML HTML</div>');
    expect(appendEnquiryEvent).toHaveBeenCalled();
    const appended = appendEnquiryEvent.mock.calls[0][1];
    expect(appended.type).toBe('booking_confirm_email_sent');
    expect(appended.template_key).toBe('booking_confirmation');
  });

  it('falls back to DB template when MJML not available and appends template_key', async () => {
    const env = { RESEND_API_KEY: 'abc', RESEND_FROM: 'no-reply@example.com', SITE_NAME: 'EGAC' };
    // MJML renderer returns empty
    renderMjmlTemplate.mockReturnValue('');
    getEmailTemplate.mockResolvedValue({ html: '<p>Your booking for {{date}} ({{slotLabel}})</p>', text: 'Your booking for {{date}} ({{slotLabel}})', subject: 'Booked' });
    sendInviteEmail.mockResolvedValue({ id: 'resend-2', raw: {} });

    const res = await sendBookingConfirmationNotification({ enquiryId: 'e2', bookingId: 'b2', to: 'parent@example.com', date: '2026-04-01', slotLabel: 'Sunday U13', env });
    expect(res.ok).toBe(true);
    expect(sendInviteEmail).toHaveBeenCalled();
    const args = sendInviteEmail.mock.calls[0][0];
    expect(args.html).toContain('Your booking for 2026-04-01 (Sunday U13)');
    expect(appendEnquiryEvent).toHaveBeenCalled();
    const appended = appendEnquiryEvent.mock.calls[0][1];
    expect(appended.type).toBe('booking_confirm_email_sent');
    expect(appended.template_key).toBe('booking_confirmation');
  });
});
