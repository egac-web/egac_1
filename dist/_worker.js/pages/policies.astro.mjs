globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_BJplAL8L.mjs';
import { $ as $$Layout } from '../chunks/Layout_BIprt-IE.mjs';
import { $ as $$Card } from '../chunks/Card_sKqGNxV1.mjs';
import { g as getDirectusClient } from '../chunks/directus_n6SNjG7m.mjs';
import { n } from '../chunks/items_DNLj5PMx.mjs';
/* empty css                                    */
export { r as renderers } from '../chunks/_@astro-renderers_rSKK_bSn.mjs';

const $$Astro = createAstro("https://your-egac-site.pages.dev");
const $$Policies = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Policies;
  let policies = [];
  try {
    const directus = getDirectusClient(Astro2.locals.runtime);
    const response = await directus.request(
      n("policies", {
        filter: { published: { _eq: true } },
        sort: ["policy_title"],
        limit: 50
      })
    );
    policies = response || [];
  } catch (e) {
    policies = [];
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-skfmy273": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:900px;margin:0 auto;padding:0 1.5rem;" data-astro-cid-skfmy273> <section style="padding:3rem 0 2rem 0;" data-astro-cid-skfmy273> <h1 class="egac-section-title" data-astro-cid-skfmy273>Club Policies</h1> <p class="egac-section-lead" data-astro-cid-skfmy273>
Our commitment to safety, inclusion, and good governance
</p> ${renderComponent($$result2, "Card", $$Card, { "class": "card--padded", "title": "Club Policies", "data-astro-cid-skfmy273": true }, { "default": async ($$result3) => renderTemplate` <div style="overflow-x:auto;" data-astro-cid-skfmy273> <table class="egac-policies-table" data-astro-cid-skfmy273> <thead data-astro-cid-skfmy273> <tr data-astro-cid-skfmy273> <th data-astro-cid-skfmy273>Policy / Document</th> <th data-astro-cid-skfmy273>Date Approved</th> <th data-astro-cid-skfmy273>Review Date</th> </tr> </thead> <tbody data-astro-cid-skfmy273> ${policies.length === 0 && renderTemplate`<tr data-astro-cid-skfmy273><td colspan="3" data-astro-cid-skfmy273>No policies found.</td></tr>`} ${policies.map((policy) => renderTemplate`<tr data-astro-cid-skfmy273> <td data-astro-cid-skfmy273> ${policy.slug ? renderTemplate`<a${addAttribute(`/policies/${policy.slug}`, "href")} data-astro-cid-skfmy273>${policy.policy_title}</a>` : policy.policy_title} </td> <td data-astro-cid-skfmy273>${policy.date_approved || ""}</td> <td data-astro-cid-skfmy273>${policy.review_date || ""}</td> </tr>`)} </tbody> </table> </div> <p style="margin-top:2rem;" data-astro-cid-skfmy273>
We regularly review and update our policies to ensure a safe, inclusive, and well-governed club for all members and visitors.
</p> ` })}  </section> </div>  ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/policies.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/policies.astro";
const $$url = "/policies";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Policies,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
