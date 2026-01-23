globalThis.process ??= {}; globalThis.process.env ??= {};
import { P as POST } from '../../../../chunks/resend-secretary.json_CJYYIe0H.mjs';
import { v as vi, d as describe, i as it, g as globalExpect } from '../../../../chunks/vi.2VT5v0um_BGuskS_r.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_BTUeEnL1.mjs';

vi.mock("../../../../lib/supabase", () => ({
  getBookingById: vi.fn(async (id) => ({ id, enquiry_id: "test-enquiry-id", slot: "u13", session_date: "2026-01-20" })),
  appendEnquiryEvent: vi.fn(async () => ({})),
  getSupabaseAdmin: vi.fn(() => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: { id: "test-enquiry-id", email: "test@example.com" } })
        })
      })
    })
  }))
}));
vi.mock("../../../../lib/notifications", () => ({
  sendBookingConfirmationNotification: vi.fn()
}));
describe("resend-secretary endpoint", () => {
  it("returns detailed error when notification throws and token=dev", async () => {
    const { sendBookingConfirmationNotification } = await import('../../../../chunks/notifications_CX5oPyXA.mjs');
    sendBookingConfirmationNotification.mockImplementationOnce(async () => {
      throw new Error("simulated send failure");
    });
    const req = new Request("https://example.test/api/admin/booking/resend-secretary.json?token=dev", { method: "POST", body: JSON.stringify({ booking_id: "b1" }), headers: { "Content-Type": "application/json" } });
    const res = await POST({ request: req, locals: { runtime: { env: process.env } } });
    globalExpect(res.status).toBe(500);
    const body = JSON.parse(await res.text());
    globalExpect(body.ok).toBe(false);
    globalExpect(body.error).toBe("exception");
    globalExpect(body.details).toBeDefined();
  });
  it("returns generic error for non-dev token when notification throws", async () => {
    const { sendBookingConfirmationNotification } = await import('../../../../chunks/notifications_CX5oPyXA.mjs');
    sendBookingConfirmationNotification.mockImplementationOnce(async () => {
      throw new Error("simulated send failure");
    });
    process.env.ADMIN_TOKEN = "admin-token";
    const req = new Request("https://example.test/api/admin/booking/resend-secretary.json?token=admin-token", { method: "POST", body: JSON.stringify({ booking_id: "b1" }), headers: { "Content-Type": "application/json" } });
    const res = await POST({ request: req, locals: { runtime: { env: process.env } } });
    globalExpect(res.status).toBe(500);
    const body = JSON.parse(await res.text());
    globalExpect(body.ok).toBe(false);
    globalExpect(body.error).toBeDefined();
  });
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
