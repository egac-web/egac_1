import { describe, it, expect, vi } from 'vitest';
import { POST } from './resend-secretary.json.js';

// Mock supabase helpers and notifications
vi.mock('../../../../lib/supabase', () => ({
  getBookingById: vi.fn(async (id) => ({ id, enquiry_id: 'test-enquiry-id', slot: 'u13', session_date: '2026-01-20' })),
  appendEnquiryEvent: vi.fn(async () => ({})),
  getSupabaseAdmin: vi.fn(() => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: { id: 'test-enquiry-id', email: 'test@example.com' } }),
        }),
      }),
    }),
  })),
}));

vi.mock('../../../../lib/notifications', () => ({
  sendBookingConfirmationNotification: vi.fn(),
}));

describe('resend-secretary endpoint', () => {
  it('returns detailed error when notification throws and token=dev', async () => {
    const { sendBookingConfirmationNotification } = await import('../../../../lib/notifications');
    sendBookingConfirmationNotification.mockImplementationOnce(async () => { throw new Error('simulated send failure'); });

    const req = new Request('https://example.test/api/admin/booking/resend-secretary.json?token=dev', { method: 'POST', body: JSON.stringify({ booking_id: 'b1' }), headers: { 'Content-Type': 'application/json' } });
    const res = await POST({ request: req, locals: { runtime: { env: process.env } } });
    expect(res.status).toBe(500);
    const body = JSON.parse(await res.text());
    expect(body.ok).toBe(false);
    expect(body.error).toBe('exception');
    expect(body.details).toBeDefined();
  });

  it('returns generic error for non-dev token when notification throws', async () => {
    const { sendBookingConfirmationNotification } = await import('../../../../lib/notifications');
    sendBookingConfirmationNotification.mockImplementationOnce(async () => { throw new Error('simulated send failure'); });

    // set ADMIN_TOKEN and call with that token to get through auth
    process.env.ADMIN_TOKEN = 'admin-token';
    const req = new Request('https://example.test/api/admin/booking/resend-secretary.json?token=admin-token', { method: 'POST', body: JSON.stringify({ booking_id: 'b1' }), headers: { 'Content-Type': 'application/json' } });
    const res = await POST({ request: req, locals: { runtime: { env: process.env } } });
    expect(res.status).toBe(500);
    const body = JSON.parse(await res.text());
    expect(body.ok).toBe(false);
    expect(body.error).toBeDefined();
  });
});