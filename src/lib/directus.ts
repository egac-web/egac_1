import { createDirectus, rest, staticToken } from '@directus/sdk';

// Add type declaration for ImportMetaEnv if not already present
interface ImportMetaEnv {
  readonly DIRECTUS_URL?: string;
  readonly DIRECTUS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Prefer environment variables for secrets (Astro, Vite, Node, Cloudflare)
const DIRECTUS_URL = (import.meta as any).env?.DIRECTUS_URL || process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = (import.meta as any).env?.DIRECTUS_TOKEN || process.env.DIRECTUS_TOKEN;

// Debug output for environment troubleshooting
console.log('[EGAC] DIRECTUS_URL:', DIRECTUS_URL);
console.log('[EGAC] DIRECTUS_TOKEN:', DIRECTUS_TOKEN ? '[set]' : '[not set]');

// Safety check for missing DIRECTUS_URL
if (!DIRECTUS_URL) {
  throw new Error('[EGAC] DIRECTUS_URL is not set. Please set the DIRECTUS_URL environment variable in your deployment environment.');
}

// Only create Directus client if we have a real URL
export const directus = DIRECTUS_URL.includes('placeholder')
  ? null
  : createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(DIRECTUS_TOKEN));
