globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, p as Fragment, u as unescapeHTML } from '../../chunks/astro/server_BJplAL8L.mjs';
import { $ as $$Layout } from '../../chunks/Layout_BIprt-IE.mjs';
import { d as directus } from '../../chunks/directus_n6SNjG7m.mjs';
import { n } from '../../chunks/items_DNLj5PMx.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_rSKK_bSn.mjs';

const $$Astro = createAstro("https://your-egac-site.pages.dev");
async function getStaticPaths() {
  try {
    const response = await directus.request(
      n("policies", {
        filter: { published: { _eq: true } },
        fields: ["slug"]
      })
    );
    return response.map((policy) => ({ params: { slug: policy.slug } }));
  } catch (e) {
    return [];
  }
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  let policy = null;
  try {
    const response = await directus.request(
      n("policies", {
        filter: { slug: { _eq: slug }, published: { _eq: true } },
        limit: 1
      })
    );
    policy = response && response.length > 0 ? response[0] : null;
  } catch (e) {
    policy = null;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:900px;margin:0 auto;padding:0 1.5rem;"> <section style="padding:3rem 0 2rem 0;"> ${policy ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <h1 class="egac-section-title">${policy.policy_title}</h1> <p class="egac-section-lead">${policy.policy_summary || ""}</p> <div class="egac-policy-content">${unescapeHTML(policy.policy_content)}</div> <div style="margin-top:2rem;font-size:0.95em;color:#888;"> <div>Date Approved: ${policy.date_approved || "N/A"}</div> <div>Review Date: ${policy.review_date || "N/A"}</div> </div> ` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <h1>Policy Not Found</h1> <p>The requested policy could not be found or is not published.</p> ` })}`} </section> </div> ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/policies/[slug].astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/policies/[slug].astro";
const $$url = "/policies/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
