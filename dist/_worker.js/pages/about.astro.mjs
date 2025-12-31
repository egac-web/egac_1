globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript, u as unescapeHTML } from '../chunks/astro/server_Dl2fI4g-.mjs';
import { $ as $$Layout } from '../chunks/Layout_LDF6ASYP.mjs';
import { $ as $$Card } from '../chunks/Card_2VvAYOxC.mjs';
import { d as directus } from '../chunks/directus_DrGb9q1F.mjs';
import { n } from '../chunks/items_DNLj5PMx.mjs';
/* empty css                                 */
export { r as renderers } from '../chunks/_@astro-renderers_KnGPrR4n.mjs';

const $$About = createComponent(async ($$result, $$props, $$slots) => {
  let aboutArticles = [];
  let mainArticle = null;
  try {
    const response = await directus.request(
      n("about", {
        filter: { status: { _eq: "published" } },
        sort: ["id"],
        limit: 10
      })
    );
    aboutArticles = response || [];
    mainArticle = aboutArticles.find((a) => ["about-us", "about_us", "about"].includes(a.slug)) || aboutArticles[0] || null;
  } catch (e) {
    console.error("Error fetching about articles:", e);
    aboutArticles = [];
    mainArticle = null;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-kh7btl4r": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:900px;margin:0 auto;padding:0 1.5rem;" data-astro-cid-kh7btl4r> <section style="padding:3rem 0 2rem 0;" data-astro-cid-kh7btl4r> <h1 class="egac-section-title" data-astro-cid-kh7btl4r>Your Club</h1> <p class="egac-section-lead" data-astro-cid-kh7btl4r>
Discover our history, training locations, Academy, and how to join East Grinstead AC.
</p> ${mainArticle ? renderTemplate`${renderComponent($$result2, "Card", $$Card, { "class": "card--padded", "title": mainArticle.title, "data-astro-cid-kh7btl4r": true }, { "default": async ($$result3) => renderTemplate` <div data-astro-cid-kh7btl4r>${unescapeHTML(mainArticle.content)}</div> ` })}` : (
    // fallback: show first about article if none match expected slugs
    aboutArticles.length > 0 ? renderTemplate`${renderComponent($$result2, "Card", $$Card, { "class": "card--padded", "title": aboutArticles[0].title, "data-astro-cid-kh7btl4r": true }, { "default": async ($$result3) => renderTemplate` <div data-astro-cid-kh7btl4r>${unescapeHTML(aboutArticles[0].content)}</div> ` })}` : renderTemplate`${renderComponent($$result2, "Card", $$Card, { "class": "card--padded", "title": "About", "data-astro-cid-kh7btl4r": true }, { "default": async ($$result3) => renderTemplate` <div data-astro-cid-kh7btl4r>About content is not available.</div> ` })}`
  )} <div class="your-club-tabs" data-astro-cid-kh7btl4r> <!-- CSS-only radio inputs for tabs (avoids CSP/js issues) --> <input type="radio" name="about-tabs" id="tab-radio-locations" class="tab-radio" checked hidden data-astro-cid-kh7btl4r> <input type="radio" name="about-tabs" id="tab-radio-academy" class="tab-radio" hidden data-astro-cid-kh7btl4r> <input type="radio" name="about-tabs" id="tab-radio-fees" class="tab-radio" hidden data-astro-cid-kh7btl4r> <div class="tab-list" role="tablist" data-astro-cid-kh7btl4r> <label class="tab-btn" for="tab-radio-locations" id="tab-locations" role="tab" aria-controls="panel-locations" tabindex="0" data-astro-cid-kh7btl4r>Training Locations</label> <label class="tab-btn" for="tab-radio-academy" id="tab-academy" role="tab" aria-controls="panel-academy" tabindex="-1" data-astro-cid-kh7btl4r>Academy</label> <label class="tab-btn" for="tab-radio-fees" id="tab-fees" role="tab" aria-controls="panel-fees" tabindex="-1" data-astro-cid-kh7btl4r>Membership & Fees</label> </div> <div class="tab-panels" data-astro-cid-kh7btl4r> <div class="tab-panel" id="panel-locations" role="tabpanel" aria-labelledby="tab-locations" data-astro-cid-kh7btl4r> <div class="tab-content-box" data-astro-cid-kh7btl4r> <h2 class="tab-section-title" data-astro-cid-kh7btl4r>Training Locations</h2> <div class="locations-grid" data-astro-cid-kh7btl4r> <div class="location-card" data-astro-cid-kh7btl4r> <div class="location-info" data-astro-cid-kh7btl4r> <div class="location-name" data-astro-cid-kh7btl4r>Imberhorne Ln</div> <a href="https://maps.google.com/?q=Imberhorne+Ln,+East+Grinstead+RH19+1QY" target="_blank" rel="noopener" class="location-link" data-astro-cid-kh7btl4r>East Grinstead RH19 1QY</a> </div> <div class="location-map-wrap" data-astro-cid-kh7btl4r> <iframe class="location-map" src="https://www.google.com/maps?q=Imberhorne+School,+East+Grinstead+RH19+1QY&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-astro-cid-kh7btl4r></iframe> </div> </div> <div class="location-card" data-astro-cid-kh7btl4r> <div class="location-info" data-astro-cid-kh7btl4r> <div class="location-name" data-astro-cid-kh7btl4r>Lewes Rd</div> <a href="https://maps.google.com/?q=Lewes+Rd,+East+Grinstead+RH19+3TY" target="_blank" rel="noopener" class="location-link" data-astro-cid-kh7btl4r>East Grinstead RH19 3TY</a> </div> <div class="location-map-wrap" data-astro-cid-kh7btl4r> <iframe class="location-map" src="https://www.google.com/maps?q=Sackville+School,+East+Grinstead+RH19+3TY&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-astro-cid-kh7btl4r></iframe> </div> </div> </div> </div> </div> <div class="tab-panel" id="panel-academy" role="tabpanel" aria-labelledby="tab-academy" data-astro-cid-kh7btl4r> <div class="tab-content-box" data-astro-cid-kh7btl4r> <h2 class="tab-section-title" data-astro-cid-kh7btl4r>Academy</h2> ${aboutArticles.filter((a) => a.slug === "academy").map((article) => renderTemplate`<div data-astro-cid-kh7btl4r>${unescapeHTML(article.content)}</div>`)} </div> </div> <div class="tab-panel" id="panel-fees" role="tabpanel" aria-labelledby="tab-fees" data-astro-cid-kh7btl4r> <div class="tab-content-box" data-astro-cid-kh7btl4r> ${aboutArticles.filter((a) => a.slug === "membership-fees").map((article) => renderTemplate`<div data-astro-cid-kh7btl4r>${unescapeHTML(article.content)}</div>`)} </div> </div> </div> </div> ${renderScript($$result2, "/home/eddie/athletics/egac_1/src/pages/about.astro?astro&type=script&index=0&lang.ts")} </section> </div>   ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/about.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
