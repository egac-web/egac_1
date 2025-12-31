globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, n as renderHead, l as renderScript, r as renderTemplate } from '../../chunks/astro/server_Dl2fI4g-.mjs';
/* empty css                                      */
export { r as renderers } from '../../chunks/_@astro-renderers_KnGPrR4n.mjs';

const $$Members = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<head><title>Admin — Enquiries & Bookings</title>${renderHead()}</head> <main class="page page--narrow"> <h1>Admin — Enquiries & Bookings</h1> <p>This page is protected by an admin token. Enter it below.</p> <div> <label for="admintoken">Admin token</label> <input id="admintoken" type="password"> <button id="login">Load data</button> </div> <div id="status"></div> <div id="data"></div> </main> ${renderScript($$result, "/home/eddie/athletics/egac_1/src/pages/admin/members.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/eddie/athletics/egac_1/src/pages/admin/members.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/admin/members.astro";
const $$url = "/admin/members";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Members,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
