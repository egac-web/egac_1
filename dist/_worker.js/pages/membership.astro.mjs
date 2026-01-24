globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, r as renderTemplate, an as renderHead } from '../chunks/astro/server_BcA0Y13i.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_CjgTivB9.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Membership = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html> <head><title>Membership Enrollment</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css">', `</head> <body> <main class="page page--narrow"> <h1>Membership Enrollment</h1> <div id="status"></div> <div id="form-root">Loading...</div> </main> <script type="module">
      const status = document.getElementById('status');
      const root = document.getElementById('form-root');
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      async function init(){
        if(!token){ status.innerHTML = '<p class="status-error">Missing token</p>'; return; }
        try{
          const res = await fetch(\`/api/membership.json?token=\${encodeURIComponent(token)}\`);
          const json = await res.json();
          if(!json.ok){ status.innerHTML = \`<p class="status-error">\${json.error}</p>\`; return; }
          const { enquiry, invite_id } = json;
          renderForm(enquiry, invite_id);
        }catch(e){ status.innerHTML = '<p class="status-error">Connection error</p>'; }
      }

      function renderForm(enquiry, inviteId){
        root.innerHTML = \`
          <section>
            <h2>Athlete details</h2>
            <label>First name<input id="first" value="\${enquiry.name?enquiry.name.split(' ')[0]||'' : ''}"></label>
            <label>Last name<input id="last" value="\${enquiry.name?enquiry.name.split(' ').slice(1).join(' ')||'' : ''}"></label>
            <label>Email<input id="email" value="\${enquiry.email||''}"></label>
            <label>Mobile<input id="mobile" value="\${enquiry.phone||''}"></label>
          </section>
          <section>
            <h2>Medical</h2>
            <label>Medication<textarea id="med"></textarea></label>
            <label>Illnesses<textarea id="ill"></textarea></label>
            <label>Allergies<textarea id="all"></textarea></label>
          </section>
          <section>
            <h2>Emergency contact</h2>
            <label>Name<input id="ec-name"></label>
            <label>Mobile<input id="ec-mobile"></label>
            <label>Relationship<input id="ec-rel"></label>
          </section>
          <section>
            <label><input type="checkbox" id="consent"> I agree to the club policies</label>
          </section>
          <section>
            <h2>Verification</h2>
            <p>We have sent a verification code to <strong>\${enquiry.email}</strong>. Enter it here to proceed.</p>
            <label>Code<input id="otp"></label>
          </section>
          <div style="margin-top:1rem"><button id="submit">Submit</button></div>
        \`;

        document.getElementById('submit').addEventListener('click', async () => {
          const payload = {
            invite_id: inviteId,
            otp_code: document.getElementById('otp').value,
            form: {
              first_name: document.getElementById('first').value,
              last_name: document.getElementById('last').value,
              email: document.getElementById('email').value,
              phone: document.getElementById('mobile').value,
              medication: document.getElementById('med').value,
              illnesses: document.getElementById('ill').value,
              allergies: document.getElementById('all').value,
              emergency_contact: {
                name: document.getElementById('ec-name').value,
                phone: document.getElementById('ec-mobile').value,
                relationship: document.getElementById('ec-rel').value,
              },
            }
          };
          const res = await fetch('/api/membership.json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const json = await res.json();
          if(json.ok){ root.innerHTML = '<p class="status-success">Membership confirmed. Thank you!</p>'; }
          else root.innerHTML = \`<p class="status-error">\${json.error}</p>\`;
        });
      }

      init();
    <\/script> </body> </html>`], ['<html> <head><title>Membership Enrollment</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css">', `</head> <body> <main class="page page--narrow"> <h1>Membership Enrollment</h1> <div id="status"></div> <div id="form-root">Loading...</div> </main> <script type="module">
      const status = document.getElementById('status');
      const root = document.getElementById('form-root');
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      async function init(){
        if(!token){ status.innerHTML = '<p class="status-error">Missing token</p>'; return; }
        try{
          const res = await fetch(\\\`/api/membership.json?token=\\\${encodeURIComponent(token)}\\\`);
          const json = await res.json();
          if(!json.ok){ status.innerHTML = \\\`<p class="status-error">\\\${json.error}</p>\\\`; return; }
          const { enquiry, invite_id } = json;
          renderForm(enquiry, invite_id);
        }catch(e){ status.innerHTML = '<p class="status-error">Connection error</p>'; }
      }

      function renderForm(enquiry, inviteId){
        root.innerHTML = \\\`
          <section>
            <h2>Athlete details</h2>
            <label>First name<input id="first" value="\\\${enquiry.name?enquiry.name.split(' ')[0]||'' : ''}"></label>
            <label>Last name<input id="last" value="\\\${enquiry.name?enquiry.name.split(' ').slice(1).join(' ')||'' : ''}"></label>
            <label>Email<input id="email" value="\\\${enquiry.email||''}"></label>
            <label>Mobile<input id="mobile" value="\\\${enquiry.phone||''}"></label>
          </section>
          <section>
            <h2>Medical</h2>
            <label>Medication<textarea id="med"></textarea></label>
            <label>Illnesses<textarea id="ill"></textarea></label>
            <label>Allergies<textarea id="all"></textarea></label>
          </section>
          <section>
            <h2>Emergency contact</h2>
            <label>Name<input id="ec-name"></label>
            <label>Mobile<input id="ec-mobile"></label>
            <label>Relationship<input id="ec-rel"></label>
          </section>
          <section>
            <label><input type="checkbox" id="consent"> I agree to the club policies</label>
          </section>
          <section>
            <h2>Verification</h2>
            <p>We have sent a verification code to <strong>\\\${enquiry.email}</strong>. Enter it here to proceed.</p>
            <label>Code<input id="otp"></label>
          </section>
          <div style="margin-top:1rem"><button id="submit">Submit</button></div>
        \\\`;

        document.getElementById('submit').addEventListener('click', async () => {
          const payload = {
            invite_id: inviteId,
            otp_code: document.getElementById('otp').value,
            form: {
              first_name: document.getElementById('first').value,
              last_name: document.getElementById('last').value,
              email: document.getElementById('email').value,
              phone: document.getElementById('mobile').value,
              medication: document.getElementById('med').value,
              illnesses: document.getElementById('ill').value,
              allergies: document.getElementById('all').value,
              emergency_contact: {
                name: document.getElementById('ec-name').value,
                phone: document.getElementById('ec-mobile').value,
                relationship: document.getElementById('ec-rel').value,
              },
            }
          };
          const res = await fetch('/api/membership.json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const json = await res.json();
          if(json.ok){ root.innerHTML = '<p class="status-success">Membership confirmed. Thank you!</p>'; }
          else root.innerHTML = \\\`<p class="status-error">\\\${json.error}</p>\\\`;
        });
      }

      init();
    <\/script> </body> </html>`])), renderHead());
}, "/home/eddie/athletics/egac_1/src/pages/membership.astro", void 0);

const $$file = "/home/eddie/athletics/egac_1/src/pages/membership.astro";
const $$url = "/membership";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Membership,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
