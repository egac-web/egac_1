globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as getBookingById, d as updateBookingStatus, e as createInviteForEnquiry, f as appendEnquiryEvent } from '../../../../chunks/supabase_DDVehETI.mjs';
import { sendInviteNotification } from '../../../../chunks/notifications_Dpwd-lBy.mjs';
import { P as POST } from '../../../../chunks/attendance.json_DNAWQ2qq.mjs';
import { v as vi, b as beforeEach, d as describe, i as it, g as globalExpect } from '../../../../chunks/vi.2VT5v0um_BqJ87Wy1.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_CjgTivB9.mjs';

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
    globalExpect(res.status).toBe(200);
    globalExpect(res.body.ok).toBe(true);
    globalExpect(updateBookingStatus).toHaveBeenCalledWith('b1', 'attended', 'Test', {});
    globalExpect(createInviteForEnquiry).toHaveBeenCalledWith('e1', {});
    globalExpect(sendInviteNotification).toHaveBeenCalled();
    globalExpect(appendEnquiryEvent).toHaveBeenCalled();
    globalExpect(res.body.membership_sent).toBe(true);
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
    globalExpect(res.status).toBe(200);
    globalExpect(res.body.ok).toBe(true);
    globalExpect(updateBookingStatus).toHaveBeenCalledWith('b2', 'attended', 'Test', {});
    globalExpect(createInviteForEnquiry).toHaveBeenCalledWith('e2', {});
    globalExpect(res.body.membership_sent).toBe(false);
    globalExpect(res.body.warning).toMatch(/waiting list|Academy/i);
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
    globalExpect(res.status).toBe(200);
    globalExpect(res.body.ok).toBe(true);
    globalExpect(updateBookingStatus).toHaveBeenCalledWith('b3', 'no_show', 'No show', {});
    globalExpect(createInviteForEnquiry).not.toHaveBeenCalled();
    globalExpect(appendEnquiryEvent).toHaveBeenCalled();
  });
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
