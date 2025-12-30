import { post as postJson } from './enquiry.json.js';

// Ensure this route is server-rendered so POST requests are allowed
export const prerender = false;

// Mirror the JSON route handler under /api/enquiry to allow POSTs during dev
export const post = postJson;
