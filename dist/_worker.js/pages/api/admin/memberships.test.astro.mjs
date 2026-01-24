globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as sup } from '../../../chunks/supabase_DDVehETI.mjs';
import { G as GET } from '../../../chunks/memberships.json_BYrxNP2p.mjs';
import { b as beforeEach, d as describe, i as it, v as vi, g as globalExpect } from '../../../chunks/vi.2VT5v0um_BqJ87Wy1.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CjgTivB9.mjs';

beforeEach(() => vi.clearAllMocks());

describe('GET /api/admin/memberships', () => {
  it('returns members and maps enquiries', async () => {
    const members = [{ id: 'm1', name: 'A', email: 'a@example.com', phone: '1' }];
    vi.spyOn(sup, 'getRecentMembers').mockResolvedValue(members);

    const req = new Request('http://localhost/api/admin/memberships.json?token=dev');
    const res = await GET({ request: req, locals: { runtime: { env: { SUPABASE_URL: 'http://x', SUPABASE_SERVICE_ROLE_KEY: 'k' } } } });
    const body = await res.json();
    globalExpect(body.ok).toBe(true);
    globalExpect(body.members).toBeDefined();
    globalExpect(body.members[0].id).toBe('m1');
  });
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
