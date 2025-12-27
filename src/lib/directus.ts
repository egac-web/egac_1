import { createDirectus, rest, staticToken } from '@directus/sdk';

// These values should be set in variables.md and updated here when available
const DIRECTUS_URL = '[placeholder: DIRECTUS_URL]';
const DIRECTUS_TOKEN = '[placeholder: DIRECTUS_TOKEN]';

// Only create Directus client if we have a real URL
export const directus = DIRECTUS_URL.includes('placeholder')
  ? null
  : createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(DIRECTUS_TOKEN));
