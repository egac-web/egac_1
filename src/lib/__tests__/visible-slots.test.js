import { describe, it, expect } from 'vitest';
import { getVisibleSlots } from '../../components/TrainingBookingSystem';

describe('getVisibleSlots', () => {
  const sampleSlots = [
    { id: '1', date: '2026-01-01', group: 'u13', label: 'U13', enabled: true, booked: false, slotsLeft: 2, eligible: false },
    { id: '2', date: '2026-01-01', group: 'u15plus', label: 'U15+', enabled: true, booked: false, slotsLeft: 2, eligible: true },
    { id: '3', date: '2026-01-08', group: 'u13', label: 'U13', enabled: false, booked: false, slotsLeft: 0, eligible: false },
  ];

  it('returns only enabled slots for public users', () => {
    const visible = getVisibleSlots(sampleSlots, false);
    expect(visible.length).toBe(2);
    expect(visible.every(s => s.enabled)).toBe(true);
  });

  it('returns only eligible slots for invited users', () => {
    const visible = getVisibleSlots(sampleSlots, true);
    expect(visible.length).toBe(1);
    expect(visible[0].group).toBe('u15plus');
  });
});
