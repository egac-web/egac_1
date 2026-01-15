// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { parsePreviewVars, stripHtmlToText, setActiveTabByElements } from '../admin-ui';

describe('admin-ui helpers', () => {
  it('parsePreviewVars should parse valid JSON', () => {
    const json = '{"a": 1, "b": "x"}';
    const res = parsePreviewVars(json);
    expect(res.ok).toBe(true);
    expect(res.vars.a).toBe(1);
  });

  it('parsePreviewVars should return error for invalid JSON', () => {
    const json = '{a: 1}';
    const res = parsePreviewVars(json);
    expect(res.ok).toBe(false);
  });

  it('stripHtmlToText should remove tags and preserve paragraph breaks', () => {
    const html = '<p>Hello <strong>World</strong></p>\n\n<p>Next</p>';
    const text = stripHtmlToText(html);
    // Function preserves paragraph breaks as line breaks
    expect(text).toBe('Hello World\n\nNext');
  });

  it('setActiveTabByElements toggles classes and aria attributes', () => {
    document.body.innerHTML = `
      <button class="tab-btn" data-tab="one"></button>
      <button class="tab-btn" data-tab="two"></button>
      <div id="tab-one" class="tab-content"></div>
      <div id="tab-two" class="tab-content" style="display:none"></div>
    `;
    const buttons = Array.from(document.querySelectorAll('.tab-btn'));
    const contents = Array.from(document.querySelectorAll('.tab-content'));
    setActiveTabByElements(buttons, contents, 'two', false);
    expect(buttons[0].getAttribute('aria-selected')).toBe('false');
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
    expect(contents[0].getAttribute('aria-hidden')).toBe('true');
    expect(contents[1].getAttribute('aria-hidden')).toBe('false');
  });
});