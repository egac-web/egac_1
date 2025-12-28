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

// Only create Directus client if we have a real URL
export const directus = DIRECTUS_URL.includes('placeholder')
  ? null
  : createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(DIRECTUS_TOKEN));
