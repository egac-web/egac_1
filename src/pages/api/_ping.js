// Wrapper to ensure both /api/_ping and /api/_ping.json work in different router behaviours
export { post } from './_ping.json.js';
export const prerender = false;
