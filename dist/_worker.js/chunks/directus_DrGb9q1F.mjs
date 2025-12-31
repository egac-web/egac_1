globalThis.process ??= {}; globalThis.process.env ??= {};
const e$3=e=>{let t=(e,n=[])=>{if(typeof e==`object`){let r=[];for(let i in e){let a=e[i]??[];if(Array.isArray(a))for(let e of a)r.push(t(e,[...n,i]));else if(typeof a==`object`)for(let e of Object.keys(a)){let o=a[e];for(let a of o)r.push(t(a,[...n,`${i}:${e}`]));}}return r.flatMap(e=>e)}return [...n,String(e)].join(`.`)};return e.flatMap(e=>t(e))},t$4=[`fields`,`filter`,`search`,`sort`,`limit`,`offset`,`page`,`deep`,`backlink`,`alias`,`aggregate`,`groupBy`,`version`,`versionRaw`],n$2=e=>typeof e==`boolean`,r$1=e=>typeof e==`string`&&!!e,i=e=>typeof e==`number`,a=e=>Array.isArray(e)&&e.length>0,o=e=>typeof e==`object`&&!!e&&!a(e)&&Object.keys(e).length>0,s=s=>{let c={};s.fields&&(a(s.fields)&&(c.fields=e$3(s.fields).join(`,`)),r$1(s.fields)&&(c.fields=s.fields)),o(s.filter)&&(c.filter=JSON.stringify(s.filter)),r$1(s.search)&&(c.search=s.search),s.sort&&(a(s.sort)&&(c.sort=s.sort.join(`,`)),r$1(s.sort)&&(c.sort=s.sort)),`limit`in s&&(i(s.limit)&&s.limit>=-1&&(c.limit=String(s.limit)),r$1(s.limit)&&(c.limit=s.limit)),`offset`in s&&(i(s.offset)&&s.offset>=0&&(c.offset=String(s.offset)),r$1(s.offset)&&(c.offset=s.offset)),`page`in s&&(i(s.page)&&s.page>=1&&(c.page=String(s.page)),r$1(s.page)&&(c.page=s.page)),o(s.deep)&&(c.deep=JSON.stringify(s.deep)),o(s.alias)&&(c.alias=JSON.stringify(s.alias)),o(s.aggregate)&&(c.aggregate=JSON.stringify(s.aggregate)),s.groupBy&&(a(s.groupBy)&&(c.groupBy=s.groupBy.join(`,`)),r$1(s.groupBy)&&(c.groupBy=s.groupBy)),r$1(s.version)&&(c.version=s.version),s.versionRaw&&(n$2(s.versionRaw)&&(c.versionRaw=String(s.versionRaw)),r$1(s.versionRaw)&&(c.versionRaw=s.versionRaw));for(let[e,n]of Object.entries(s)){if(t$4.includes(e))continue;let r;r=typeof n==`string`?n:JSON.stringify(n),r&&(c[e]=r);}return c};

const t$3=(e,t)=>(e.endsWith(`/`)&&(e=e.slice(0,-1)),t.startsWith(`/`)||(t=`/`+t),e+t),n$1=(n,r,i)=>{let a=n.pathname===`/`?r:t$3(n.pathname,r),o=new globalThis.URL(a,n);if(i)for(let[t,n]of Object.entries(s(i)))if(n&&typeof n==`object`&&!Array.isArray(n))for(let[e,r]of Object.entries(n))o.searchParams.set(`${t}[${e}]`,String(r));else o.searchParams.set(t,n);return o};

function e$2(e){return typeof e!=`object`||!e?false:`headers`in e&&`ok`in e&&`json`in e&&typeof e.json==`function`&&`text`in e&&typeof e.json==`function`}

async function t$2(t){if(!(typeof t!=`object`||!t)){if(e$2(t)){let e=t.headers.get(`Content-Type`)?.toLowerCase();if(e?.startsWith(`application/json`)||e?.startsWith(`application/health+json`)){let e=await t.json();if(!t.ok||`errors`in e)throw e;return `data`in e?e.data:e}if(e?.startsWith(`text/html`)||e?.startsWith(`text/plain`)){let e=await t.text();if(!t.ok)throw e;return e}return t.status===204?null:t}if(`errors`in t)throw t;return `data`in t?t.data:t}}

const t$1=async(t,n,r=globalThis.fetch)=>(n.headers=typeof n.headers==`object`&&!Array.isArray(n.headers)?n.headers:{},r(t,n).then(t=>t$2(t).catch(e=>{let n={message:``,errors:e&&typeof e==`object`&&`errors`in e?e.errors:e,response:t};return e&&typeof e==`object`&&`data`in e&&(n.data=e.data),Array.isArray(n.errors)&&n.errors[0]?.message&&(n.message=n.errors[0].message),Promise.reject(n)})));

const e$1=e=>t=>{let n=e??null;return {async getToken(){return n},async setToken(e){n=e;}}};

const e={fetch:globalThis.fetch,WebSocket:globalThis.WebSocket,URL:globalThis.URL,logger:globalThis.console},t=(t,n={})=>{let r=n.globals?{...e,...n.globals}:e;return {globals:r,url:new r.URL(t),with(e){return {...this,...e(this)}}}};

const n={},r=(r={})=>i=>{let a={...n,...r};return {async request(n){let o=n();if(o.headers||={},`Content-Type`in o.headers?o.headers[`Content-Type`]===`multipart/form-data`&&delete o.headers[`Content-Type`]:o.headers[`Content-Type`]=`application/json`,`getToken`in this&&!(`Authorization`in o.headers)){let e=await this.getToken();e&&(o.headers.Authorization=`Bearer ${e}`);}let s=n$1(i.url,o.path,o.params),c={method:o.method??`GET`,headers:o.headers??{}};`credentials`in a&&(c.credentials=a.credentials),o.body&&(c.body=o.body),o.onRequest&&(c=await o.onRequest(c)),a.onRequest&&(c=await a.onRequest(c));let l=await t$1(s.toString(),c,i.globals.fetch);return `onResponse`in o&&(l=await o.onResponse(l,c)),`onResponse`in r&&(l=await r.onResponse(l,c)),l}}};

const DIRECTUS_URL = "https://egac-admin.themainhost.co.uk";
const DIRECTUS_TOKEN = "eU8xb43Id43Ee4eeR_J8OL9ZaGIdBZdP";
console.log("[EGAC] DIRECTUS_URL:", DIRECTUS_URL);
console.log("[EGAC] DIRECTUS_TOKEN:", "[set]" );
const directus = DIRECTUS_URL.includes("placeholder") ? null : t(DIRECTUS_URL).with(r()).with(e$1(DIRECTUS_TOKEN));

export { directus as d };
