import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  sendAcademyWaitlistNotification: vi.fn(async () => ({ ok: true })),
}));

describe('Enquiry endpoint', () => {
  // Clear mocks between tests to avoid cross-test leakage
  beforeEach(() => { vi.clearAllMocks(); });

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
    const { createAcademyInvitation, createInviteForEnquiry } = await import('../../lib/supabase');
    expect(createAcademyInvitation).toHaveBeenCalledWith('enq-1', expect.anything());
    // Ensure we did NOT create a normal booking invite for Academy enquiries
    expect(createInviteForEnquiry).not.toHaveBeenCalled();
    // Ensure the user was notified about waiting list addition
    const { sendAcademyWaitlistNotification } = await import('../../lib/notifications');
    expect(sendAcademyWaitlistNotification).toHaveBeenCalledWith(expect.objectContaining({ enquiry: expect.any(Object), invitation: expect.objectContaining({ id: 'acad-1' }), env: expect.any(Object) }));
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
    const { createAcademyInvitation, createInviteForEnquiry } = await import('../../lib/supabase');
    // For this over-age enquiry we should NOT create an academy invitation
    expect(createAcademyInvitation).not.toHaveBeenCalled();
    // And we should create a normal booking invite
    expect(createInviteForEnquiry).toHaveBeenCalledWith('enq-1', expect.anything());
  });
});
