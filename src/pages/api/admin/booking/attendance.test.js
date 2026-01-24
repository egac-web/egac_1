import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock locally imported helpers and notifications where appropriate
vi.mock('../../../../lib/supabase', () => ({
  appendEnquiryEvent: vi.fn(),
  createInviteForEnquiry: vi.fn(),
  updateBookingStatus: vi.fn(),
  getBookingById: vi.fn(),
}));
vi.mock('../../../../lib/notifications', () => ({
  sendInviteNotification: vi.fn(),
}));

import { appendEnquiryEvent, createInviteForEnquiry, updateBookingStatus, getBookingById } from '../../../../lib/supabase';
import { sendInviteNotification } from '../../../../lib/notifications';
import { POST } from './attendance.json.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Admin booking attendance endpoint', () => {
  it('marks attended and sends membership link when requested', async () => {
    const booking = { id: 'b1', enquiry_id: 'e1', slot: 'u15plus', session_date: '2026-02-10', status: 'confirmed', enquiry: { id: 'e1', name: 'Test', email: 'test@example.com', phone: '077' } };
    getBookingById.mockResolvedValue(booking);
    updateBookingStatus.mockResolvedValue({ ...booking, status: 'attended' });
    createInviteForEnquiry.mockResolvedValue({ id: 'i1', token: 'tok' });
    sendInviteNotification.mockResolvedValue({ ok: true });
    appendEnquiryEvent.mockResolvedValue({});

    const req = new Request('http://localhost/api/admin/booking/attendance.json?token=dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: 'b1', status: 'attended', note: 'Test', send_membership_link: true }),
    });

    const res = await POST({ request: req, locals: { runtime: { env: {} } } });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(updateBookingStatus).toHaveBeenCalledWith('b1', 'attended', 'Test', {});
    expect(createInviteForEnquiry).toHaveBeenCalledWith('e1', {});
    expect(sendInviteNotification).toHaveBeenCalled();
    expect(appendEnquiryEvent).toHaveBeenCalled();
    expect(res.body.membership_sent).toBe(true);
  });

  it('does not send membership link if enquiry is on academy waitlist', async () => {
    const booking = { id: 'b2', enquiry_id: 'e2', slot: 'u15plus', session_date: '2026-02-11', status: 'confirmed', enquiry: { id: 'e2', name: 'Kid', email: 'parent@example.com' } };
    getBookingById.mockResolvedValue(booking);
    updateBookingStatus.mockResolvedValue({ ...booking, status: 'attended' });
    createInviteForEnquiry.mockRejectedValue(new Error('enquiry_on_academy_waitlist'));
    appendEnquiryEvent.mockResolvedValue({});

    const req = new Request('http://localhost/api/admin/booking/attendance.json?token=dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: 'b2', status: 'attended', note: 'Test', send_membership_link: true }),
    });

    const res = await POST({ request: req, locals: { runtime: { env: {} } } });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(updateBookingStatus).toHaveBeenCalledWith('b2', 'attended', 'Test', {});
    expect(createInviteForEnquiry).toHaveBeenCalledWith('e2', {});
    expect(res.body.membership_sent).toBe(false);
    expect(res.body.warning).toMatch(/waiting list|Academy/i);
  });

  it('marks no_show and does not attempt to send membership link', async () => {
    const booking = { id: 'b3', enquiry_id: 'e3', slot: 'u15plus', session_date: '2026-02-12', status: 'confirmed', enquiry: { id: 'e3', name: 'NoShow', email: 'no@example.com' } };
    getBookingById.mockResolvedValue(booking);
    updateBookingStatus.mockResolvedValue({ ...booking, status: 'no_show' });
    appendEnquiryEvent.mockResolvedValue({});

    const req = new Request('http://localhost/api/admin/booking/attendance.json?token=dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: 'b3', status: 'no_show', note: 'No show' }),
    });

    const res = await POST({ request: req, locals: { runtime: { env: {} } } });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(updateBookingStatus).toHaveBeenCalledWith('b3', 'no_show', 'No show', {});
    expect(createInviteForEnquiry).not.toHaveBeenCalled();
    expect(appendEnquiryEvent).toHaveBeenCalled();
  });
});