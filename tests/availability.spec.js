import { describe, it, expect } from 'vitest';

// Simple helper copied logic: map availability entries into slot counts
function mapSlots(availArr) {
  const map = new Map();
  (availArr || []).forEach((a) => map.set(a.date, a.slots || {}));
  return map;
}

describe('availability mapping', () => {
  it('maps availability to date->slots map', () => {
    const avail = [{ date: '2026-01-06', slots: { u13: 2, u15plus: 1 } }];
    const map = mapSlots(avail);
    expect(map.get('2026-01-06').u13).toBe(2);
    expect(map.get('2026-01-06').u15plus).toBe(1);
  });
});