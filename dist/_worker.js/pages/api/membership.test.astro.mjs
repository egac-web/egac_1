globalThis.process ??= {}; globalThis.process.env ??= {};
import { x as getInviteByToken, a as getSupabaseAdmin, E as createMembershipOtp, F as verifyMembershipOtp, G as createMemberFromEnquiry, B as markInviteAccepted, f as appendEnquiryEvent } from '../../chunks/supabase_DDVehETI.mjs';
import { s as sendInviteEmail } from '../../chunks/resend_CZA8PHeW.mjs';
import { G as GET, P as POST } from '../../chunks/membership.json_yds_cUKh.mjs';
import { v as vi, b as beforeEach, d as describe, i as it, g as globalExpect } from '../../chunks/vi.2VT5v0um_BqJ87Wy1.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CjgTivB9.mjs';

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

beforeEach(() => vi.clearAllMocks());

describe('Membership API', () => {
  it('GET returns enquiry and sends OTP', async () => {
    const fakeInvite = { id: 'inv1', token: 'tok', enquiry_id: 'e1' };
    const fakeEnquiry = { id: 'e1', email: 'test@example.com', name: 'Test' };
    getInviteByToken.mockResolvedValue(fakeInvite);
    // Simulate client query for enquiry
    getSupabaseAdmin.mockReturnValue({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: fakeEnquiry }) }) }) }) });
    createMembershipOtp.mockResolvedValue({ id: 'otp1', code: '123456' });

    const req = new Request('http://localhost/api/membership.json?token=tok');
    const res = await GET({ request: req, locals: { runtime: { env: {} } } });
    const body = await res.json();
    globalExpect(body.ok).toBe(true);
    globalExpect(body.enquiry).toBeDefined();
    globalExpect(createMembershipOtp).toHaveBeenCalledWith('inv1', {});
    globalExpect(sendInviteEmail).toHaveBeenCalled();
  });

  it('POST validates OTP and creates member', async () => {
    verifyMembershipOtp.mockResolvedValue({ ok: true });
    createMemberFromEnquiry.mockResolvedValue({ id: 'm1', name: 'Created' });
    markInviteAccepted.mockResolvedValue({});
    appendEnquiryEvent.mockResolvedValue({});

    const payload = { invite_id: 'inv1', otp_code: '123456', form: { first_name: 'A', last_name: 'B' } };
    const req = new Request('http://localhost/api/membership.json', { method: 'POST', body: JSON.stringify(payload) });
    const res = await POST({ request: req, locals: { runtime: { env: {} } } });
    const body = await res.json();
    globalExpect(body.ok).toBe(true);
    globalExpect(verifyMembershipOtp).toHaveBeenCalledWith('inv1', '123456', {});
    globalExpect(createMemberFromEnquiry).toHaveBeenCalled();
    globalExpect(appendEnquiryEvent).toHaveBeenCalled();
  });

  it('POST returns error for invalid OTP', async () => {
    verifyMembershipOtp.mockResolvedValue({ ok: false, reason: 'expired' });
    const payload = { invite_id: 'inv1', otp_code: '000000', form: {} };
    const req = new Request('http://localhost/api/membership.json', { method: 'POST', body: JSON.stringify(payload) });
    const res = await POST({ request: req, locals: { runtime: { env: {} } } });
    const body = await res.json();
    globalExpect(body.ok).toBe(false);
    globalExpect(body.error).toMatch(/OTP/);
  });
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
