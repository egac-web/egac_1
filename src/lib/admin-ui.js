export function parsePreviewVars(text) {
  try {
    if (!text || !text.trim()) return { ok: true, vars: {} };
    const vars = JSON.parse(text);
    return { ok: true, vars };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function stripHtmlToText(html = '') {
  // Convert HTML to plain text: decode entities, preserve structure
  let text = String(html || '')
    // Replace common block elements with newlines
    .replace(/<\/?(p|div|br|h[1-6]|li)[^>]*>/gi, '\n')
    // Remove all other tags
    .replace(/<[^>]+>/g, '')
    // Decode common HTML entities
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    // Normalize whitespace but preserve intentional line breaks
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
  return text;
}

export function setActiveTabByElements(tabButtons, tabContents, tabName, focusButton = false) {
  tabButtons.forEach((b) => {
    const isActive = b.dataset.tab === tabName;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    b.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  tabContents.forEach((content) => {
    const isActive = content.id === `tab-${tabName}`;
    content.style.display = isActive ? 'block' : 'none';
    content.classList.toggle('active', isActive);
    content.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  if (focusButton) {
    const btn = tabButtons.find((b) => b.dataset.tab === tabName);
    if (btn) btn.focus();
  }
}
