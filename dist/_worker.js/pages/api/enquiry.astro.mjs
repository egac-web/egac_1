globalThis.process ??= {}; globalThis.process.env ??= {};
import { p as post$1 } from '../../chunks/enquiry.json_DrDfkOY3.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_KnGPrR4n.mjs';

// Ensure this route is server-rendered so POST requests are allowed
const prerender = false;

// Mirror the JSON route handler under /api/enquiry to allow POSTs during dev
const post = post$1;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
