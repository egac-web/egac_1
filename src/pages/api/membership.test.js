import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../lib/supabase', () => ({
  getInviteByToken: vi.fn(),
  createMembershipOtp: vi.fn(),
  verifyMembershipOtp: vi.fn(),
  createMemberFromEnquiry: vi.fn(),
  appendEnquiryEvent: vi.fn(),
  markInviteAccepted: vi.fn(),
  getSupabaseAdmin: vi.fn(),
}));
vi.mock('../../lib/resend', () => ({ sendInviteEmail: vi.fn() }));

import * as sup from '../../lib/supabase';
import { sendInviteEmail } from '../../lib/resend';
import { GET, POST } from './membership.json.js';

beforeEach(() => vi.clearAllMocks());

describe('Membership API', () => {
  it('GET returns enquiry and sends OTP', async () => {
    const fakeInvite = { id: 'inv1', token: 'tok', enquiry_id: 'e1' };
    const fakeEnquiry = { id: 'e1', email: 'test@example.com', name: 'Test' };
    sup.getInviteByToken.mockResolvedValue(fakeInvite);
    // Simulate client query for enquiry
    sup.getSupabaseAdmin.mockReturnValue({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: fakeEnquiry }) }) }) }) });
    sup.createMembershipOtp.mockResolvedValue({ id: 'otp1', code: '123456' });

    const req = new Request('http://localhost/api/membership.json?token=tok');
    const res = await GET({ request: req, locals: { runtime: { env: {} } } });
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.enquiry).toBeDefined();
    expect(sup.createMembershipOtp).toHaveBeenCalledWith('inv1', {});
    expect(sendInviteEmail).toHaveBeenCalled();
  });

  it('POST validates OTP and creates member', async () => {
    sup.verifyMembershipOtp.mockResolvedValue({ ok: true });
    sup.createMemberFromEnquiry.mockResolvedValue({ id: 'm1', name: 'Created' });
    sup.markInviteAccepted.mockResolvedValue({});
    sup.appendEnquiryEvent.mockResolvedValue({});

    const payload = { invite_id: 'inv1', otp_code: '123456', form: { first_name: 'A', last_name: 'B' } };
    const req = new Request('http://localhost/api/membership.json', { method: 'POST', body: JSON.stringify(payload) });
    const res = await POST({ request: req, locals: { runtime: { env: {} } } });
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(sup.verifyMembershipOtp).toHaveBeenCalledWith('inv1', '123456', {});
    expect(sup.createMemberFromEnquiry).toHaveBeenCalled();
    expect(sup.appendEnquiryEvent).toHaveBeenCalled();
  });

  it('POST returns error for invalid OTP', async () => {
    sup.verifyMembershipOtp.mockResolvedValue({ ok: false, reason: 'expired' });
    const payload = { invite_id: 'inv1', otp_code: '000000', form: {} };
    const req = new Request('http://localhost/api/membership.json', { method: 'POST', body: JSON.stringify(payload) });
    const res = await POST({ request: req, locals: { runtime: { env: {} } } });
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/OTP/);
  });
});
