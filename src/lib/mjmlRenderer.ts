import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';

export function simpleRender(templateStr: string, vars: Record<string, any>) {
  if (!templateStr) return templateStr;
  // Simple replacement for {{var}} placeholders
  let s = templateStr;
  Object.keys(vars).forEach((k) => {
    const regex = new RegExp(`\{\{${k}\}\}`, 'g');
    s = s.replace(regex, String(vars[k] ?? ''));
  });
  // Remove any unreplaced {{#if logoUrl}}...{{/if}} blocks for simple preview behavior
  s = s.replace(/\{\{#if logoUrl\}\}[\s\S]*?\{\{\/if\}\}/g, '');
  return s;
}

export function renderMjmlTemplate(key: string, vars: Record<string, any> = {}) {
  const mjmlPath = path.join(process.cwd(), 'src', 'lib', 'emailTemplates', 'mjml', `${key}.mjml`);
  if (!fs.existsSync(mjmlPath)) return null;
  const raw = fs.readFileSync(mjmlPath, 'utf8');
  const rendered = simpleRender(raw, vars);
  const { html, errors } = mjml2html(rendered, { validationLevel: 'soft' });
  if (errors && errors.length) console.warn('MJML render warnings:', errors);
  return html;
}
