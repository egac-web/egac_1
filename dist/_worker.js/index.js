globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_KnGPrR4n.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CXle3ap8.mjs';
import { manifest } from './manifest_DUXvYHNG.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin/members.astro.mjs');
const _page3 = () => import('./pages/api/admin/booking/attendance.json.astro.mjs');
const _page4 = () => import('./pages/api/admin/enquiries.json.astro.mjs');
const _page5 = () => import('./pages/api/admin/enquiry/presli_confirm.json.astro.mjs');
const _page6 = () => import('./pages/api/admin/secretary.json.astro.mjs');
const _page7 = () => import('./pages/api/booking/cancel.json.astro.mjs');
const _page8 = () => import('./pages/api/booking.json.astro.mjs');
const _page9 = () => import('./pages/api/enquiry.astro.mjs');
const _page10 = () => import('./pages/api/enquiry.json.astro.mjs');
const _page11 = () => import('./pages/booking.astro.mjs');
const _page12 = () => import('./pages/bookings.astro.mjs');
const _page13 = () => import('./pages/codes_of_conduct/_slug_.astro.mjs');
const _page14 = () => import('./pages/codes_of_conduct.astro.mjs');
const _page15 = () => import('./pages/contact.astro.mjs');
const _page16 = () => import('./pages/enquiry.astro.mjs');
const _page17 = () => import('./pages/fixtures.astro.mjs');
const _page18 = () => import('./pages/policies/constitution.astro.mjs');
const _page19 = () => import('./pages/policies/_slug_.astro.mjs');
const _page20 = () => import('./pages/policies.astro.mjs');
const _page21 = () => import('./pages/records/masters.astro.mjs');
const _page22 = () => import('./pages/records/senior.astro.mjs');
const _page23 = () => import('./pages/records/u11.astro.mjs');
const _page24 = () => import('./pages/records/u13.astro.mjs');
const _page25 = () => import('./pages/records/u15.astro.mjs');
const _page26 = () => import('./pages/records/u17.astro.mjs');
const _page27 = () => import('./pages/records/u20.astro.mjs');
const _page28 = () => import('./pages/records.astro.mjs');
const _page29 = () => import('./pages/style-guide.astro.mjs');
const _page30 = () => import('./pages/volunteering.astro.mjs');
const _page31 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/members.astro", _page2],
    ["src/pages/api/admin/booking/attendance.json.js", _page3],
    ["src/pages/api/admin/enquiries.json.js", _page4],
    ["src/pages/api/admin/enquiry/presli_confirm.json.js", _page5],
    ["src/pages/api/admin/secretary.json.js", _page6],
    ["src/pages/api/booking/cancel.json.js", _page7],
    ["src/pages/api/booking.json.js", _page8],
    ["src/pages/api/enquiry.js", _page9],
    ["src/pages/api/enquiry.json.js", _page10],
    ["src/pages/booking.astro", _page11],
    ["src/pages/bookings.astro", _page12],
    ["src/pages/codes_of_conduct/[slug].astro", _page13],
    ["src/pages/codes_of_conduct.astro", _page14],
    ["src/pages/contact.astro", _page15],
    ["src/pages/enquiry.astro", _page16],
    ["src/pages/fixtures.astro", _page17],
    ["src/pages/policies/constitution.astro", _page18],
    ["src/pages/policies/[slug].astro", _page19],
    ["src/pages/policies.astro", _page20],
    ["src/pages/records/masters.astro", _page21],
    ["src/pages/records/senior.astro", _page22],
    ["src/pages/records/u11.astro", _page23],
    ["src/pages/records/u13.astro", _page24],
    ["src/pages/records/u15.astro", _page25],
    ["src/pages/records/u17.astro", _page26],
    ["src/pages/records/u20.astro", _page27],
    ["src/pages/records.astro", _page28],
    ["src/pages/style-guide.astro", _page29],
    ["src/pages/volunteering.astro", _page30],
    ["src/pages/index.astro", _page31]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
