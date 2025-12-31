globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, an as renderSlot, r as renderTemplate, k as renderComponent } from '../chunks/astro/server_Dl2fI4g-.mjs';
import { $ as $$Layout } from '../chunks/Layout_LDF6ASYP.mjs';
/* empty css                                       */
import { $ as $$Card } from '../chunks/Card_2VvAYOxC.mjs';
import { $ as $$Hero } from '../chunks/Hero_CiD3AGbu.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_KnGPrR4n.mjs';

const $$Astro = createAstro("https://your-egac-site.pages.dev");
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    href,
    variant = "cta",
    type = "button",
    ariaLabel,
    class: extraClass = "",
    size = "md"
  } = Astro2.props;
  const base = variant === "secondary" ? "btn-secondary" : "btn-cta";
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  const classes = `egac-btn btn ${base} ${sizeClass} ${extraClass}`.trim();
  return renderTemplate`${href ? renderTemplate`${maybeRenderHead()}<a${addAttribute(classes, "class")}${addAttribute(href, "href")} role="button"${addAttribute(ariaLabel, "aria-label")} data-astro-cid-6ygtcg62>${renderSlot($$result, $$slots["default"])}</a>` : renderTemplate`<button${addAttribute(classes, "class")}${addAttribute(type, "type")}${addAttribute(ariaLabel, "aria-label")} data-astro-cid-6ygtcg62>${renderSlot($$result, $$slots["default"])}</button>`}`;
}, "/home/eddie/athletics/egac_1/src/components/ui/Button.astro", void 0);

const $$StyleGuide = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:1100px;margin:0 auto;padding:2rem;"> <h1 style="margin-bottom:1rem;">Style Guide</h1> <h2>Hero</h2> ${renderComponent($$result2, "Hero", $$Hero, { "overline": "Style guide", "title": "Hero component demo \u2014 Accent", "subtitle": "Subtitle and supporting text" })} <h2 style="margin-top:2rem;">Buttons</h2> <h3 style="font-size:1.4rem;margin-top:1.5rem;margin-bottom:0.75rem;">Variants</h3> <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;"> ${renderComponent($$result2, "Button", $$Button, { "href": "#", "variant": "cta" }, { "default": ($$result3) => renderTemplate`CTA Button` })} ${renderComponent($$result2, "Button", $$Button, { "href": "#", "variant": "secondary" }, { "default": ($$result3) => renderTemplate`Secondary Button` })} ${renderComponent($$result2, "Button", $$Button, { "href": "#", "variant": "secondary", "class": "btn-ghost-secondary" }, { "default": ($$result3) => renderTemplate`Ghost Secondary` })} </div> <h3 style="font-size:1.4rem;margin-top:1.5rem;margin-bottom:0.75rem;">Sizes</h3> <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;"> ${renderComponent($$result2, "Button", $$Button, { "href": "#", "variant": "cta", "size": "sm" }, { "default": ($$result3) => renderTemplate`Small CTA` })} ${renderComponent($$result2, "Button", $$Button, { "href": "#", "variant": "cta" }, { "default": ($$result3) => renderTemplate`Medium CTA` })} ${renderComponent($$result2, "Button", $$Button, { "href": "#", "variant": "cta", "size": "lg" }, { "default": ($$result3) => renderTemplate`Large CTA` })} </div> <h2 style="margin-top:2rem;">Cards</h2> <h3 style="font-size:1.4rem;margin-top:1.5rem;margin-bottom:0.75rem;">Standard Cards</h3> <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;margin-top:1rem;"> ${renderComponent($$result2, "Card", $$Card, { "title": "Card sample", "image": "/images/card-about.svg" }, { "default": ($$result3) => renderTemplate`This is a card body explaining something important.` })} ${renderComponent($$result2, "Card", $$Card, { "title": "Another", "image": "/images/card-training.svg" }, { "default": ($$result3) => renderTemplate`Quick stat or blurb goes here.` })} </div> <h3 style="font-size:1.4rem;margin-top:1.5rem;margin-bottom:0.75rem;">Card Sizes</h3> <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-top:1rem;"> ${renderComponent($$result2, "Card", $$Card, { "title": "Small Card", "size": "sm", "image": "/images/card-about.svg" }, { "default": ($$result3) => renderTemplate`Compact card for less important content.` })} ${renderComponent($$result2, "Card", $$Card, { "title": "Medium Card", "image": "/images/card-training.svg" }, { "default": ($$result3) => renderTemplate`Default size, good for most use cases.` })} ${renderComponent($$result2, "Card", $$Card, { "title": "Large Card", "size": "lg", "image": "/images/card-about.svg" }, { "default": ($$result3) => renderTemplate`Highlighted content or featured sections.` })} </div> </div> ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/style-guide.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/style-guide.astro";
const $$url = "/style-guide";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$StyleGuide,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
