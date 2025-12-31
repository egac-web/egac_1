globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dl2fI4g-.mjs';
import { $ as $$Layout } from '../chunks/Layout_LDF6ASYP.mjs';
import { $ as $$Card } from '../chunks/Card_2VvAYOxC.mjs';
/* empty css                                   */
export { r as renderers } from '../chunks/_@astro-renderers_KnGPrR4n.mjs';

const $$Records = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-q7u7l26j": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:900px;margin:0 auto;padding:0 1.5rem;" data-astro-cid-q7u7l26j> <section style="padding:3rem 0 2rem 0;" data-astro-cid-q7u7l26j> <h1 class="egac-section-title" data-astro-cid-q7u7l26j>Club Records</h1> <p class="egac-section-lead" data-astro-cid-q7u7l26j>
Our all-time best performances across all age groups
</p> ${renderComponent($$result2, "Card", $$Card, { "class": "card--padded", "title": "Records Overview", "data-astro-cid-q7u7l26j": true }, { "default": ($$result3) => renderTemplate` <p data-astro-cid-q7u7l26j>
We celebrate the achievements of our athletes, past and present. Our
          club records are updated regularly and cover all track, field, and
          road events for juniors, seniors, and masters.
</p> <ul style="margin:0;padding:0 0 0 1.2em;" data-astro-cid-q7u7l26j> <li data-astro-cid-q7u7l26j>100m: 10.92s (John Smith, 2019)</li> <li data-astro-cid-q7u7l26j>Long Jump: 6.45m (Jane Doe, 2022)</li> <li data-astro-cid-q7u7l26j>Shot Put: 13.20m (Alex Brown, 2021)</li> <li data-astro-cid-q7u7l26j>5K Road: 15:32 (Chris Green, 2023)</li> </ul> <p data-astro-cid-q7u7l26j>
For the full list, see our <a href="/club_records_mgmt.md" style="color:var(--blue);text-decoration:underline;" data-astro-cid-q7u7l26j>records management page</a>.
</p> ` })} </section> </div>  ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/records.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/records.astro";
const $$url = "/records";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Records,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
