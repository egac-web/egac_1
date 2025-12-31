globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Dl2fI4g-.mjs';
import { $ as $$Layout } from '../chunks/Layout_LDF6ASYP.mjs';
import { $ as $$Card } from '../chunks/Card_2VvAYOxC.mjs';
import { d as directus } from '../chunks/directus_DrGb9q1F.mjs';
import { n } from '../chunks/items_DNLj5PMx.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_KnGPrR4n.mjs';

const $$CodesOfConduct = createComponent(async ($$result, $$props, $$slots) => {
  let codes = [];
  try {
    const response = await directus.request(
      n("codes_of_conduct", {
        filter: { published: { _eq: true } },
        sort: ["title"],
        limit: 50
      })
    );
    codes = response || [];
  } catch (e) {
    codes = [];
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:900px;margin:0 auto;padding:0 1.5rem;"> <section style="padding:3rem 0 2rem 0;"> <h1 class="egac-section-title">Codes of Conduct</h1> ${renderComponent($$result2, "Card", $$Card, { "class": "card--padded", "title": "Codes of Conduct" }, { "default": async ($$result3) => renderTemplate` <div style="overflow-x:auto;"> <table class="egac-policies-table"> <thead> <tr> <th>Title</th> </tr> </thead> <tbody> ${codes.length === 0 && renderTemplate`<tr><td>No codes of conduct found.</td></tr>`} ${codes.map((code) => renderTemplate`<tr> <td> ${code.slug ? renderTemplate`<a${addAttribute(`/codes_of_conduct/${code.slug}`, "href")}>${code.title}</a>` : code.title} </td> </tr>`)} </tbody> </table> </div> ` })} </section> </div> ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/codes_of_conduct.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/codes_of_conduct.astro";
const $$url = "/codes_of_conduct";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CodesOfConduct,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
