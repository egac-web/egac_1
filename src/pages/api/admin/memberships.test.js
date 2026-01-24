import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as sup from '../../../lib/supabase';
import { GET } from './memberships.json.js';

beforeEach(() => vi.clearAllMocks());

describe('GET /api/admin/memberships', () => {
  it('returns members and maps enquiries', async () => {
    const members = [{ id: 'm1', name: 'A', email: 'a@example.com', phone: '1' }];
    vi.spyOn(sup, 'getRecentMembers').mockResolvedValue(members);

    const req = new Request('http://localhost/api/admin/memberships.json?token=dev');
    const res = await GET({ request: req, locals: { runtime: { env: { SUPABASE_URL: 'http://x', SUPABASE_SERVICE_ROLE_KEY: 'k' } } } });
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.members).toBeDefined();
    expect(body.members[0].id).toBe('m1');
  });
});
