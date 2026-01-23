globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_BTUeEnL1.mjs';

// Minimal test endpoint to verify POST routing on Pages
const prerender = false;

async function POST({ request }) {
  return new Response(JSON.stringify({
    ok: true,
    message: 'POST received successfully',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    message: 'GET received successfully',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
