import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the supabase helpers used by admin endpoints
vi.mock('../supabase', () => ({
  getActiveAgeGroups: vi.fn(),
  getSystemConfigAll: vi.fn(),
  listEmailTemplates: vi.fn(),
}));

import * as supabase from '../supabase';
import * as configApi from '../../pages/api/admin/config.json.js';
import * as templatesApi from '../../pages/api/admin/templates.json.js';

describe('Admin API - Config & Templates', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('GET /api/admin/config.json returns ageGroups and systemConfig when token=dev', async () => {
    // Arrange - mock supabase responses
    supabase.getActiveAgeGroups.mockResolvedValue([
      { id: 'g1', code: 'u11', label: 'U11', min_age: 9, max_age: 10 },
    ]);
    supabase.getSystemConfigAll.mockResolvedValue({ academy_max_age: '10', weeks_ahead_booking: '8' });

    const req = new Request('http://localhost/api/admin/config.json?token=dev');
    const env = { SUPABASE_URL: 'https://example', SUPABASE_SERVICE_ROLE_KEY: 'service-role' };
    const res = await configApi.GET({ request: req, locals: { runtime: { env } } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.ageGroups)).toBe(true);
    expect(body.ageGroups[0].code).toBe('u11');
    expect(body.systemConfig.academy_max_age).toBe('10');
  });

  it('GET /api/admin/templates.json returns templates when token provided', async () => {
    // Arrange
    const sampleTemplates = [
      { id: 't1', key: 'invite_email', subject: 'Invite', html: '<p/>', text: 'text', active: true },
    ];
    supabase.listEmailTemplates.mockResolvedValue(sampleTemplates);

    const req = new Request('http://localhost/api/admin/templates.json?token=dev');
    const env = { SUPABASE_URL: 'https://example', SUPABASE_SERVICE_ROLE_KEY: 'service-role' };
    const res = await templatesApi.GET({ request: req, locals: { runtime: { env } } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.templates)).toBe(true);
    expect(body.templates.length).toBe(1);
    expect(body.templates[0].key).toBe('invite_email');
  });

  it('GET /api/admin/config.json denies when no token', async () => {
    const req = new Request('http://localhost/api/admin/config.json');
    const res = await configApi.GET({ request: req, locals: { runtime: { env: {} } } });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it('GET /api/admin/templates.json denies when token invalid', async () => {
    const req = new Request('http://localhost/api/admin/templates.json?token=bad');
    const res = await templatesApi.GET({ request: req, locals: { runtime: { env: {} } } });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });
});