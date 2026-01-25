const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/TemplateEditor.CPZ8qlgL.js","_astro/jsx-runtime.D_zvdyIk.js","_astro/index.CT7zvmi-.js","_astro/index.B0_VcSax.js","_astro/index.CjfU_FF1.js","_astro/client.Dcn0vcCG.js"])))=>i.map(i=>d[i]);
const J="modulepreload",U=function(e){return"/"+e},N={},M=function(n,i,t){let o=Promise.resolve();if(i&&i.length>0){let a=function(d){return Promise.all(d.map(l=>Promise.resolve(l).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=r?.nonce||r?.getAttribute("nonce");o=a(i.map(d=>{if(d=U(d),d in N)return;N[d]=!0;const l=d.endsWith(".css"),u=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${u}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":J,l||(p.as="script"),p.crossOrigin="",p.href=d,c&&p.setAttribute("nonce",c),document.head.appendChild(p),l)return new Promise((h,$)=>{p.addEventListener("load",h),p.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(a){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=a,window.dispatchEvent(r),!r.defaultPrevented)throw a}return o.then(a=>{for(const r of a||[])r.status==="rejected"&&s(r.reason);return n().catch(s)})};function R(e){try{return!e||!e.trim()?{ok:!0,vars:{}}:{ok:!0,vars:JSON.parse(e)}}catch(n){return{ok:!1,error:n.message}}}function F(e=""){return String(e||"").replace(/<\/?(p|div|br|h[1-6]|li)[^>]*>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/[ \t]+/g," ").replace(/\n\s*\n\s*\n+/g,`

`).trim()}function w(e,n,i,t=!1){if(e.forEach(o=>{const s=o.dataset.tab===i;o.classList.toggle("active",s),o.setAttribute("aria-selected",s?"true":"false"),o.setAttribute("tabindex",s?"0":"-1")}),n.forEach(o=>{const s=o.id===`tab-${i}`;o.style.display=s?"block":"none",o.classList.toggle("active",s),o.setAttribute("aria-hidden",s?"false":"true")}),t){const o=e.find(s=>s.dataset.tab===i);o&&o.focus()}}let m="";const G=new URLSearchParams(window.location.search),D=G.get("token"),z=sessionStorage.getItem("adminToken");D?(document.getElementById("admintoken").value=D,setTimeout(()=>document.getElementById("login-btn").click(),100)):z&&(document.getElementById("admintoken").value=z,setTimeout(()=>document.getElementById("login-btn").click(),100));document.getElementById("login-btn").addEventListener("click",async()=>{const e=document.getElementById("admintoken").value;if(!e){v("login-status","Please enter a token","error");return}m=e,v("login-status","Verifying...","info");try{if(!(await(await fetch("/api/admin/enquiries.json",{headers:{"x-admin-token":e}})).json()).ok){v("login-status","Invalid token","error");return}sessionStorage.setItem("adminToken",e),document.getElementById("login-section").style.display="none",document.getElementById("admin-portal").style.display="block";const t=document.getElementById("admin-debug-info"),o=e?e.length>6?e.substring(0,4)+"...":e:"none";if(t.textContent=`Admin UI - feat/admin-ui-polish (token: ${o})`,document.getElementById("admin-open-config").addEventListener("click",()=>setActiveTab("config",!0)),!document.getElementById("admin-logout")){const s=document.createElement("button");s.id="admin-logout",s.className="btn btn-secondary btn-sm",s.style.marginLeft="1rem",s.textContent="Logout",s.addEventListener("click",()=>{sessionStorage.removeItem("adminToken"),location.reload()}),document.querySelector(".admin-tabs").appendChild(s)}V()}catch{v("login-status","Connection error","error")}});const g=Array.from(document.querySelectorAll(".tab-btn")),k=Array.from(document.querySelectorAll(".tab-content"));g.forEach((e,n)=>{e.addEventListener("click",()=>{w(g,k,e.dataset.tab,!0),e.dataset.tab==="academy"?P():e.dataset.tab==="reports"?K():e.dataset.tab==="config"&&Q()}),e.addEventListener("keydown",i=>{if(i.key==="ArrowRight"){const t=g[(n+1)%g.length];w(g,k,t.dataset.tab,!0),i.preventDefault()}else if(i.key==="ArrowLeft"){const t=g[(n-1+g.length)%g.length];w(g,k,t.dataset.tab,!0),i.preventDefault()}else i.key==="Home"?(w(g,k,g[0].dataset.tab,!0),i.preventDefault()):i.key==="End"&&(w(g,k,g[g.length-1].dataset.tab,!0),i.preventDefault())})});w(g,k,document.querySelector(".tab-btn.active")?.dataset.tab||"enquiries");function v(e,n,i="info"){const t=document.getElementById(e);t.innerHTML=`<div class="status-message status-${i}">${n}</div>`}let b=[],f="all";async function V(){const e=document.getElementById("enquiries-list");e.innerHTML="<p>Loading...</p>";try{const i=await(await fetch("/api/admin/enquiries.json",{headers:{"x-admin-token":m}})).json();if(!i.ok){e.innerHTML='<p class="status-error">Failed to load enquiries</p>';return}b=i.enquiries||[],j()}catch{e.innerHTML='<p class="status-error">Connection error</p>'}}function j(){const e=document.getElementById("enquiries-list");let n=`
      <div class="card" style="padding:1rem;margin-bottom:1.5rem;border-left:4px solid #003DA5">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
          <div>
            <h4 style="margin:0 0 0.5rem 0">Filter Enquiries</h4>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
              <button class="btn btn-sm ${f==="all"?"btn-primary":"btn-outline"}" onclick="filterEnquiries('all')">All (${b.length})</button>
              <button class="btn btn-sm ${f==="pending"?"btn-primary":"btn-outline"}" onclick="filterEnquiries('pending')">Pending (${b.filter(t=>(t.status||"pending")==="pending").length})</button>
              <button class="btn btn-sm ${f==="joined"?"btn-primary":"btn-outline"}" onclick="filterEnquiries('joined')">Joined (${b.filter(t=>t.status==="joined").length})</button>
              <button class="btn btn-sm ${f==="not_joined"?"btn-primary":"btn-outline"}" onclick="filterEnquiries('not_joined')">Not Joined (${b.filter(t=>t.status==="not_joined").length})</button>
            </div>
          </div>
          <div style="color:#6b7280;font-size:0.875rem">
            <strong>${b.length}</strong> total enquiries
          </div>
        </div>
      </div>
    `;const i=f==="all"?b:b.filter(t=>(t.status||"pending")===f);i.length===0?n+='<p class="status-info">No enquiries match this filter</p>':(n+='<div style="display:grid;gap:1.5rem">',i.forEach(t=>{const o=O(t.status||"pending"),s=t.dob?H(t.dob):"Unknown";n+=`
          <div class="card" style="padding:1.5rem;border-left:4px solid ${A(t.status||"pending")}">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1rem">
              <div>
                <h3 style="margin:0 0 0.25rem 0;font-size:1.25rem">${t.name||"No name provided"}</h3>
                <div style="color:#6b7280;font-size:0.875rem">${t.email||"No email"}</div>
              </div>
              ${o}
            </div>
            
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1rem;padding:1rem;background:#f9fafb;border-radius:6px">
              <div>
                <div style="font-size:0.75rem;color:#6b7280;text-transform:uppercase;font-weight:600;margin-bottom:0.25rem">Age</div>
                <div style="font-weight:600">${s} years ${t.dob?"(DOB: "+t.dob+")":""}</div>
              </div>
              <div>
                <div style="font-size:0.75rem;color:#6b7280;text-transform:uppercase;font-weight:600;margin-bottom:0.25rem">Events</div>
                <div style="font-weight:600">${(t.events||[]).join(", ")||"Not specified"}</div>
              </div>
              <div>
                <div style="font-size:0.75rem;color:#6b7280;text-transform:uppercase;font-weight:600;margin-bottom:0.25rem">Submitted</div>
                <div style="font-weight:600">${new Date(t.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            ${t.note?`<div style="padding:0.75rem;background:#fef3c7;border-left:3px solid #f59e0b;border-radius:4px;margin-bottom:1rem"><strong>Note:</strong> ${t.note}</div>`:""}
            
            ${Y(t)}
            
            <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #e5e7eb;display:flex;gap:0.5rem;flex-wrap:wrap">
              <button class="btn btn-primary btn-sm" onclick="updateEnquiryStatus('${t.id}', 'joined')">Mark as Joined</button>
              <button class="btn btn-outline btn-sm" onclick="updateEnquiryStatus('${t.id}', 'not_joined')">Mark as Not Joined</button>
              <button class="btn btn-outline btn-sm" onclick="updateEnquiryStatus('${t.id}', 'pending')">Reset to Pending</button>
              <div id="enquiry-status-${t.id}" style="flex:1;text-align:right"></div>
            </div>
          </div>
        `}),n+="</div>"),e.innerHTML=n}window.filterEnquiries=function(e){f=e,j()};function A(e){return{pending:"#f59e0b",joined:"#10b981",not_joined:"#ef4444",contacted:"#3b82f6",no_response:"#6b7280"}[e]||"#6b7280"}function O(e){const n={pending:"Pending",joined:"Joined",not_joined:"Not Joined",contacted:"Contacted",no_response:"No Response"},i=A(e);return`<span style="padding:0.25rem 0.75rem;background:${i}15;color:${i};border-radius:12px;font-size:0.75rem;font-weight:600;border:1px solid ${i}30">${n[e]||e}</span>`}window.updateEnquiryStatus=async function(e,n){const i=document.getElementById(`enquiry-status-${e}`);i.innerHTML='<span class="status-info">Updating...</span>';try{const o=await(await fetch("/api/admin/enquiries.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({action:"update_status",enquiry_id:e,status:n})})).json();if(o.ok){i.innerHTML='<span class="status-success">Updated!</span>';const s=b.find(a=>a.id===e);s&&(s.status=n),setTimeout(()=>j(),500)}else i.innerHTML=`<span class="status-error">${o.error||"Failed"}</span>`}catch(t){i.innerHTML=`<span class="status-error">Error: ${t.message}</span>`}};function Y(e){if(!e.bookings||e.bookings.length===0)return'<div style="padding:0.75rem;background:#f3f4f6;border-radius:6px;color:#6b7280;text-align:center;font-size:0.875rem">No bookings yet</div>';let n='<div style="margin-top:1rem"><h4 style="margin:0 0 0.75rem 0;font-size:0.875rem;color:#374151;text-transform:uppercase;font-weight:700">Taster Session Bookings</h4>';return e.bookings.forEach(i=>{const t=i.status==="attended"?"#10b981":i.status==="no_show"?"#ef4444":"#6b7280";n+=`
        <div class="card" style="padding:1rem;margin-bottom:0.75rem;border-left:3px solid ${t};background:#fafbfc" data-booking-id="${i.id}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
            <div>
              <div style="font-weight:700;color:#1f2937">${i.session_date}</div>
              <div style="font-size:0.875rem;color:#6b7280">${i.slot} · <span style="color:${t};font-weight:600">${i.status||"scheduled"}</span></div>
            </div>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center">
            <button class="btn btn-success btn-sm" onclick="markAttendance('${i.id}', 'attended')">✓ Attended</button>
            <button class="btn btn-danger btn-sm" onclick="markAttendance('${i.id}', 'no_show')">✗ No-Show</button>
            <label style="display:flex;align-items:center;gap:0.375rem;padding:0.375rem 0.75rem;background:white;border-radius:4px;border:1px solid #d1d5db;font-size:0.875rem">
              <input type="checkbox" data-booking="${i.id}"> Send membership link
            </label>
          </div>
          <div id="booking-result-${i.id}" style="margin-top:0.5rem"></div>
        </div>
      `}),n+="</div>",n}window.markAttendance=async function(e,n){const i=document.getElementById(`booking-result-${e}`);i.innerHTML='<p class="status-info">Processing...</p>';const t=document.querySelector(`input[data-booking="${e}"]`)?.checked||!1;try{const s=await(await fetch("/api/admin/booking/attendance.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({booking_id:e,status:n,send_membership_link:t})})).json();s.ok?i.innerHTML=`<p class="status-success">Updated to ${n}${t?" and sent membership link":""}</p>`:i.innerHTML=`<p class="status-error">${s.error||"Failed"}</p>`}catch{i.innerHTML='<p class="status-error">Connection error</p>'}};let y=[],x="all";async function P(){const e=document.getElementById("academy-stats"),n=document.getElementById("academy-list");e.innerHTML="<p>Loading stats...</p>",n.innerHTML="<p>Loading invitations...</p>";try{const t=await(await fetch("/api/admin/invite-stats.json",{headers:{"x-admin-token":m}})).json();t.ok&&(e.innerHTML=`
          <div class="stats-grid">
            <div class="stat-card">
              <div class="value">${t.pending||0}</div>
              <div class="label">Pending Invitations</div>
            </div>
            <div class="stat-card">
              <div class="value">${t.sent||0}</div>
              <div class="label">Sent Invitations</div>
            </div>
            <div class="stat-card">
              <div class="value">${t.failed||0}</div>
              <div class="label">Failed Sends</div>
            </div>
          </div>
        `);const s=await(await fetch("/api/admin/enquiries.json",{headers:{"x-admin-token":m}})).json();s.ok&&(y=s.enquiries.filter(a=>a.dob&&H(a.dob)<=10),_())}catch{e.innerHTML='<p class="status-error">Connection error</p>'}}function _(){const e=document.getElementById("academy-list");if(y.length===0){e.innerHTML="<p>No Academy-eligible enquiries (age ≤ 10)</p>";return}const n=y.length,i=y.filter(a=>a.invites&&a.invites.length>0).length,t=n-i,o=y.filter(a=>a.status==="joined").length,s=W(y,x);e.innerHTML=`
      <div style="margin-bottom:1.5rem;display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center">
        <button class="btn btn-sm ${x==="all"?"btn-primary":"btn-ghost"}" onclick="filterAcademyByStatus('all')">
          All (${n})
        </button>
        <button class="btn btn-sm ${x==="invited"?"btn-primary":"btn-ghost"}" onclick="filterAcademyByStatus('invited')">
          Invited (${i})
        </button>
        <button class="btn btn-sm ${x==="not_invited"?"btn-primary":"btn-ghost"}" onclick="filterAcademyByStatus('not_invited')">
          Not Invited (${t})
        </button>
        <button class="btn btn-sm ${x==="joined"?"btn-primary":"btn-ghost"}" onclick="filterAcademyByStatus('joined')">
          Joined (${o})
        </button>
      </div>
      
      <div class="academy-list-grid">
        ${s.map(a=>{const r=H(a.dob),c=a.invites&&a.invites.length>0,d=a.status||"pending",l=A(d),u=O(d);return`
            <div class="card" style="border-left:4px solid ${l};display:grid;gap:1rem">
              <div style="display:flex;justify-content:space-between;align-items:start;gap:1rem">
                <div>
                  <h3 style="margin:0 0 0.5rem 0;font-size:1.1rem;color:#111827">${a.name||a.email}</h3>
                  <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem">
                    ${u}
                    ${c?'<span style="display:inline-block;padding:0.25rem 0.75rem;background:#10b981;color:white;border-radius:12px;font-size:0.75rem;font-weight:500">Invited</span>':""}
                  </div>
                </div>
              </div>
              
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;padding:1rem;background:#f9fafb;border-radius:6px">
                <div>
                  <div style="font-size:0.75rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Age</div>
                  <div style="font-weight:600;color:#111827">${r} years old</div>
                  <div style="font-size:0.85rem;color:#6b7280;margin-top:0.25rem">DOB: ${a.dob}</div>
                </div>
                <div>
                  <div style="font-size:0.75rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Contact</div>
                  <div style="font-weight:500;color:#111827;font-size:0.9rem">${a.email}</div>
                </div>
                <div>
                  <div style="font-size:0.75rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Enquiry Date</div>
                  <div style="font-weight:500;color:#111827">${new Date(a.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              ${a.note?`
                <div style="padding:0.75rem;background:#fef3c7;border-left:3px solid #f59e0b;border-radius:4px">
                  <div style="font-size:0.75rem;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem">Note</div>
                  <div style="color:#78350f;font-size:0.9rem">${a.note}</div>
                </div>
              `:""}

              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;padding-top:0.5rem;border-top:1px solid #e5e7eb">
                ${d!=="joined"?`<button class="btn btn-sm" style="background:#10b981;color:white;border:none" onclick="updateAcademyStatus(${a.id}, 'joined')">✓ Mark as Joined</button>`:""}
                ${d!=="not_joined"?`<button class="btn btn-sm" style="background:#ef4444;color:white;border:none" onclick="updateAcademyStatus(${a.id}, 'not_joined')">✗ Mark as Not Joined</button>`:""}
                ${d!=="pending"?`<button class="btn btn-sm btn-outline" onclick="updateAcademyStatus(${a.id}, 'pending')">Reset to Pending</button>`:""}

                <button class="btn btn-sm btn-outline" onclick="previewAcademyInvitation(${a.id})">👁 Preview</button>

                ${c?`<button class="btn btn-sm btn-ghost" onclick="viewAcademyInvitation(${a.id})">🔗 View Invitation</button>`:`<button class="btn btn-sm" style="background:#003DA5;color:white;border:none" onclick="sendAcademyInvite(${a.id})">📧 Send Invitation</button>`}
              </div>
            </div>
          `}).join("")}
      </div>
    `}function W(e,n){return n==="all"?e:n==="invited"?e.filter(i=>i.invites&&i.invites.length>0):n==="not_invited"?e.filter(i=>!i.invites||i.invites.length===0):n==="joined"?e.filter(i=>i.status==="joined"):e}window.filterAcademyByStatus=function(e){x=e,_()};window.updateAcademyStatus=async function(e,n){try{if((await(await fetch("/api/admin/enquiries.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({action:"update_status",enquiry_id:e,status:n})})).json()).ok){const o=y.findIndex(s=>s.id===e);o!==-1&&(y[o].status=n,_()),v("academy-stats",`Status updated to "${n}"`,"success")}else v("academy-stats","Failed to update status","error")}catch(i){console.error("Update academy status error:",i),v("academy-stats","Connection error","error")}};window.sendAcademyInvite=async function(e){if(confirm("Send academy invitation email to this enquiry?"))try{const i=await(await fetch("/api/admin/send-invite.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({enquiry_id:e})})).json();i.ok?(v("academy-stats","Invitation sent successfully","success"),P()):v("academy-stats",i.error||"Failed to send invitation","error")}catch(n){console.error("Send academy invite error:",n),v("academy-stats","Connection error","error")}};window.previewAcademyInvitation=async function(e){try{const n=y.find(s=>s.id===e);if(!n){v("academy-stats","Enquiry not found","error");return}const i={childName:n.name||"",responseYesUrl:`${location.origin}/academy-response?enquiry=${n.id}&response=yes`,responseNoUrl:`${location.origin}/academy-response?enquiry=${n.id}&response=no`,siteName:window.SITE_NAME||document.title||"EGAC"},o=await(await fetch("/api/admin/templates/preview.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({key:"academy_invitation",vars:i})})).json();if(o.ok){const s=document.getElementById("academy-preview-modal"),a=document.getElementById("academy-preview-content");a.innerHTML=o.html||"<em>No HTML returned</em>",s.style.display="flex",document.getElementById("academy-preview-close").onclick=()=>{s.style.display="none"}}else v("academy-stats",o.error||"Preview failed","error")}catch(n){console.error("Preview error:",n),v("academy-stats","Connection error","error")}};window.viewAcademyInvitation=function(e){window.open(`/admin/enquiry/${e}`,"_blank")};function H(e){const n=new Date(e),i=new Date;let t=i.getFullYear()-n.getFullYear();const o=i.getMonth()-n.getMonth();return(o<0||o===0&&i.getDate()<n.getDate())&&t--,t}async function K(){const e=document.getElementById("reports-dashboard");e.innerHTML="<p>Loading reports...</p>";try{const[n,i]=await Promise.all([fetch("/api/admin/enquiries.json",{headers:{"x-admin-token":m}}),fetch("/api/admin/invite-stats.json",{headers:{"x-admin-token":m}})]),t=await n.json(),o=await i.json();if(!t.ok){e.innerHTML='<p class="status-error">Failed to load data</p>';return}const s=t.enquiries.length,a=t.enquiries.reduce((d,l)=>d+(l.bookings?.length||0),0),r=t.enquiries.reduce((d,l)=>d+(l.bookings?.filter(u=>u.status==="attended").length||0),0),c=t.enquiries.reduce((d,l)=>d+(l.bookings?.filter(u=>u.status==="no_show").length||0),0);e.innerHTML=`
        <div class="hero-section" style="background:linear-gradient(135deg,#003DA5,#0052CC);color:white;padding:2rem;border-radius:8px;margin-bottom:2rem">
          <h2 style="margin:0 0 0.5rem 0;font-size:1.75rem">Summary Dashboard</h2>
          <p style="margin:0;opacity:0.9">Overview of enquiries, bookings, attendance, and academy invitations</p>
        </div>
        
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-bottom:2rem">
          <div class="stat-card" style="padding:1.5rem">
            <div class="value">${s}</div>
            <div class="label">Total Enquiries</div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:0.5rem">All contact form submissions</div>
            <div style="margin-top:1rem;background:#f3f4f6;border-radius:4px;height:8px;overflow:hidden">
              <div style="background:#003DA5;height:100%;width:100%"></div>
            </div>
          </div>
          
          <div class="stat-card" style="padding:1.5rem">
            <div class="value">${a}</div>
            <div class="label">Total Bookings</div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:0.5rem">Taster session reservations</div>
            <div style="margin-top:1rem;background:#f3f4f6;border-radius:4px;height:8px;overflow:hidden">
              <div style="background:#0052CC;height:100%;width:${a>0?Math.min(100,a/s*100):0}%"></div>
            </div>
          </div>
          
          <div class="stat-card" style="padding:1.5rem;border-left-color:#10b981">
            <div class="value" style="color:#10b981">${r}</div>
            <div class="label">Attended Sessions</div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:0.5rem">Completed taster sessions</div>
            <div style="margin-top:1rem;background:#f3f4f6;border-radius:4px;height:8px;overflow:hidden">
              <div style="background:#10b981;height:100%;width:${a>0?r/a*100:0}%"></div>
            </div>
          </div>
          
          <div class="stat-card" style="padding:1.5rem;border-left-color:#ef4444">
            <div class="value" style="color:#ef4444">${c}</div>
            <div class="label">No-Shows</div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:0.5rem">Missed appointments</div>
            <div style="margin-top:1rem;background:#f3f4f6;border-radius:4px;height:8px;overflow:hidden">
              <div style="background:#ef4444;height:100%;width:${a>0?c/a*100:0}%"></div>
            </div>
          </div>
          
          <div class="stat-card" style="padding:1.5rem;border-left-color:#8b5cf6">
            <div class="value" style="color:#8b5cf6">${o.sent||0}</div>
            <div class="label">Academy Invites Sent</div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:0.5rem">U11 invitation emails</div>
            <div style="margin-top:1rem;background:#f3f4f6;border-radius:4px;height:8px;overflow:hidden">
              <div style="background:#8b5cf6;height:100%;width:${(o.sent||0)>0?100:0}%"></div>
            </div>
          </div>
          
          <div class="stat-card" style="padding:1.5rem;border-left-color:#f59e0b">
            <div class="value" style="color:#f59e0b">${Math.round(r/a*100)||0}%</div>
            <div class="label">Attendance Rate</div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:0.5rem">Attended / Total bookings</div>
            <div style="margin-top:1rem;background:#f3f4f6;border-radius:4px;height:8px;overflow:hidden">
              <div style="background:#f59e0b;height:100%;width:${Math.round(r/a*100)||0}%"></div>
            </div>
          </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:2rem">
          <div class="card" style="padding:1.5rem;border-left:4px solid #003DA5">
            <h4 style="margin:0 0 1rem 0;color:#003DA5">Conversion Funnel</h4>
            <div style="display:flex;flex-direction:column;gap:0.75rem">
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                  <span style="font-size:0.875rem;color:#374151">Enquiries</span>
                  <span style="font-size:0.875rem;font-weight:600">${s}</span>
                </div>
                <div style="background:#e5e7eb;border-radius:4px;height:6px;overflow:hidden">
                  <div style="background:#003DA5;height:100%;width:100%"></div>
                </div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                  <span style="font-size:0.875rem;color:#374151">Bookings Made</span>
                  <span style="font-size:0.875rem;font-weight:600">${a} (${s>0?Math.round(a/s*100):0}%)</span>
                </div>
                <div style="background:#e5e7eb;border-radius:4px;height:6px;overflow:hidden">
                  <div style="background:#0052CC;height:100%;width:${s>0?a/s*100:0}%"></div>
                </div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                  <span style="font-size:0.875rem;color:#374151">Attended</span>
                  <span style="font-size:0.875rem;font-weight:600">${r} (${a>0?Math.round(r/a*100):0}%)</span>
                </div>
                <div style="background:#e5e7eb;border-radius:4px;height:6px;overflow:hidden">
                  <div style="background:#10b981;height:100%;width:${a>0?r/a*100:0}%"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card" style="padding:1.5rem;border-left:4px solid #8b5cf6">
            <h4 style="margin:0 0 1rem 0;color:#8b5cf6">Recent Activity</h4>
            <div style="font-size:0.875rem;color:#6b7280">
              <p style="margin:0 0 0.5rem 0">📊 This dashboard updates in real-time</p>
              <p style="margin:0 0 0.5rem 0">🎯 Track conversion from enquiry to attendance</p>
              <p style="margin:0">✨ Filter and manage enquiries in the Enquiries tab</p>
            </div>
          </div>
        </div>
      `}catch{e.innerHTML='<p class="status-error">Connection error</p>'}}async function Q(){I(),X()}window.saveBookingSettings=async function(){const e=document.getElementById("booking-settings-result");e.innerHTML='<p class="status-info">Saving...</p>';const n=parseInt(document.getElementById("academy_max_age").value,10),i=parseInt(document.getElementById("weeks_ahead_booking").value,10);if(Number.isNaN(n)||n<0){e.innerHTML='<p class="status-error">Academy Max Age must be a non-negative number</p>';return}if(Number.isNaN(i)||i<=0){e.innerHTML='<p class="status-error">Weeks Ahead Booking must be a positive number</p>';return}try{const o=await(await fetch("/api/admin/config.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({action:"update_system",academy_max_age:n,weeks_ahead_booking:i})})).json();o.ok?e.innerHTML='<p class="status-success">Settings saved successfully</p>':e.innerHTML=`<p class="status-error">${o.error||"Failed to save"}</p>`}catch{e.innerHTML='<p class="status-error">Connection error</p>'}};async function I(){const e=document.getElementById("age-groups-config");e.innerHTML="<p>Loading...</p>";try{const i=await(await fetch("/api/admin/config.json",{headers:{"x-admin-token":m}})).json();if(!i.ok){e.innerHTML='<p class="status-error">Failed to load age groups</p>';return}const t=i.systemConfig?.weeks_ahead_booking||8,o=i.systemConfig?.academy_max_age||10;let s=`
        <div class="card" style="margin-bottom:1.5rem;padding:1.25rem;border-left:4px solid #059669">
          <h4 style="margin:0 0 1rem 0;color:#059669">Booking Settings</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem">
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.25rem">Weeks Ahead Booking</label>
              <input type="number" id="weeks_ahead_booking" value="${t}" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:4px" />
              <small style="color:#6b7280;font-size:0.75rem;display:block;margin-top:0.25rem">How many weeks ahead can users book taster sessions</small>
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.25rem">Academy Max Age (U11)</label>
              <input type="number" id="academy_max_age" value="${o}" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:4px" />
              <small style="color:#6b7280;font-size:0.75rem;display:block;margin-top:0.25rem">Athletes this age or younger are invited to Academy</small>
            </div>
          </div>
          <button class="btn btn-primary" onclick="saveBookingSettings()" style="margin-top:1rem">Save Booking Settings</button>
          <div id="booking-settings-result" style="margin-top:0.5rem"></div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
          <h4 style="margin:0">Training Groups</h4>
          <button class="btn btn-sm btn-primary" onclick="showAddAgeGroupForm()">Add Age Group</button>
        </div>
      `;s+='<table class="age-groups-table"><thead><tr><th>Name</th><th>Min Age</th><th>Max Age</th><th>Slot Code</th><th>Actions</th></tr></thead><tbody>',(i.age_groups||i.ageGroups||[]).forEach(a=>{s+=`
          <tr id="group-row-${a.id}">
            <td>${a.name}</td>
            <td>${a.min_age}</td>
            <td>${a.max_age||""}</td>
            <td>${a.code||a.slot_code||""}</td>
            <td><button class="btn btn-sm" onclick="showEditAgeGroupForm('${a.id}')">Edit</button></td>
          </tr>
        `}),s+="</tbody></table>",s+='<div id="age-group-form-placeholder" style="margin-top:1rem"></div>',e.innerHTML=s}catch{e.innerHTML='<p class="status-error">Connection error</p>'}}window.showAddAgeGroupForm=function(){const e=document.getElementById("age-group-form-placeholder");e.innerHTML=`
      <div class="card">
        <h4 style="margin-top:0">Add Age Group</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.5rem;">
          <div>
            <label>Code</label>
            <input id="create-code" />
          </div>
          <div>
            <label>Label</label>
            <input id="create-label" />
          </div>
          <div>
            <label>Min Age</label>
            <input id="create-min_age" type="number" />
          </div>
          <div>
            <label>Max Age</label>
            <input id="create-max_age" type="number" />
          </div>
          <div>
            <label>Session Day</label>
            <input id="create-session_day" placeholder="Tuesday" />
            <small style="color:#6b7280;font-size:0.75rem">Day of the week this group trains</small>
          </div>
          <div>
            <label>Session Time</label>
            <input id="create-session_time" placeholder="18:30" />
            <small style="color:#6b7280;font-size:0.75rem">Start time (e.g., 18:30)</small>
          </div>
          <div>
            <label>Capacity</label>
            <input id="create-capacity" type="number" value="8" />
          </div>
        </div>
        <div style="margin-top:0.75rem;display:flex;gap:0.5rem">
          <button class="btn btn-primary" onclick="createAgeGroup()">Create</button>
          <button class="btn btn-secondary" onclick="document.getElementById('age-group-form-placeholder').innerHTML=''">Cancel</button>
          <div id="age-group-create-result" style="margin-left:0.5rem"></div>
        </div>
      </div>
    `};window.createAgeGroup=async function(){const e=document.getElementById("age-group-create-result");e.innerHTML='<span class="status-info">Creating...</span>';const n=(document.getElementById("create-code").value||"").trim(),i=(document.getElementById("create-label").value||"").trim(),t=parseInt(document.getElementById("create-min_age").value||"",10),o=document.getElementById("create-max_age").value,s=o===""?null:parseInt(o,10),a=(document.getElementById("create-session_day").value||"").trim(),r=(document.getElementById("create-session_time").value||"").trim(),c=parseInt(document.getElementById("create-capacity").value||"8",10);if(!n||!i||Number.isNaN(t)||!a||!r){e.innerHTML='<span class="status-error">Missing required fields</span>';return}try{const l=await(await fetch("/api/admin/config.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({action:"create_age_group",code:n,label:i,min_age:t,max_age:s,session_day:a,session_time:r,capacity:c})})).json();l.ok?(e.innerHTML='<span class="status-success">Created</span>',document.getElementById("age-group-form-placeholder").innerHTML="",I()):e.innerHTML=`<span class="status-error">${l.error||"Failed"}</span>`}catch(d){e.innerHTML=`<span class="status-error">${d.message}</span>`}};window.showEditAgeGroupForm=async function(e){const n=document.getElementById("age-group-form-placeholder");n.innerHTML="<p>Loading...</p>";try{const o=((await(await fetch("/api/admin/config.json",{headers:{"x-admin-token":m}})).json()).ageGroups||[]).find(s=>String(s.id)===String(e));if(!o){n.innerHTML='<p class="status-error">Age group not found</p>';return}n.innerHTML=`
        <div class="card">
          <h4 style="margin-top:0">Edit Age Group</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.5rem;">
            <div>
              <label>Code</label>
              <input id="edit-code" value="${o.code||o.slot_code||""}" />
            </div>
            <div>
              <label>Label</label>
              <input id="edit-label" value="${o.name||""}" />
            </div>
            <div>
              <label>Min Age</label>
              <input id="edit-min_age" type="number" value="${o.min_age||""}" />
            </div>
            <div>
              <label>Max Age</label>
              <input id="edit-max_age" type="number" value="${o.max_age||""}" />
            </div>
            <div>
              <label>Session Day</label>
              <input id="edit-session_day" value="${o.session_day||""}" />
              <small style="color:#6b7280;font-size:0.75rem">Day of the week</small>
            </div>
            <div>
              <label>Session Time</label>
              <input id="edit-session_time" value="${o.session_time||""}" />
              <small style="color:#6b7280;font-size:0.75rem">Start time (e.g., 18:30)</small>
            </div>
            <div>
              <label>Capacity</label>
              <input id="edit-capacity" type="number" value="${o.capacity||8}" />
            </div>
            <div>
              <label>Active</label>
              <input id="edit-active" type="checkbox" ${o.active?"checked":""} />
            </div>
          </div>
          <div style="margin-top:0.75rem;display:flex;gap:0.5rem">
            <button class="btn btn-primary" onclick="saveAgeGroup('${o.id}')">Save</button>
            <button class="btn btn-secondary" onclick="document.getElementById('age-group-form-placeholder').innerHTML=''">Cancel</button>
            <div id="age-group-edit-result" style="margin-left:0.5rem"></div>
          </div>
        </div>
      `}catch(i){n.innerHTML=`<p class="status-error">${i&&i.message}</p>`}};window.saveAgeGroup=async function(e){const n=document.getElementById("age-group-edit-result");n.innerHTML='<span class="status-info">Saving...</span>';const i=(document.getElementById("edit-code").value||"").trim(),t=(document.getElementById("edit-label").value||"").trim(),o=parseInt(document.getElementById("edit-min_age").value||"",10),s=document.getElementById("edit-max_age").value,a=s===""?null:parseInt(s,10),r=(document.getElementById("edit-session_day").value||"").trim(),c=(document.getElementById("edit-session_time").value||"").trim(),d=parseInt(document.getElementById("edit-capacity").value||"8",10),l=!!document.getElementById("edit-active").checked;if(!i||!t||Number.isNaN(o)||!r||!c){n.innerHTML='<span class="status-error">Missing required fields</span>';return}try{const p=await(await fetch("/api/admin/config.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({action:"update_age_group",id:e,code:i,label:t,min_age:o,max_age:a,session_day:r,session_time:c,capacity:d,active:l})})).json();p.ok?(n.innerHTML='<span class="status-success">Saved</span>',document.getElementById("age-group-form-placeholder").innerHTML="",I()):n.innerHTML=`<span class="status-error">${p.error||"Failed"}</span>`}catch(u){n.innerHTML=`<span class="status-error">${u.message}</span>`}};async function X(){const e=document.getElementById("templates-config");e.innerHTML="<p>Loading...</p>";try{const i=await(await fetch("/api/admin/templates.json",{headers:{"x-admin-token":m}})).json();if(!i.ok){e.innerHTML='<p class="status-error">Failed to load templates</p>';return}e.innerHTML="",(i.templates||[]).forEach(t=>{const o=document.createElement("div");o.className="card",o.style.borderLeft="4px solid #003DA5",o.style.background="linear-gradient(180deg, #ffffff, #f9fafb)",o.style.marginBottom="1.5rem",o.innerHTML=`
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <h3 style="margin:0">${t.key} <small style="color:#6b7280;font-weight:600">(${t.language||"en"})</small></h3>
              <div style="color:#374151;margin-top:6px">${t.subject||""}</div>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem">
              <label style="display:flex;align-items:center;gap:0.375rem"><input type="checkbox" id="active-${t.id}" ${t.active?"checked":""}/> Active</label>
            </div>
          </div>
          <div class="template-editor" style="margin-top:1rem">
            <label>Subject:</label>
            <input type="text" value="${t.subject||""}" id="subject-${t.id}" style="width:100%" />
            
            <div style="margin-top:1rem; display:flex; justify-content:space-between; align-items:center; gap:0.5rem">
              <label style="font-weight:600">Email Body</label>
              <div style="display:flex;gap:0.75rem;align-items:center">
                <label style="font-size:0.9rem;color:#6b7280;cursor:pointer;display:flex;align-items:center;gap:0.25rem">
                  <input type="radio" name="mode-${t.id}" value="simple" checked /> Simple Editor
                </label>
                <label style="font-size:0.9rem;color:#6b7280;cursor:pointer;display:flex;align-items:center;gap:0.25rem">
                  <input type="radio" name="mode-${t.id}" value="advanced" /> HTML Code
                </label>
              </div>
            </div>

            <!-- Simple HTML-enabled editor (contenteditable) -->
            <div id="simple-editor-${t.id}" class="simple-editor" contenteditable="true" style="
              width:100%;
              min-height:200px;
              border:1px solid #d1d5db;
              border-radius:6px;
              padding:0.75rem;
              font-size:0.95rem;
              line-height:1.6;
              background:white;
              overflow:auto;
              max-height:400px;
            "></div>

            <!-- Formatting toolbar for simple editor -->
            <div id="toolbar-${t.id}" style="display:flex;gap:0.5rem;margin-top:0.5rem;flex-wrap:wrap">
              <button type="button" class="btn btn-sm btn-ghost" onclick="formatText('${t.id}', 'bold')" title="Bold"><strong>B</strong></button>
              <button type="button" class="btn btn-sm btn-ghost" onclick="formatText('${t.id}', 'italic')" title="Italic"><em>I</em></button>
              <button type="button" class="btn btn-sm btn-ghost" onclick="formatText('${t.id}', 'underline')" title="Underline"><u>U</u></button>
              <span style="border-left:1px solid #e5e7eb;margin:0 0.25rem"></span>
              <button type="button" class="btn btn-sm btn-ghost" onclick="formatText('${t.id}', 'insertUnorderedList')" title="Bullet List">• List</button>
              <button type="button" class="btn btn-sm btn-ghost" onclick="formatText('${t.id}', 'insertOrderedList')" title="Numbered List">1. List</button>
              <span style="border-left:1px solid #e5e7eb;margin:0 0.25rem"></span>
              <button type="button" class="btn btn-sm btn-ghost" onclick="insertLink('${t.id}')" title="Insert Link">🔗 Link</button>
              <button type="button" class="btn btn-sm btn-ghost" onclick="insertVariable('${t.id}')" title="Insert Variable">{{ Var }}</button>
            </div>

            <!-- Advanced HTML editor (hidden by default) -->
            <textarea id="html-editor-${t.id}" style="
              width:100%;
              min-height:200px;
              display:none;
              font-family:monospace;
              border:1px solid #d1d5db;
              border-radius:6px;
              padding:0.75rem;
              font-size:0.9rem;
              line-height:1.4;
              background:#f8fafc;
            ">${t.html||""}</textarea>

            <div style="display:flex;gap:0.5rem;margin-top:0.5rem;align-items:flex-start">
              <div style="flex:1">
                <label style="font-weight:600; color:#374151">Preview variables (JSON):</label>
                <textarea id="vars-${t.id}" style="width:100%;min-height:100px; font-family:monospace; background:#f8fafc; border:1px solid #e5e7eb; border-radius:6px; padding:0.5rem; font-size:0.875rem; color:#1f2937">{
  "siteName": "East Grinstead AC",
  "childName": "Junior",
  "responseYesUrl": "https://example.com/yes",
  "responseNoUrl": "https://example.com/no",
  "inviteUrl": "https://example.com/invite/abc123",
  "date": "2026-03-15"
}</textarea>
                <div style="margin-top:0.5rem;display:flex;gap:0.5rem;align-items:center">
                  <button class="btn btn-sm btn-secondary" onclick="document.getElementById('vars-${t.id}').value = '{\\n  "siteName": "East Grinstead AC",\\n  "childName": "Junior",\\n  "responseYesUrl": "https://example.com/yes",\\n  "responseNoUrl": "https://example.com/no"\\n}';">Load sample</button>
                  <button class="btn btn-sm" onclick="copySampleVars('${t.id}')">Copy sample</button>
                  <label style="margin-left:0.5rem;display:flex;align-items:center;gap:0.375rem"><input id="live-${t.id}" type="checkbox" /> Live preview</label>
                </div>
                <div id="vars-error-${t.id}" style="margin-top:0.5rem;color:#ef4444;display:none"></div>
              </div>

              <div style="width:360px;flex-shrink:0;">
                <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem">
                  <button class="btn btn-primary btn-sm" onclick="saveTemplate('${t.id}')">Save</button>
                  <button class="btn btn-secondary btn-sm" onclick="previewTemplate('${t.id}')">Preview</button>
                  <button class="btn btn-secondary btn-sm" onclick="sendTestEmail('${t.id}')">Send test</button>
                </div>
                <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem">
                  <button class="btn btn-ghost btn-sm" onclick="revertTemplate('${t.id}')">Revert</button>
                </div>
                <div id="template-result-${t.id}"></div>
                <div id="template-preview-html-${t.id}" style="margin-top:0.5rem; border:1px solid #e5e7eb; padding:8px; background:#fff; min-height:120px; overflow:auto"></div>
              </div>
            </div>
          </div>
        `,e.appendChild(o);try{const s=document.createElement("div");s.id=`template-react-root-${t.id}`,o.appendChild(s),(async function(){try{const[{default:r},c,d]=await Promise.all([M(()=>import("./TemplateEditor.CPZ8qlgL.js"),__vite__mapDeps([0,1,2,3,4])),M(()=>import("./client.Dcn0vcCG.js").then(p=>p.c),__vite__mapDeps([5,3,4])),M(()=>import("./index.CT7zvmi-.js").then(p=>p.i),__vite__mapDeps([2,3]))]),l=document.getElementById(`template-react-root-${t.id}`);if(!l)return;c.createRoot(l).render(d.createElement(r,{initialHtml:t.html||t.text||"",initialSubject:t.subject||"",initialVars:{},onSave:async({subject:p,html:h,text:$,vars:T})=>{const E=await(await fetch("/api/admin/templates.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({action:"update_template",id:t.id,subject:p,html:h,text:$,active:!!document.getElementById(`active-${t.id}`)?.checked})})).json();E.ok||alert("Save failed: "+(E.error||"Unknown"))},onPreview:async({html:p,vars:h})=>{const T=await(await fetch("/api/admin/templates/preview.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({html:p,vars:h,subject:document.getElementById(`subject-${t.id}`)?.value||t.subject})})).json();T.ok||alert("Preview failed: "+(T.error||"Unknown"))},onSendTest:async({to:p,html:h,subject:$,vars:T})=>{const E=await(await fetch("/api/admin/templates/send.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({id:t.id,to:p,vars:T})})).json();E.ok?alert("Test sent"):alert("Send failed: "+(E.error||"Unknown"))}}))}catch(r){console.warn("Failed to mount TemplateEditor",r&&r.message)}})()}catch(s){console.warn("React mount insertion failed",s)}try{const s=document.getElementById(`simple-editor-${t.id}`),a=document.getElementById(`html-editor-${t.id}`),r=document.getElementById(`toolbar-${t.id}`),c=document.querySelectorAll(`input[name="mode-${t.id}"]`);s&&(s.innerHTML=t.html||t.text||"",s.addEventListener("input",()=>S(t.id)));const d=document.getElementById(`vars-${t.id}`);d&&d.addEventListener("input",()=>S(t.id)),a&&a.addEventListener("input",()=>S(t.id)),c.forEach(u=>{u.addEventListener("change",()=>{u.value==="simple"?(a.value.trim()&&(s.innerHTML=a.value),s.style.display="block",r.style.display="flex",a.style.display="none"):(a.value=s.innerHTML,s.style.display="none",r.style.display="none",a.style.display="block"),S(t.id)})});const l=document.getElementById(`live-${t.id}`);l&&l.addEventListener("change",()=>{l.checked?B(t.id):document.getElementById(`template-preview-html-${t.id}`).innerHTML=""}),B(t.id)}catch(s){console.warn("Template UI wiring failed for",t.id,s&&s.message)}})}catch{e.innerHTML='<p class="status-error">Connection error</p>'}}window.formatText=function(e,n){document.getElementById(`simple-editor-${e}`).focus(),document.execCommand(n,!1,null)};window.insertLink=function(e){const n=prompt("Enter URL:");n&&(document.getElementById(`simple-editor-${e}`).focus(),document.execCommand("createLink",!1,n))};window.insertVariable=function(e){const n=prompt("Enter variable name (e.g., childName, siteName):");if(n){document.getElementById(`simple-editor-${e}`).focus();const t=`{{${n}}}`;document.execCommand("insertHTML",!1,t)}};const L={};function Z(e,n=300){let i=null;return(...t)=>{clearTimeout(i),i=setTimeout(()=>e(...t),n)}}function ee(e,n={}){if(!e)return"";let i=String(e);return n.logoUrl?(i=i.replace(/\{\{#if logoUrl\}\}/g,""),i=i.replace(/\{\{\/if\}\}/g,"")):i=i.replace(/\{\{#if logoUrl\}\}[\s\S]*?\{\{\/if\}\}/g,""),Object.keys(n).forEach(t=>{const o=n[t]==null?"":String(n[t]);i=i.split(`{{${t}}}`).join(o)}),i}function C(e){let n=String(e||"");return n=n.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi,""),n=n.replace(/on[a-z]+\s*=\s*"[^"]*"/gi,""),n=n.replace(/on[a-z]+\s*=\s*'[^']*'/gi,""),n=n.replace(/href\s*=\s*"javascript:[^\"]*"/gi,'href="#"'),n=n.replace(/href\s*=\s*'javascript:[^']*'/gi,"href='#'"),n}const S=Z(function(e){try{if(!document.getElementById(`live-${e}`)?.checked)return;B(e)}catch{}},250);function B(e){const n=document.getElementById(`template-preview-html-${e}`),i=document.getElementById(`vars-${e}`).value,t=document.querySelectorAll(`input[name="mode-${e}"]`);let o=!1;t.forEach(d=>{d.checked&&d.value==="advanced"&&(o=!0)});const s=o?document.getElementById(`html-editor-${e}`).value||"":document.getElementById(`simple-editor-${e}`).innerHTML||"",a=R(i),r=document.getElementById(`vars-error-${e}`);if(a.ok)r&&(r.style.display="none",r.textContent="");else{r&&(r.style.display="block",r.textContent=`Invalid JSON: ${a.error}`);return}const c=ee(s,Object.assign({},a.vars,{siteName:window.SITE_NAME||"EGAC",logoUrl:window.SITE_LOGO_URL||""}));n.innerHTML=c||"<em>No preview</em>"}window.saveTemplate=async function(e){const n=document.getElementById(`template-result-${e}`);n.innerHTML='<p class="status-info">Saving...</p>';const i=(document.getElementById(`subject-${e}`).value||"").trim(),t=document.querySelectorAll(`input[name="mode-${e}"]`);let o=!1;t.forEach(r=>{r.checked&&r.value==="advanced"&&(o=!0)});let s="";o?s=(document.getElementById(`html-editor-${e}`).value||"").trim():s=(document.getElementById(`simple-editor-${e}`).innerHTML||"").trim(),s=C(s);const a=F(s);if(!i){n.innerHTML='<p class="status-error">Subject is required</p>';return}if(!s){n.innerHTML='<p class="status-error">Body is required</p>';return}try{const r=!!document.getElementById(`active-${e}`)?.checked,d=await(await fetch("/api/admin/templates.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({action:"update_template",id:e,subject:i,html:s,text:a,active:r})})).json();d.ok?(L[e]&&(L[e].subject=i,L[e].html=s,L[e].text=a,L[e].active=r),n.innerHTML='<p class="status-success">Template saved</p>'):n.innerHTML=`<p class="status-error">${d.error||"Failed"}</p>`}catch(r){n.innerHTML=`<p class="status-error">Connection error: ${r.message}</p>`}};window.copySampleVars=function(e){const n=document.getElementById(`vars-${e}`).value;if(!navigator.clipboard){alert("Clipboard API not available");return}navigator.clipboard.writeText(n).then(()=>{const i=document.getElementById(`template-result-${e}`);i.innerHTML='<p class="status-success">Sample vars copied to clipboard</p>'}).catch(i=>{const t=document.getElementById(`template-result-${e}`);t.innerHTML=`<p class="status-error">Could not copy: ${i.message}</p>`})};window.sendTestEmail=async function(e){const n=document.getElementById(`template-result-${e}`);n.innerHTML='<p class="status-info">Sending test email...</p>';const i=prompt("Enter recipient email for test send:");if(!i){n.innerHTML='<p class="status-error">Recipient email required</p>';return}const t=document.getElementById(`vars-${e}`).value;let o={};try{o=JSON.parse(t)}catch(s){n.innerHTML=`<p class="status-error">Invalid JSON variables: ${s.message}</p>`;return}try{const s=(document.getElementById(`subject-${e}`).value||"").trim(),a=document.querySelectorAll(`input[name="mode-${e}"]`);let r=!1;a.forEach(u=>{u.checked&&u.value==="advanced"&&(r=!0)});let c="";r?c=(document.getElementById(`html-editor-${e}`).value||"").trim():c=(document.getElementById(`simple-editor-${e}`).innerHTML||"").trim(),c=C(c);const l=await(await fetch("/api/admin/templates/send.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({id:e,to:i,vars:o,subject:s,html:c})})).json();l.ok?n.innerHTML='<p class="status-success">Test email sent</p>':n.innerHTML=`<p class="status-error">${l.error||"Failed to send"}</p>`}catch(s){n.innerHTML=`<p class="status-error">Connection error: ${s.message}</p>`}};window.previewTemplate=async function(e){const n=document.getElementById(`template-result-${e}`),i=document.getElementById(`template-preview-html-${e}`);n.innerHTML='<p class="status-info">Loading preview...</p>',i.innerHTML="";const t=document.getElementById(`subject-${e}`).value,o=document.querySelectorAll(`input[name="mode-${e}"]`);let s=!1;o.forEach(d=>{d.checked&&d.value==="advanced"&&(s=!0)});let a="";s?a=(document.getElementById(`html-editor-${e}`).value||"").trim():a=(document.getElementById(`simple-editor-${e}`).innerHTML||"").trim(),a=C(a);const r=document.getElementById(`vars-${e}`).value;let c={};try{c=JSON.parse(r)}catch(d){n.innerHTML=`<p class="status-error">Invalid JSON in preview variables: ${d.message}</p>`;return}try{const l=await(await fetch("/api/admin/templates/preview.json",{method:"POST",headers:{"Content-Type":"application/json","x-admin-token":m},body:JSON.stringify({id:e,key:null,vars:c,html:a,subject:t})})).json();l.ok?(n.innerHTML='<p class="status-success">Preview rendered</p>',i.innerHTML=l.rendered||l.html||"<em>No HTML returned</em>"):n.innerHTML=`<p class="status-error">${l.error||"Failed"}</p>`}catch(d){n.innerHTML=`<p class="status-error">Connection error: ${d.message}</p>`}};
