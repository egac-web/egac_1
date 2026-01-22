globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BJplAL8L.mjs';
import { $ as $$Layout } from '../chunks/Layout_BIprt-IE.mjs';
import { $ as $$Card } from '../chunks/Card_sKqGNxV1.mjs';
/* empty css                                   */
export { r as renderers } from '../chunks/_@astro-renderers_rSKK_bSn.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-uw5kdbxl": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:900px;margin:0 auto;padding:0 1.5rem;" data-astro-cid-uw5kdbxl> <section style="padding:3rem 0 2rem 0;" data-astro-cid-uw5kdbxl> <h1 class="egac-section-title" data-astro-cid-uw5kdbxl>Contact Us</h1> <p class="egac-section-lead" data-astro-cid-uw5kdbxl>Get in touch with East Grinstead AC</p> ${renderComponent($$result2, "Card", $$Card, { "class": "card--padded", "title": "Contact Details", "data-astro-cid-uw5kdbxl": true }, { "default": ($$result3) => renderTemplate` <p data-astro-cid-uw5kdbxl>
Email: <a href="mailto:info@egac.org.uk" style="color:var(--blue);text-decoration:underline;" data-astro-cid-uw5kdbxl>info@egac.org.uk</a> </p> <p data-astro-cid-uw5kdbxl>Training Venue: Imberhorne Upper School, East Grinstead, RH19 1QY</p> <p data-astro-cid-uw5kdbxl>Club Secretary: Jane Doe</p> <p data-astro-cid-uw5kdbxl>
For membership, volunteering, or general enquiries, please use the
          email above or speak to a committee member at training.
</p> ` })} </section> </div>  ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/contact.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
