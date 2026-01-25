import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../pages/api/admin/templates/preview.json.js';

describe('MJML preview', () => {
  it('returns compiled HTML when MJML template exists', async () => {
    // Use dev token
    const body = { key: 'invite_email', vars: { inviteUrl: 'https://example.com/invite/abc', siteName: 'EGAC' } };
    const req = new Request('https://example.test/api/admin/templates/preview.json', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', 'x-admin-token': 'dev' } });
    const res = await POST({ request: req, locals: { runtime: { env: process.env } } });
    const json = JSON.parse(await res.text());
    expect(json.ok).toBe(true);
    expect(json.html).toContain('Book your free taster');
    expect(json.html).toContain('https://example.com/invite/abc');
  });
});