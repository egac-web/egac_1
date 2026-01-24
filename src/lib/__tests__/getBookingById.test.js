import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as sb from '../../lib/supabase';

// Mock supabase client creation to avoid real network calls; tests will set global.__FAKE_SUPABASE_CLIENT__ per-case
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => global.__FAKE_SUPABASE_CLIENT__) }));

// Ensure environment variables are present so getSupabaseAdmin doesn't throw
beforeEach(() => {
  process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:5432';
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-role-key';
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Test the RPC success path and fallback path
import { getBookingById } from '../../lib/supabase.ts';

test('getBookingById uses RPC when available', async () => {
  const fakeClient = {
    rpc: vi.fn().mockResolvedValue({ data: [{ id: 'b1', enquiry_id: 'e1', slot: 'u15', enquiry: { id: 'e1', name: 'Test' } }], error: null }),
  };
  // Ensure the mocked supabase createClient returns our fake client
  global.__FAKE_SUPABASE_CLIENT__ = fakeClient;

  const b = await getBookingById('b1');
  expect(fakeClient.rpc).toHaveBeenCalledWith('get_booking_with_enquiry', { bid: 'b1' });
  expect(b).toBeDefined();
  expect(b.enquiry).toBeDefined();

  global.__FAKE_SUPABASE_CLIENT__ = undefined;
});

test('getBookingById falls back when RPC fails', async () => {
  const fakeClient = {
    rpc: vi.fn().mockImplementation(() => { throw new Error('rpc not available'); }),
    from: vi.fn().mockImplementation((table) => {
      if (table === 'bookings') return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: 'b2', enquiry_id: 'e2' }, error: null }) }) }) };
      if (table === 'enquiries') return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: 'e2', name: 'Fallback' }, error: null }) }) }) };
      return null;
    })
  };
  // Ensure the mocked supabase createClient returns our fake client
  global.__FAKE_SUPABASE_CLIENT__ = fakeClient;

  const b = await getBookingById('b2');
  expect(fakeClient.rpc).toHaveBeenCalled();
  expect(b).toBeDefined();
  expect(b.enquiry).toBeDefined();
  expect(b.enquiry.name).toBe('Fallback');

  global.__FAKE_SUPABASE_CLIENT__ = undefined;
});