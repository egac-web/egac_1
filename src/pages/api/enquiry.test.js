import { describe, it, expect, vi } from 'vitest';
import { POST } from './enquiry.json.js';

// Mock supabase helpers
vi.mock('../../lib/supabase', () => ({
  insertEnquiry: vi.fn(async (payload) => ({ id: 'enq-1', ...payload })),
  createInviteForEnquiry: vi.fn(async () => ({ id: 'inv-1', token: 'tkn' })),
  getSystemConfigAll: vi.fn(async () => ({ academy_max_age: '10' })),
  createAcademyInvitation: vi.fn(async (enquiry_id) => ({ id: 'acad-1', enquiry_id })),
  appendEnquiryEvent: vi.fn(async () => ({})),
  getSupabaseAdmin: vi.fn(() => ({ from: () => ({ update: () => ({}) }) })),
  markInviteSent: vi.fn(async () => ({})),
}));

vi.mock('../../lib/notifications', () => ({
  sendInviteNotification: vi.fn(async () => ({})),
}));

describe('Enquiry endpoint', () => {
  it('adds U11 (age <= academy_max_age) to academy waiting list', async () => {
    const body = {
      contact_name: 'Parent',
      contact_email: 'parent@example.com',
      gdpr_consent: true,
      interest: 'Training',
      dob: '2016-08-01', // Age 10 on 2026-08-31
    };

    const req = new Request('https://example.test/api/enquiry.json', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
    const res = await POST({ request: req, locals: { runtime: { env: process.env } } });
    expect(res.status).toBe(200);
    const json = JSON.parse(await res.text());
    expect(json.ok).toBe(true);
    // Ensure createAcademyInvitation was invoked
    const { createAcademyInvitation } = await import('../../lib/supabase');
    expect(createAcademyInvitation).toHaveBeenCalledWith('enq-1', expect.anything());
  });

  it('does not add over-age enquiries to academy list', async () => {
    const body = {
      contact_name: 'Parent',
      contact_email: 'parent2@example.com',
      gdpr_consent: true,
      interest: 'Training',
      dob: '2012-01-01', // Age 14 on 2026-08-31
    };

    const req = new Request('https://example.test/api/enquiry.json', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
    const res = await POST({ request: req, locals: { runtime: { env: process.env } } });
    expect(res.status).toBe(200);
    const json = JSON.parse(await res.text());
    expect(json.ok).toBe(true);
    const { createAcademyInvitation } = await import('../../lib/supabase');
    // Should not be called a second time for this test (invocation count remains 1)
    expect(createAcademyInvitation).toHaveBeenCalledTimes(1);
  });
});
