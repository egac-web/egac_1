globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_BTUeEnL1.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Bqej9wV_.mjs';
import { manifest } from './manifest_CuJZDFVE.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/academy-response.astro.mjs');
const _page3 = () => import('./pages/admin/members.astro.mjs');
const _page4 = () => import('./pages/api/admin/academy/invite.json.astro.mjs');
const _page5 = () => import('./pages/api/admin/booking/attendance.json.astro.mjs');
const _page6 = () => import('./pages/api/admin/booking/resend-secretary.json.astro.mjs');
const _page7 = () => import('./pages/api/admin/booking/resend-secretary.test.astro.mjs');
const _page8 = () => import('./pages/api/admin/config.json.astro.mjs');
const _page9 = () => import('./pages/api/admin/enquiries.json.astro.mjs');
const _page10 = () => import('./pages/api/admin/enquiry/presli_confirm.json.astro.mjs');
const _page11 = () => import('./pages/api/admin/invite-stats.json.astro.mjs');
const _page12 = () => import('./pages/api/admin/retry-invites.json.astro.mjs');
const _page13 = () => import('./pages/api/admin/run-e2e.json.astro.mjs');
const _page14 = () => import('./pages/api/admin/secretary.json.astro.mjs');
const _page15 = () => import('./pages/api/admin/send-reminders.json.astro.mjs');
const _page16 = () => import('./pages/api/admin/templates/preview.json.astro.mjs');
const _page17 = () => import('./pages/api/admin/templates/send.json.astro.mjs');
const _page18 = () => import('./pages/api/admin/templates.json.astro.mjs');
const _page19 = () => import('./pages/api/booking/cancel.json.astro.mjs');
const _page20 = () => import('./pages/api/booking.json.astro.mjs');
const _page21 = () => import('./pages/api/enquiry.astro.mjs');
const _page22 = () => import('./pages/api/enquiry.json.astro.mjs');
const _page23 = () => import('./pages/api/enquiry.test.astro.mjs');
const _page24 = () => import('./pages/api/test-post.astro.mjs');
const _page25 = () => import('./pages/booking.astro.mjs');
const _page26 = () => import('./pages/bookings.astro.mjs');
const _page27 = () => import('./pages/codes_of_conduct/_slug_.astro.mjs');
const _page28 = () => import('./pages/codes_of_conduct.astro.mjs');
const _page29 = () => import('./pages/contact.astro.mjs');
const _page30 = () => import('./pages/enquiry.astro.mjs');
const _page31 = () => import('./pages/fixtures.astro.mjs');
const _page32 = () => import('./pages/policies/constitution.astro.mjs');
const _page33 = () => import('./pages/policies/_slug_.astro.mjs');
const _page34 = () => import('./pages/policies.astro.mjs');
const _page35 = () => import('./pages/records/masters.astro.mjs');
const _page36 = () => import('./pages/records/senior.astro.mjs');
const _page37 = () => import('./pages/records/u11.astro.mjs');
const _page38 = () => import('./pages/records/u13.astro.mjs');
const _page39 = () => import('./pages/records/u15.astro.mjs');
const _page40 = () => import('./pages/records/u17.astro.mjs');
const _page41 = () => import('./pages/records/u20.astro.mjs');
const _page42 = () => import('./pages/records.astro.mjs');
const _page43 = () => import('./pages/style-guide.astro.mjs');
const _page44 = () => import('./pages/volunteering.astro.mjs');
const _page45 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/@astrojs+cloudflare@12.6.12_@types+node@25.0.3_astro@5.16.6_@types+node@25.0.3_rollup@4_848e0e8ca906953991319b1273becdbd/node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/academy-response.astro", _page2],
    ["src/pages/admin/members.astro", _page3],
    ["src/pages/api/admin/academy/invite.json.js", _page4],
    ["src/pages/api/admin/booking/attendance.json.js", _page5],
    ["src/pages/api/admin/booking/resend-secretary.json.js", _page6],
    ["src/pages/api/admin/booking/resend-secretary.test.js", _page7],
    ["src/pages/api/admin/config.json.js", _page8],
    ["src/pages/api/admin/enquiries.json.js", _page9],
    ["src/pages/api/admin/enquiry/presli_confirm.json.js", _page10],
    ["src/pages/api/admin/invite-stats.json.js", _page11],
    ["src/pages/api/admin/retry-invites.json.js", _page12],
    ["src/pages/api/admin/run-e2e.json.js", _page13],
    ["src/pages/api/admin/secretary.json.js", _page14],
    ["src/pages/api/admin/send-reminders.json.js", _page15],
    ["src/pages/api/admin/templates/preview.json.js", _page16],
    ["src/pages/api/admin/templates/send.json.js", _page17],
    ["src/pages/api/admin/templates.json.js", _page18],
    ["src/pages/api/booking/cancel.json.js", _page19],
    ["src/pages/api/booking.json.js", _page20],
    ["src/pages/api/enquiry.js", _page21],
    ["src/pages/api/enquiry.json.js", _page22],
    ["src/pages/api/enquiry.test.js", _page23],
    ["src/pages/api/test-post.js", _page24],
    ["src/pages/booking.astro", _page25],
    ["src/pages/bookings.astro", _page26],
    ["src/pages/codes_of_conduct/[slug].astro", _page27],
    ["src/pages/codes_of_conduct.astro", _page28],
    ["src/pages/contact.astro", _page29],
    ["src/pages/enquiry.astro", _page30],
    ["src/pages/fixtures.astro", _page31],
    ["src/pages/policies/constitution.astro", _page32],
    ["src/pages/policies/[slug].astro", _page33],
    ["src/pages/policies.astro", _page34],
    ["src/pages/records/masters.astro", _page35],
    ["src/pages/records/senior.astro", _page36],
    ["src/pages/records/u11.astro", _page37],
    ["src/pages/records/u13.astro", _page38],
    ["src/pages/records/u15.astro", _page39],
    ["src/pages/records/u17.astro", _page40],
    ["src/pages/records/u20.astro", _page41],
    ["src/pages/records.astro", _page42],
    ["src/pages/style-guide.astro", _page43],
    ["src/pages/volunteering.astro", _page44],
    ["src/pages/index.astro", _page45]
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
