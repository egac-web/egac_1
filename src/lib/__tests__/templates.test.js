import { describe, it, expect } from 'vitest';
import sanitizeHtml from 'sanitize-html';
import { stripHtmlToText } from '../admin-ui.js';

describe('templates utilities', () => {
  it('sanitizes html removing scripts and on* attributes', () => {
    const dirty = `<div onclick="alert(1)">Click me<script>alert('x')</script><a href="javascript:evil()">link</a></div>`;
    const clean = sanitizeHtml(dirty, { allowedSchemes: ['http','https','mailto','tel'] });
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('onclick');
    expect(clean).toContain('Click me');
  });

  it('converts html to plain text preserving line breaks', () => {
    const html = '<p>Hello</p><p>World</p>';
    const txt = stripHtmlToText(html);
    expect(txt).toContain('Hello');
    expect(txt).toContain('World');
    expect(txt.split('\n').length).toBeGreaterThan(1);
  });
});