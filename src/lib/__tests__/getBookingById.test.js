import { test, expect, vi } from 'vitest';
import * as supabaseModule from '../../pages/api/admin/booking/attendance.json.js';
import * as sb from '../../lib/supabase';

// Mock getSupabaseAdmin to control rpc/from calls
vi.mock('../../src/lib/supabase.ts', async () => {
  // We'll replace functions by injecting in tests
  return {}; // placeholder - we'll stub methods via vi.spyOn where needed
});

// Test the RPC success path and fallback path
import { getBookingById } from '../../lib/supabase.ts';

test('getBookingById uses RPC when available', async () => {
  const fakeClient = {
    rpc: vi.fn().mockResolvedValue({ data: [{ id: 'b1', enquiry_id: 'e1', slot: 'u15', enquiry: { id: 'e1', name: 'Test' } }], error: null }),
  };
  const spy = vi.spyOn(sb, 'getSupabaseAdmin').mockReturnValue(fakeClient as any);

  const b = await getBookingById('b1', {});
  expect(fakeClient.rpc).toHaveBeenCalledWith('get_booking_with_enquiry', { bid: 'b1' });
  expect(b).toBeDefined();
  expect(b.enquiry).toBeDefined();

  spy.mockRestore();
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
  const spy = vi.spyOn(sb, 'getSupabaseAdmin').mockReturnValue(fakeClient as any);

  const b = await getBookingById('b2', {});
  expect(fakeClient.rpc).toHaveBeenCalled();
  expect(b).toBeDefined();
  expect(b.enquiry).toBeDefined();
  expect(b.enquiry.name).toBe('Fallback');

  spy.mockRestore();
});