globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, an as renderSlot, h as addAttribute, r as renderTemplate } from './astro/server_BJplAL8L.mjs';
/* empty css                         */

const $$Astro = createAstro("https://your-egac-site.pages.dev");
const $$Hero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Hero;
  const {
    overline = "",
    title,
    subtitle = "",
    primary = { href: "/records", text: "View Records" },
    secondary = { href: "/enquiry", text: "Enquiry" },
    media = "/images/hero-1.svg"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="hero" role="region" aria-label="Site hero" data-astro-cid-ezj6hheb> <div class="hero-background" data-astro-cid-ezj6hheb> <div class="gradient-orb orb-1" data-astro-cid-ezj6hheb></div> <div class="gradient-orb orb-2" data-astro-cid-ezj6hheb></div> <div class="gradient-orb orb-3" data-astro-cid-ezj6hheb></div> </div> <div class="hero-content" data-astro-cid-ezj6hheb> ${overline ? renderTemplate`<div class="hero-badge" data-astro-cid-ezj6hheb> <span class="badge-icon" data-astro-cid-ezj6hheb>⚡</span> <span data-astro-cid-ezj6hheb>${overline}</span> </div>` : null} <h1 class="hero-title" data-astro-cid-ezj6hheb>${renderSlot($$result, $$slots["title"], renderTemplate`${title}`)}</h1> ${subtitle ? renderTemplate`<p class="hero-description" data-astro-cid-ezj6hheb>${subtitle}</p>` : null} <div class="hero-cta" data-astro-cid-ezj6hheb> <a${addAttribute(primary.href, "href")} class="btn btn-primary" data-astro-cid-ezj6hheb> ${primary.text} <svg width="20" height="20" viewBox="0 0 20 20" fill="none" data-astro-cid-ezj6hheb> <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-ezj6hheb></path> </svg> </a> <a${addAttribute(secondary.href, "href")} class="btn btn-secondary" data-astro-cid-ezj6hheb> <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-ezj6hheb> <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" data-astro-cid-ezj6hheb></path> <path d="M8 10L10.5 12.5L13 9.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-ezj6hheb></path> </svg> ${secondary.text} </a> </div> <div class="hero-stats" data-astro-cid-ezj6hheb> <div class="stat" data-astro-cid-ezj6hheb> <div class="stat-value" data-astro-cid-ezj6hheb>100+</div> <div class="stat-label" data-astro-cid-ezj6hheb>Members</div> </div> <div class="stat-divider" data-astro-cid-ezj6hheb></div> <div class="stat" data-astro-cid-ezj6hheb> <div class="stat-value" data-astro-cid-ezj6hheb>50+</div> <div class="stat-label" data-astro-cid-ezj6hheb>Years Legacy</div> </div> </div> </div> </section> `;
}, "/home/eddie/athletics/egac_1/src/components/ui/Hero.astro", void 0);

export { $$Hero as $ };
