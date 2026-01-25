import { createDirectus, rest, staticToken } from '@directus/sdk';
import type { DirectusClient, RestClient, StaticTokenClient } from '@directus/sdk';

// Helper function to get Directus client with runtime environment support
export function getDirectusClient(runtime?: any): DirectusClient<any> & RestClient<any> & StaticTokenClient<any> {
  // Try runtime env first (Cloudflare), then import.meta.env (build time), then process.env (Node)
  const DIRECTUS_URL = runtime?.env?.DIRECTUS_URL ||
    (import.meta as any).env?.DIRECTUS_URL ||
    process.env.DIRECTUS_URL;
  const DIRECTUS_TOKEN = runtime?.env?.DIRECTUS_TOKEN ||
    (import.meta as any).env?.DIRECTUS_TOKEN ||
    process.env.DIRECTUS_TOKEN;

  console.log('[EGAC] DIRECTUS_URL:', DIRECTUS_URL);
  console.log('[EGAC] DIRECTUS_TOKEN:', DIRECTUS_TOKEN ? '[set]' : '[not set]');

  if (!DIRECTUS_URL) {
    throw new Error('[EGAC] DIRECTUS_URL is not available');
  }

  return createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(DIRECTUS_TOKEN || ''));
}

// Legacy export for compatibility (uses build-time env vars only)
// Initialize a build-time directus client if env vars are present; avoid throwing during module import.
let _directus;
try {
  const BUILD_DIRECTUS_URL = (import.meta as any).env?.DIRECTUS_URL || process.env.DIRECTUS_URL;
  const BUILD_DIRECTUS_TOKEN = (import.meta as any).env?.DIRECTUS_TOKEN || process.env.DIRECTUS_TOKEN;
  if (BUILD_DIRECTUS_URL) {
    _directus = createDirectus(BUILD_DIRECTUS_URL).with(rest());
    if (BUILD_DIRECTUS_TOKEN) {
      _directus = _directus.with(staticToken(BUILD_DIRECTUS_TOKEN));
    }
  } else {
    console.warn('[EGAC] DIRECTUS_URL not set at import time; directus client not initialized.');
  }
} catch (err) {
  console.warn('[EGAC] Failed to initialize build-time Directus client:', err);
}
export const directus = _directus;
