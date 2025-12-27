import { createDirectus, rest, staticToken } from '@directus/sdk';


// Prefer environment variables for secrets (Astro, Vite, Node, Cloudflare)
const DIRECTUS_URL = import.meta.env.DIRECTUS_URL || process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN || process.env.DIRECTUS_TOKEN;

// Only create Directus client if we have a real URL
export const directus = DIRECTUS_URL.includes('placeholder')
  ? null
  : createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(DIRECTUS_TOKEN));
