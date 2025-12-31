globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dl2fI4g-.mjs';
import { $ as $$Layout } from '../chunks/Layout_LDF6ASYP.mjs';
import { $ as $$Card } from '../chunks/Card_2VvAYOxC.mjs';
/* empty css                                    */
export { r as renderers } from '../chunks/_@astro-renderers_KnGPrR4n.mjs';

const $$Fixtures = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-mbfrdlfs": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:900px;margin:0 auto;padding:0 1.5rem;" data-astro-cid-mbfrdlfs> <section style="padding:3rem 0 2rem 0;" data-astro-cid-mbfrdlfs> <h1 class="egac-section-title" data-astro-cid-mbfrdlfs>Fixtures</h1> <p class="egac-section-lead" data-astro-cid-mbfrdlfs>
Upcoming events and competitions for all club members
</p> ${renderComponent($$result2, "Card", $$Card, { "class": "card--padded", "title": "2024 Fixtures", "data-astro-cid-mbfrdlfs": true }, { "default": ($$result3) => renderTemplate` <ul style="margin:0;padding:0 0 0 1.2em;" data-astro-cid-mbfrdlfs> <li data-astro-cid-mbfrdlfs>April 14: Sussex League, Brighton</li> <li data-astro-cid-mbfrdlfs>May 5: Southern Athletics League, Crawley</li> <li data-astro-cid-mbfrdlfs>June 2: Youth Development League, Horsham</li> <li data-astro-cid-mbfrdlfs>July 7: Sussex League, Eastbourne</li> <li data-astro-cid-mbfrdlfs>August 18: Southern Athletics League, Lewes</li> <li data-astro-cid-mbfrdlfs>September 8: Club Championships, East Grinstead</li> </ul> ` })} </section> </div>  ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/fixtures.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/fixtures.astro";
const $$url = "/fixtures";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Fixtures,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
