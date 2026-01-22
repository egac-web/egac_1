globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, r as renderTemplate } from '../chunks/astro/server_BJplAL8L.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_rSKK_bSn.mjs';

const $$Booking = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`// booking.astro is deprecated and can be deleted. Use bookings.astro only.`;
}, "/home/eddie/athletics/egac_1/src/pages/booking.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/booking.astro";
const $$url = "/booking";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Booking,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
