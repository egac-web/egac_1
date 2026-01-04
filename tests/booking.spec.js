import { describe, it, expect } from 'vitest';
import { computeAgeOnDate, slotForAge, getNextNWeekdayDates, CONFIG } from '../dist/_worker.js/chunks/booking_BQlFZzhA.mjs';

describe('booking utils', () => {
  it('computes age correctly', () => {
    const age = computeAgeOnDate('2010-06-01', '2023-06-01T00:00:00');
    expect(age).toBe(13);
  });

  it('assigns slots correctly', () => {
    expect(slotForAge(12)).toBe(CONFIG.slots.u13.code);
    expect(slotForAge(13)).toBe(CONFIG.slots.u15plus.code);
  });

  it('returns next N weekday dates (Tuesday)', () => {
    const dates = getNextNWeekdayDates(2, 3);
    expect(Array.isArray(dates)).toBe(true);
    expect(dates.length).toBe(3);
    // YYYY-MM-DD format
    expect(dates[0]).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});