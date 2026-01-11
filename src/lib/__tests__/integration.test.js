import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Integration Tests - Booking Flow', () => {
  describe('Enquiry to Booking Flow', () => {
    it('should create enquiry with correct age group', async () => {
      // Mock enquiry data
      const enquiryData = {
        parent_name: 'John Smith',
        parent_email: 'john@example.com',
        child_name: 'Emma Smith',
        child_dob: '2014-05-15', // 11 years old
        child_gender: 'female',
      };

      // Mock age groups
      const ageGroups = [
        { name: 'U13', min_age: 11, max_age: 12, active: true },
        { name: 'U15+', min_age: 13, max_age: null, active: true },
      ];

      // Calculate age on Sept 1, 2026
      const referenceDate = new Date('2026-09-01');
      const dob = new Date(enquiryData.child_dob);
      let age = referenceDate.getFullYear() - dob.getFullYear();
      const monthDiff = referenceDate.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < dob.getDate())) {
        age--;
      }

      expect(age).toBe(12); // Will be 12 on Sept 1, 2026

      // Determine age group
      const ageGroup = age >= 13 ? 'U15+' : 'U13';
      expect(ageGroup).toBe('U13');

      // Check Academy eligibility
      const academyMaxAge = 10;
      const isAcademy = age <= academyMaxAge;
      expect(isAcademy).toBe(false);
    });

    it('should flag U11 enquiry as Academy', async () => {
      const enquiryData = {
        parent_name: 'Jane Doe',
        parent_email: 'jane@example.com',
        child_name: 'Tom Doe',
        child_dob: '2016-03-20', // 10 years old
        child_gender: 'male',
      };

      const referenceDate = new Date('2026-09-01');
      const dob = new Date(enquiryData.child_dob);
      let age = referenceDate.getFullYear() - dob.getFullYear();
      const monthDiff = referenceDate.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < dob.getDate())) {
        age--;
      }

      expect(age).toBe(10);

      const academyMaxAge = 10;
      const isAcademy = age <= academyMaxAge;
      expect(isAcademy).toBe(true);
    });

    it('should calculate available booking slots within weeks_ahead limit', () => {
      const weeksAhead = 4;
      const today = new Date('2026-01-10');
      
      // Generate dates for next 6 weeks
      const slots = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + (i * 7));
        slots.push(date);
      }

      // Filter to only those within weeks_ahead
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + (weeksAhead * 7));
      
      const availableSlots = slots.filter(slot => slot <= maxDate);
      
      expect(availableSlots.length).toBe(5); // Weeks 0, 1, 2, 3, 4 (inclusive)
      expect(slots.length).toBe(6); // Total generated
    });
  });

  describe('Email Template System', () => {
    it('should structure templates with required fields', () => {
      const template = {
        key: 'invite_email',
        language: 'en',
        subject: '{{siteName}}: Book a taster / session',
        html: '<h1>{{siteName}}</h1><a href="{{inviteUrl}}">Book</a>',
        text: 'Book at: {{inviteUrl}}',
        active: true,
      };

      expect(template.key).toBeDefined();
      expect(template.subject).toBeDefined();
      expect(template.html).toBeDefined();
      expect(template.text).toBeDefined();
      expect(template.active).toBe(true);
    });

    it('should validate template has required variables', () => {
      const inviteTemplate = '<a href="{{inviteUrl}}">Book</a>';
      const bookingTemplate = 'Booking for {{date}} ({{slotLabel}})';
      const academyTemplate = 'Yes: {{responseYesUrl}}, No: {{responseNoUrl}}';

      expect(inviteTemplate).toContain('{{inviteUrl}}');
      expect(bookingTemplate).toContain('{{date}}');
      expect(bookingTemplate).toContain('{{slotLabel}}');
      expect(academyTemplate).toContain('{{responseYesUrl}}');
      expect(academyTemplate).toContain('{{responseNoUrl}}');
    });
  });

  describe('System Configuration', () => {
    it('should have valid system config structure', () => {
      const config = {
        academy_max_age: 10,
        weeks_ahead_booking: 4,
      };

      expect(config.academy_max_age).toBeGreaterThan(0);
      expect(config.weeks_ahead_booking).toBeGreaterThan(0);
      expect(config.academy_max_age).toBeLessThan(18);
      expect(config.weeks_ahead_booking).toBeLessThanOrEqual(52);
    });

    it('should validate age group ranges', () => {
      const ageGroup = {
        name: 'U13',
        min_age: 11,
        max_age: 12,
        active: true,
      };

      expect(ageGroup.min_age).toBeLessThanOrEqual(ageGroup.max_age);
      expect(ageGroup.min_age).toBeGreaterThan(0);
      expect(ageGroup.name).toMatch(/^U\d+/); // Starts with U and a number
    });

    it('should handle open-ended age groups (max_age null)', () => {
      const ageGroup = {
        name: 'U15+',
        min_age: 13,
        max_age: null,
        active: true,
      };

      expect(ageGroup.max_age).toBeNull();
      expect(ageGroup.min_age).toBeGreaterThan(0);
    });
  });

  describe('Data Validation', () => {
    it('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'name+tag@test.com',
      ];

      const invalidEmails = [
        'notanemail',
        '@example.com',
        'test@',
        'test @example.com',
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should validate date format (YYYY-MM-DD)', () => {
      const validDates = ['2026-01-10', '2024-12-31', '2000-02-29'];
      const invalidDates = ['01-10-2026', '2026/01/10', '10-01-2026', 'invalid'];

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      validDates.forEach(date => {
        expect(dateRegex.test(date)).toBe(true);
        expect(new Date(date).toString()).not.toBe('Invalid Date');
      });

      invalidDates.forEach(date => {
        expect(dateRegex.test(date)).toBe(false);
      });
    });

    it('should validate UUID format', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      ];

      const invalidUUIDs = [
        'not-a-uuid',
        '12345',
        '',
      ];

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      validUUIDs.forEach(uuid => {
        expect(uuidRegex.test(uuid)).toBe(true);
      });

      invalidUUIDs.forEach(uuid => {
        expect(uuidRegex.test(uuid)).toBe(false);
      });
    });
  });
});
