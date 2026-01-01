globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Dl2fI4g-.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DCnyML-Y.mjs';
import { d as directus } from '../../chunks/directus_n6SNjG7m.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_KnGPrR4n.mjs';

const $$Masters = createComponent(async ($$result, $$props, $$slots) => {
  let records = [];
  try {
    if (directus) {
      const response = await directus.items("records").readMany({
        filter: { ageGroup: { _eq: "masters" } },
        fields: ["athlete", "event", "result", "date"],
        limit: 10
      });
      records = response?.data ?? [];
    }
  } catch (err) {
    const dummyData = await import('../../chunks/dummy-records_B9GHlqtF.mjs');
    records = dummyData.default.filter(
      (record) => record.ageGroup === "masters"
    );
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width:1000px;margin:0 auto;padding:0 1.5rem;"> <section style="text-align:center;padding:3rem 0 2rem 0;"> <h1 style="font-size:3rem;font-weight:900;color:var(--blue);margin-bottom:0.8rem;text-transform:uppercase;letter-spacing:0.02em;">
Masters Records
</h1> <p style="color:var(--dark-gray);margin-bottom:2.5rem;font-size:1.2rem;font-weight:600;">
Records for Masters age group
</p> <div class="card" style="overflow:hidden;"> <table style="width:100%;border-collapse:collapse;"> <thead style="background:var(--blue);"> <tr> <th style="padding:1rem 1.2rem;font-size:1.1rem;color:var(--white);font-weight:800;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.03em;text-align:left;">Athlete</th> <th style="padding:1rem 1.2rem;font-size:1.1rem;color:var(--white);font-weight:800;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.03em;text-align:left;">Event</th> <th style="padding:1rem 1.2rem;font-size:1.1rem;color:var(--white);font-weight:800;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.03em;text-align:left;">Result</th> <th style="padding:1rem 1.2rem;font-size:1.1rem;color:var(--white);font-weight:800;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.03em;text-align:left;">Date</th> </tr> </thead> <tbody> ${records === null ? renderTemplate`<tr> <td colspan="4" style="text-align:center;color:#e00;padding:2rem;font-size:1.05rem;">
Error loading records.
</td> </tr>` : records.length === 0 ? renderTemplate`<tr> <td colspan="4" style="text-align:center;color:#aaa;padding:2rem;font-size:1.05rem;">
No records found.
</td> </tr>` : (records ?? []).map((record, idx) => renderTemplate`<tr${addAttribute(`background:${idx % 2 === 0 ? "var(--white)" : "var(--muted-2)"};transition:background 0.2s;`, "style")}${addAttribute(`this.style.background='var(--muted-3)'`, "onmouseover")}${addAttribute(`this.style.background='${idx % 2 === 0 ? "var(--white)" : "var(--muted-2)"}'`, "onmouseout")}> <td style="padding:1rem 1.2rem;border-bottom:1px solid var(--muted);font-family:'Open Sans',sans-serif;font-weight:600;color:var(--dark-gray);"> ${record.athlete} </td> <td style="padding:1rem 1.2rem;border-bottom:1px solid var(--muted);font-family:'Open Sans',sans-serif;color:var(--dark-gray);"> ${record.event} </td> <td style="padding:1rem 1.2rem;border-bottom:1px solid var(--muted);font-family:'Open Sans',sans-serif;font-weight:700;color:var(--yellow);"> ${record.result} </td> <td style="padding:1rem 1.2rem;border-bottom:1px solid var(--muted);font-family:'Open Sans',sans-serif;color:var(--dark-gray);"> ${record.date} </td> </tr>`)} </tbody> </table> </div> </section> </div> ` })}`;
}, "/home/eddie/athletics/egac_1/src/pages/records/masters.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/records/masters.astro";
const $$url = "/records/masters";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Masters,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
