globalThis.process ??= {}; globalThis.process.env ??= {};
import { P as POST$1 } from '../../chunks/enquiry.json_DgeMxXUP.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_rSKK_bSn.mjs';

// Ensure this route is server-rendered so POST requests are allowed
const prerender = false;

// Mirror the JSON route handler under /api/enquiry to allow POSTs during dev
const POST = POST$1;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
