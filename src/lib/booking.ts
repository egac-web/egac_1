import { differenceInYears, parseISO, addDays } from 'date-fns';

export const CONFIG = {
  capacityPerSlot: 2,
  weeksAhead: 8,
  timezone: 'Europe/London',
  // age boundary: <13 -> U13; >=13 -> U15+ (Option A)
  ageBoundaryForU15: 13,
  slots: {
    u13: { label: 'U13 (Tue 18:30)', time: '18:30', code: 'u13' },
    u15plus: { label: 'U15+ (Tue 19:30)', time: '19:30', code: 'u15plus' },
  },
};

export function computeAgeOnDate(dobIso, dateIso) {
  if (!dobIso) return null;
  const dob = parseISO(dobIso);
  const at = parseISO(dateIso);
  return differenceInYears(at, dob);
}

export function slotForAge(age) {
  if (age === null || age === undefined) return null;
  return age < CONFIG.ageBoundaryForU15 ? CONFIG.slots.u13.code : CONFIG.slots.u15plus.code;
}

export function getNextNWeekdayDates(weekday = 2, n = CONFIG.weeksAhead) {
  // weekday: 0 Sun .. 6 Sat ; Tuesday = 2
  const dates = [];
  const today = new Date();
  // find next Tuesday (including today if today is Tuesday)
  let d = new Date(today);
  const offset = (weekday - d.getDay() + 7) % 7;
  d = addDays(d, offset);
  for (let i = 0; i < n; i++) {
    const next = addDays(d, i * 7);
    dates.push(next.toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return dates;
}

export default CONFIG;
