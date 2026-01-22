import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';


vi.mock('../../lib/supabase', () => ({
  getInviteByToken: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  countBookingsForDateSlot: vi.fn(),
  createBooking: vi.fn(),
  appendEnquiryEvent: vi.fn(),
  markInviteAccepted: vi.fn(),
  getBookingByInvite: vi.fn(),
}));

vi.mock('../../lib/notifications', () => ({
  sendBookingConfirmationNotification: vi.fn(async () => ({ ok: true }))
}));

describe('Booking API - invite status handling', () => {
  let POST;
  const mockDate = '2026-01-27';

  beforeEach(async () => {
    // Reset modules and get a fresh import of the booking endpoint
    vi.resetModules();
    ({ POST } = await import('../../pages/api/booking.json.js'));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("allows booking when invite status is 'sent'", async () => {
    const supabase = await import('../../lib/supabase');
    const notifications = await import('../../lib/notifications');

    // Arrange: invite exists and has status 'sent'
    supabase.getInviteByToken.mockResolvedValue({ id: 'inv-1', token: 'tok-1', enquiry_id: 'enq-1', status: 'sent' });
    // Return a client-like object with chained query helpers used in the endpoint
    supabase.getSupabaseAdmin.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: { id: 'enq-1', dob: '2006-01-01', email: 'test@example.com' } })
          })
        })
      })
    });
    supabase.getBookingByInvite.mockResolvedValue(null);
    supabase.countBookingsForDateSlot.mockResolvedValue(0);
    supabase.createBooking.mockResolvedValue({ id: 'b1', session_date: mockDate, slot: 'u15plus' });
    supabase.appendEnquiryEvent.mockResolvedValue({});
    supabase.markInviteAccepted.mockResolvedValue({});

    // Act: call POST
    const fakeReq = { json: async () => ({ invite: 'tok-1', session_date: mockDate }), url: 'http://localhost' };
    const res = await POST({ request: fakeReq, locals: {} });
    const text = await res.text();
    const body = JSON.parse(text);

    // Assert
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.booking).toBeDefined();
    expect(supabase.createBooking).toHaveBeenCalled();
    expect(supabase.markInviteAccepted).toHaveBeenCalledWith('inv-1', expect.anything());
    expect(notifications.sendBookingConfirmationNotification).toHaveBeenCalledWith({ enquiryId: 'enq-1', bookingId: expect.any(String), to: 'test@example.com', date: mockDate, slotLabel: expect.any(String), env: expect.any(Object) });
  });
});
