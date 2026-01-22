globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BJplAL8L.mjs';
import { $ as $$Layout } from '../chunks/Layout_BIprt-IE.mjs';
import { $ as $$Hero } from '../chunks/Hero_Cq_xy7Pf.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_rSKK_bSn.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:1100px;margin:0 auto;padding:0 1.5rem;"> ${renderComponent($$result2, "Hero", $$Hero, { "overline": "East Grinstead Athletics Club", "subtitle": "Inspiring athletes of all ages to reach their full potential", "primary": { href: "/records", text: "View Records" }, "secondary": { href: "/enquiry", text: "Enquiry" }, "media": "/images/hero-1.svg" }, { "title": ($$result3) => renderTemplate`<span>Performance.<br><span class="accent">Excellence.</span><br>Community.</span>` })} <!-- Sections moved to Your Club page --> </div> ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/index.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
