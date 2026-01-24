globalThis.process ??= {}; globalThis.process.env ??= {};
import { P as POST } from '../../chunks/enquiry.json_DQLgut4G.mjs';
import { v as vi, d as describe, b as beforeEach, i as it, g as globalExpect } from '../../chunks/vi.2VT5v0um_BqJ87Wy1.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CjgTivB9.mjs';

vi.mock("../../lib/supabase", () => ({
  insertEnquiry: vi.fn(async (payload) => ({ id: "enq-1", ...payload })),
  createInviteForEnquiry: vi.fn(async () => ({ id: "inv-1", token: "tkn" })),
  getSystemConfigAll: vi.fn(async () => ({ academy_max_age: "10" })),
  createAcademyInvitation: vi.fn(async (enquiry_id) => ({ id: "acad-1", enquiry_id })),
  appendEnquiryEvent: vi.fn(async () => ({})),
  getSupabaseAdmin: vi.fn(() => ({ from: () => ({ update: () => ({}) }) })),
  markInviteSent: vi.fn(async () => ({}))
}));
vi.mock("../../lib/notifications", () => ({
  sendInviteNotification: vi.fn(async () => ({})),
  sendAcademyWaitlistNotification: vi.fn(async () => ({ ok: true }))
}));
describe("Enquiry endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("adds U11 (age <= academy_max_age) to academy waiting list", async () => {
    const body = {
      contact_name: "Parent",
      contact_email: "parent@example.com",
      gdpr_consent: true,
      interest: "Training",
      dob: "2016-08-01"
      // Age 10 on 2026-08-31
    };
    const req = new Request("https://example.test/api/enquiry.json", { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
    const res = await POST({ request: req, locals: { runtime: { env: process.env } } });
    globalExpect(res.status).toBe(200);
    const json = JSON.parse(await res.text());
    globalExpect(json.ok).toBe(true);
    const { createAcademyInvitation, createInviteForEnquiry } = await import('../../chunks/supabase_DDVehETI.mjs').then(n => n.s);
    globalExpect(createAcademyInvitation).toHaveBeenCalledWith("enq-1", globalExpect.anything());
    globalExpect(createInviteForEnquiry).not.toHaveBeenCalled();
    const { sendAcademyWaitlistNotification } = await import('../../chunks/notifications_Dpwd-lBy.mjs');
    globalExpect(sendAcademyWaitlistNotification).toHaveBeenCalledWith(globalExpect.objectContaining({ enquiry: globalExpect.any(Object), invitation: globalExpect.objectContaining({ id: "acad-1" }), env: globalExpect.any(Object) }));
  });
  it("does not add over-age enquiries to academy list", async () => {
    const body = {
      contact_name: "Parent",
      contact_email: "parent2@example.com",
      gdpr_consent: true,
      interest: "Training",
      dob: "2012-01-01"
      // Age 14 on 2026-08-31
    };
    const req = new Request("https://example.test/api/enquiry.json", { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
    const res = await POST({ request: req, locals: { runtime: { env: process.env } } });
    globalExpect(res.status).toBe(200);
    const json = JSON.parse(await res.text());
    globalExpect(json.ok).toBe(true);
    const { createAcademyInvitation, createInviteForEnquiry } = await import('../../chunks/supabase_DDVehETI.mjs').then(n => n.s);
    globalExpect(createAcademyInvitation).not.toHaveBeenCalled();
    globalExpect(createInviteForEnquiry).toHaveBeenCalledWith("enq-1", globalExpect.anything());
  });
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
