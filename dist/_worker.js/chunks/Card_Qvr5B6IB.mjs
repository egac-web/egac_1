globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, an as renderSlot, m as maybeRenderHead, h as addAttribute } from './astro/server_D9mQmrFP.mjs';
/* empty css                           */

const $$Astro = createAstro("https://your-egac-site.pages.dev");
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Card;
  const {
    href,
    title,
    image,
    imageAlt = "",
    size = "md",
    class: className = ""
  } = Astro2.props;
  const Tag = href ? "a" : "div";
  const sizeClass = size !== "md" ? `card-${size}` : "";
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "class": `egac-card card ${href ? "card-link" : ""} ${sizeClass} ${className}`.trim(), "data-astro-cid-dd5txfcy": true }, { "default": ($$result2) => renderTemplate`${image && renderTemplate`${maybeRenderHead()}<img class="card-image"${addAttribute(image, "src")}${addAttribute(imageAlt, "alt")} data-astro-cid-dd5txfcy>`}<h3 class="card-title" data-astro-cid-dd5txfcy>${title}</h3> <div class="card-body" data-astro-cid-dd5txfcy>${renderSlot($$result2, $$slots["default"])}</div> ` })} `;
}, "/home/eddie/athletics/egac_1/src/components/ui/Card.astro", void 0);

export { $$Card as $ };
