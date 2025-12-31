globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dl2fI4g-.mjs';
import { $ as $$Layout } from '../chunks/Layout_LDF6ASYP.mjs';
import { $ as $$Card } from '../chunks/Card_2VvAYOxC.mjs';
import { $ as $$EnquiryForm } from '../chunks/EnquiryForm_Ch80n3Fy.mjs';
/* empty css                                   */
export { r as renderers } from '../chunks/_@astro-renderers_KnGPrR4n.mjs';

const title = "Enquiry \u2013 East Grinstead AC";
const $$Enquiry = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Enquiry \u2013 East Grinstead AC", "data-astro-cid-2il4jzm7": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="enquiry-wrapper" data-astro-cid-2il4jzm7> <!-- Hero Section --> <section class="enquiry-hero" data-astro-cid-2il4jzm7> <div class="container" data-astro-cid-2il4jzm7> <h1 data-astro-cid-2il4jzm7>Get in Touch</h1> <p class="hero-subtitle" data-astro-cid-2il4jzm7>
Whether you're interested in joining as an athlete, volunteering, or
          coaching, we'd love to hear from you.
</p> </div> </section> <!-- Main Content --> <section class="enquiry-content" data-astro-cid-2il4jzm7> <div class="container" data-astro-cid-2il4jzm7> <div class="enquiry-grid" data-astro-cid-2il4jzm7> <!-- Info Column --> <div class="enquiry-info" data-astro-cid-2il4jzm7> ${renderComponent($$result2, "Card", $$Card, { "class": "card--padded", "title": "How can we help?", "data-astro-cid-2il4jzm7": true }, { "default": ($$result3) => renderTemplate` <h2 style="margin-top:0;font-size:1.5rem;color:var(--dark-gray);" data-astro-cid-2il4jzm7>
How can we help?
</h2> <p style="color:var(--dark-gray);line-height:1.7;" data-astro-cid-2il4jzm7>
East Grinstead AC welcomes athletes of all ages and abilities.
                Whether you're looking to join as a member, help out at events,
                or learn more about coaching opportunities, we're here to help.
</p> <div class="info-items" data-astro-cid-2il4jzm7> <div class="info-item" data-astro-cid-2il4jzm7> <div class="info-icon" data-astro-cid-2il4jzm7>🏃</div> <div data-astro-cid-2il4jzm7> <h3 data-astro-cid-2il4jzm7>Membership</h3> <p data-astro-cid-2il4jzm7>Join our club and train with us</p> </div> </div> <div class="info-item" data-astro-cid-2il4jzm7> <div class="info-icon" data-astro-cid-2il4jzm7>📋</div> <div data-astro-cid-2il4jzm7> <h3 data-astro-cid-2il4jzm7>Volunteering</h3> <p data-astro-cid-2il4jzm7>Support events and club activities</p> </div> </div> <div class="info-item" data-astro-cid-2il4jzm7> <div class="info-icon" data-astro-cid-2il4jzm7>🎯</div> <div data-astro-cid-2il4jzm7> <h3 data-astro-cid-2il4jzm7>Coaching</h3> <p data-astro-cid-2il4jzm7>Help develop the next generation</p> </div> </div> <div class="info-item" data-astro-cid-2il4jzm7> <div class="info-icon" data-astro-cid-2il4jzm7>⏱️</div> <div data-astro-cid-2il4jzm7> <h3 data-astro-cid-2il4jzm7>Fast Response</h3> <p data-astro-cid-2il4jzm7>We typically reply within 24 hours</p> </div> </div> </div> <div class="alt-contact" data-astro-cid-2il4jzm7> <h3 data-astro-cid-2il4jzm7>Other ways to reach us</h3> <p data-astro-cid-2il4jzm7> <strong data-astro-cid-2il4jzm7>Email:</strong> <a href="mailto:secretary@eastgrinsteadac.co.uk" data-astro-cid-2il4jzm7>secretary@eastgrinsteadac.co.uk</a> </p> <p data-astro-cid-2il4jzm7> <strong data-astro-cid-2il4jzm7>Visit:</strong> Come along to training (Tuesdays & Thursdays,
                  6:30 PM)
</p> </div> ` })} </div> <!-- Form Column --> <div class="enquiry-form-col" data-astro-cid-2il4jzm7> ${renderComponent($$result2, "EnquiryForm", $$EnquiryForm, { "title": "Send us a message", "webhookUrl": "/api/enquiry.json", "showCard": true, "data-astro-cid-2il4jzm7": true })} </div> </div> </div> </section> </div> ` })} `;
}, "/home/eddie/athletics/egac_1/src/pages/enquiry.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/enquiry.astro";
const $$url = "/enquiry";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Enquiry,
  file: $$file,
  title,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
