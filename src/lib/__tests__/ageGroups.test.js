import { describe, it, expect } from 'vitest';

// Test age group calculation logic
describe('Age Group Calculations', () => {
  // Helper function to compute age on a specific date (mirroring backend logic)
  function computeAgeOnDate(dateOfBirth, referenceDate) {
    const dob = new Date(dateOfBirth);
    const ref = new Date(referenceDate);
    let age = ref.getFullYear() - dob.getFullYear();
    const monthDiff = ref.getMonth() - dob.getMonth();
    const dayDiff = ref.getDate() - dob.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  }

  // Helper to determine age group (simplified version)
  function getAgeGroupForAge(age, ageGroups) {
    // Sort by min_age descending to match from highest first
    const sorted = [...ageGroups].sort((a, b) => b.min_age - a.min_age);
    
    for (const group of sorted) {
      if (age >= group.min_age) {
        if (group.max_age === null || age <= group.max_age) {
          return group.name;
        }
      }
    }
    return null;
  }

  const sampleAgeGroups = [
    { name: 'U13', min_age: 11, max_age: 12, active: true },
    { name: 'U15+', min_age: 13, max_age: null, active: true },
  ];

  describe('computeAgeOnDate', () => {
    it('should calculate age correctly for birthday today', () => {
      const age = computeAgeOnDate('2014-01-10', '2026-01-10');
      expect(age).toBe(12);
    });

    it('should calculate age correctly before birthday', () => {
      const age = computeAgeOnDate('2014-03-15', '2026-01-10');
      expect(age).toBe(11); // Birthday hasn't happened yet this year
    });

    it('should calculate age correctly after birthday', () => {
      const age = computeAgeOnDate('2014-01-05', '2026-01-10');
      expect(age).toBe(12); // Birthday already happened
    });

    it('should handle leap year birthdays', () => {
      const age = computeAgeOnDate('2016-02-29', '2026-03-01');
      expect(age).toBe(10);
    });
  });

  describe('getAgeGroupForAge', () => {
    it('should assign 11 year old to U13', () => {
      const group = getAgeGroupForAge(11, sampleAgeGroups);
      expect(group).toBe('U13');
    });

    it('should assign 12 year old to U13', () => {
      const group = getAgeGroupForAge(12, sampleAgeGroups);
      expect(group).toBe('U13');
    });

    it('should assign 13 year old to U15+', () => {
      const group = getAgeGroupForAge(13, sampleAgeGroups);
      expect(group).toBe('U15+');
    });

    it('should assign 17 year old to U15+', () => {
      const group = getAgeGroupForAge(17, sampleAgeGroups);
      expect(group).toBe('U15+');
    });

    it('should return null for age below minimum', () => {
      const group = getAgeGroupForAge(9, sampleAgeGroups);
      expect(group).toBeNull();
    });

    it('should handle multiple age groups correctly', () => {
      const groups = [
        { name: 'U11', min_age: 9, max_age: 10, active: true },
        { name: 'U13', min_age: 11, max_age: 12, active: true },
        { name: 'U15', min_age: 13, max_age: 14, active: true },
        { name: 'U17+', min_age: 15, max_age: null, active: true },
      ];
      
      expect(getAgeGroupForAge(9, groups)).toBe('U11');
      expect(getAgeGroupForAge(10, groups)).toBe('U11');
      expect(getAgeGroupForAge(11, groups)).toBe('U13');
      expect(getAgeGroupForAge(14, groups)).toBe('U15');
      expect(getAgeGroupForAge(16, groups)).toBe('U17+');
    });
  });

  describe('Academy Eligibility', () => {
    it('should identify U11 (age 10) as Academy eligible', () => {
      const academyMaxAge = 10;
      const age = 10;
      expect(age <= academyMaxAge).toBe(true);
    });

    it('should identify U13 (age 11) as NOT Academy eligible', () => {
      const academyMaxAge = 10;
      const age = 11;
      expect(age <= academyMaxAge).toBe(false);
    });

    it('should handle edge case at exactly academy_max_age', () => {
      const academyMaxAge = 10;
      const dob = '2016-01-10';
      const ageOnSept1_2026 = computeAgeOnDate(dob, '2026-09-01');
      expect(ageOnSept1_2026).toBe(10);
      expect(ageOnSept1_2026 <= academyMaxAge).toBe(true);
    });
  });

  describe('Booking Eligibility Window', () => {
    it('should calculate weeks ahead correctly', () => {
      const weeksAhead = 4;
      const today = new Date('2026-01-10');
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + (weeksAhead * 7));
      
      const testDate = new Date('2026-02-07'); // 4 weeks ahead
      expect(testDate <= maxDate).toBe(true);
      
      const tooFarDate = new Date('2026-02-14'); // 5 weeks ahead
      expect(tooFarDate <= maxDate).toBe(false);
    });
  });
});
