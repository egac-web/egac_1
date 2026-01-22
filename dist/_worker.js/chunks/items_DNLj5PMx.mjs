globalThis.process ??= {}; globalThis.process.env ??= {};
function e$1(e){return `directus_access.directus_activity.directus_collections.directus_comments.directus_fields.directus_files.directus_folders.directus_migrations.directus_permissions.directus_policies.directus_presets.directus_relations.directus_revisions.directus_roles.directus_sessions.directus_settings.directus_users.directus_webhooks.directus_dashboards.directus_panels.directus_notifications.directus_shares.directus_flows.directus_operations.directus_translations.directus_versions.directus_extensions`.split(`.`).includes(e)}

const e=(e,t)=>{if(e.length===0)throw Error(t)};

const t=(t,n)=>{if(e$1(String(t)))throw Error(n)};

const n=(n,r)=>()=>(e(String(n),`Collection cannot be empty`),t(n,`Cannot use readItems for core collections`),{path:`/items/${n}`,params:r??{},method:`GET`});

export { n };
