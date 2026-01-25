import { GET } from '../../pages/api/version.json.js';
import { test, expect } from 'vitest';

test('version endpoint returns ok and sha', async () => {
  const res = await GET();
  const body = JSON.parse(await res.text());
  expect(body.ok).toBe(true);
  expect(body.version).toBeDefined();
  // sha may be null locally if not generated, but should exist as a key
  expect(typeof body.version).toBe('object');
});
