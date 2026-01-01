globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../../chunks/astro/server_Dl2fI4g-.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DCnyML-Y.mjs';
import { d as directus } from '../../chunks/directus_n6SNjG7m.mjs';
import { n } from '../../chunks/items_DNLj5PMx.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_KnGPrR4n.mjs';

const $$Constitution = createComponent(async ($$result, $$props, $$slots) => {
  let constitution = null;
  try {
    const response = await directus.request(
      n("policies", {
        filter: { slug: { _eq: "constitution" } },
        limit: 1
      })
    );
    console.log("Directus response:", response);
    constitution = response && response.length > 0 ? response[0] : null;
    if (constitution) {
      console.log("Fetched constitution:", constitution);
    }
  } catch (e) {
    console.error("Directus fetch error:", e);
    constitution = null;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:900px;margin:0 auto;padding:0 1.5rem;"> <section style="padding:3rem 0 2rem 0;"> <h1 class="egac-section-title">${constitution ? constitution.policy_title : "Constitution"}</h1> ${constitution && constitution.policy_content ? renderTemplate`<div>${unescapeHTML(constitution.policy_content)}</div>` : renderTemplate`<p>Constitution not found.</p>`} </section> </div> ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/policies/constitution.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/policies/constitution.astro";
const $$url = "/policies/constitution";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Constitution,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
