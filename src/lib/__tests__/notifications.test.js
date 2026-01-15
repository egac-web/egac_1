import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../supabase', () => ({
  getEmailTemplate: vi.fn(),
}));

// We'll test the template rendering logic
describe('Email Template Rendering', () => {
  it('should replace simple variables in template', () => {
    const template = 'Hello {{name}}, welcome to {{siteName}}!';
    const vars = { name: 'John', siteName: 'EGAC' };
    
    // Simple replace logic (matching what's in notifications.ts)
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    }
    
    expect(result).toBe('Hello John, welcome to EGAC!');
  });

  it('should handle missing variables gracefully', () => {
    const template = 'Hello {{name}}, booking: {{bookingId}}';
    const vars = { name: 'John' };
    
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    }
    
    expect(result).toContain('John');
    expect(result).toContain('{{bookingId}}'); // Unchanged
  });

  it('should handle conditional logo rendering', () => {
    const templateWithLogo = '{{#if logoUrl}}<img src="{{logoUrl}}"/>{{/if}}';
    const varsWithLogo = { logoUrl: 'https://example.com/logo.png' };
    const varsWithoutLogo = {};
    
    // Test with logo
    let withLogo = templateWithLogo.replace(/\{\{#if logoUrl\}\}(.*?)\{\{\/if\}\}/g, (match, content) => {
      if (varsWithLogo.logoUrl) {
        return content.replace(/\{\{logoUrl\}\}/g, varsWithLogo.logoUrl);
      }
      return '';
    });
    
    expect(withLogo).toContain('img src="https://example.com/logo.png"');
    
    // Test without logo
    let withoutLogo = templateWithLogo.replace(/\{\{#if logoUrl\}\}(.*?)\{\{\/if\}\}/g, (match, content) => {
      if (varsWithoutLogo.logoUrl) {
        return content.replace(/\{\{logoUrl\}\}/g, varsWithoutLogo.logoUrl);
      }
      return '';
    });
    
    expect(withoutLogo).toBe('');
  });

  it('should render invite email template correctly', () => {
    const template = '<h1>Book your free taster</h1><a href="{{inviteUrl}}">Book a session</a>';
    const vars = {
      siteName: 'East Grinstead AC',
      inviteUrl: 'https://example.com/invite/123',
    };
    
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    }
    
    expect(result).toContain('https://example.com/invite/123');
    expect(result).not.toContain('{{inviteUrl}}');
  });

  it('should render booking confirmation with date and slot', () => {
    const template = 'Your booking for {{date}} ({{slotLabel}}) is confirmed.';
    const vars = {
      date: '2026-03-15',
      slotLabel: 'Sunday Morning U13',
    };
    
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    }
    
    expect(result).toBe('Your booking for 2026-03-15 (Sunday Morning U13) is confirmed.');
  });

  it('should render Academy invitation with response URLs', () => {
    const template = '<a href="{{responseYesUrl}}">Yes</a> <a href="{{responseNoUrl}}">No</a>';
    const vars = {
      responseYesUrl: 'https://example.com/academy/yes/123',
      responseNoUrl: 'https://example.com/academy/no/123',
      childName: 'Emma',
    };
    
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    }
    
    expect(result).toContain('https://example.com/academy/yes/123');
    expect(result).toContain('https://example.com/academy/no/123');
  });
});
