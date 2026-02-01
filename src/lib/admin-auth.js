/*
 * Admin auth helper
 * - Accepts existing x-admin-token / token query param for backwards compatibility (dev & ADMIN_TOKEN)
 * - Accepts Cloudflare Access headers: `Cf-Access-Jwt-Assertion` (JWT) or `Cf-Access-Authenticated-User` (JSON)
 * - If `CF_ACCESS_JWKS_URL` is configured, verifies JWT signature and claims using `jose`.
 * - Adds simple RBAC via `ADMIN_ALLOWED_EMAILS` or `ADMIN_ALLOWED_GROUPS` env vars and logs audit events to console.
 */

let JWKS_CLIENT = null;
let JWKS_CLIENT_URL = null;
let JWKS_LAST_REFRESH = 0;
const DEFAULT_JWKS_TTL = 5 * 60 * 1000; // 5 minutes

async function getJwksClient(env) {
  try {
    if (!env || !env.CF_ACCESS_JWKS_URL) return null;
    const ttl = Number(env.CF_ACCESS_JWKS_CACHE_TTL_MS || DEFAULT_JWKS_TTL);
    const now = Date.now();
    if (JWKS_CLIENT && JWKS_CLIENT_URL === env.CF_ACCESS_JWKS_URL && (now - JWKS_LAST_REFRESH) < ttl) {
      return JWKS_CLIENT;
    }
    const { createRemoteJWKSet } = await import('jose');
    JWKS_CLIENT_URL = env.CF_ACCESS_JWKS_URL;
    JWKS_CLIENT = createRemoteJWKSet(new URL(env.CF_ACCESS_JWKS_URL));
    JWKS_LAST_REFRESH = Date.now();
    return JWKS_CLIENT;
  } catch (err) {
    console.warn('Failed to initialize JWKS client (jose missing or invalid URL):', err && err.message ? err.message : err);
    return null;
  }
}

function isAllowedByRbac(payload, env) {
  const allowedEmails = (env.ADMIN_ALLOWED_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowedEmails.length > 0) {
    const userEmail = (payload && (payload.email || payload.preferred_username || payload.upn || payload.sub)) || '';
    if (!userEmail) return false;
    if (!allowedEmails.some(e => userEmail.toLowerCase() === e.toLowerCase())) return false;
  }
  const allowedGroups = (env.ADMIN_ALLOWED_GROUPS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowedGroups.length > 0) {
    const groups = payload.groups || payload.memberOf || [];
    if (!Array.isArray(groups)) return false;
    if (!groups.some(g => allowedGroups.includes(g))) return false;
  }
  return true;
}

export async function ensureAdmin(request, locals) {
  const env = locals?.runtime?.env || process.env;
  const url = new URL(request.url);
  const token = request.headers.get('x-admin-token') || url.searchParams.get('token') || '';

  if (token === 'dev' || (env.ADMIN_TOKEN && token === env.ADMIN_TOKEN)) {
    console.info('Admin auth granted via token (dev/ADMIN_TOKEN)');
    return { ok: true, method: 'token' };
  }

  const cfJwt = request.headers.get('cf-access-jwt-assertion') || request.headers.get('Cf-Access-Jwt-Assertion');
  if (cfJwt) {
    const jwks = await getJwksClient(env);
    if (jwks) {
      try {
        const { jwtVerify } = await import('jose');
        const verifyOpts = {};
        if (env.CF_ACCESS_ISSUER) verifyOpts.issuer = env.CF_ACCESS_ISSUER;
        if (env.CF_ACCESS_AUD) verifyOpts.audience = env.CF_ACCESS_AUD;
        const verified = await jwtVerify(cfJwt, jwks, verifyOpts);
        const payload = verified.payload || {};
        if (!isAllowedByRbac(payload, env)) {
          console.warn('Admin auth denied by RBAC', { email: payload.email || payload.sub });
          return { ok: false, reason: 'rbac-deny' };
        }
        console.info('Admin auth granted (cf-jwt verified)', { sub: payload.sub, email: payload.email });
        return { ok: true, method: 'cf-jwt', verified: true, user: payload };
      } catch (err) {
        console.warn('CF JWT verification failed', err && err.message ? err.message : err);
        return { ok: false, reason: 'cf-jwt-verify-failed', error: String(err) };
      }
    }

    const parts = cfJwt.split('.');
    if (parts.length === 3) {
      try {
        const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        let payloadStr;
        try {
          if (typeof atob !== 'undefined') {
            const bin = atob(b64);
            payloadStr = decodeURIComponent(Array.prototype.map.call(bin, (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
          } else {
            payloadStr = Buffer.from(b64, 'base64').toString('utf8');
          }
        } catch (innerErr) {
          console.warn('Base64 decode failed', innerErr);
          return { ok: false, reason: 'cf-jwt-decode-failed' };
        }
        const payload = JSON.parse(payloadStr);
        if (payload.exp && (payload.exp * 1000) > Date.now()) {
          if (!isAllowedByRbac(payload, env)) {
            console.warn('Admin auth denied by RBAC (fallback)', { email: payload.email || payload.sub });
            return { ok: false, reason: 'rbac-deny' };
          }
          console.info('Admin auth granted (cf-jwt fallback)', { sub: payload.sub, email: payload.email });
          return { ok: true, method: 'cf-jwt', user: payload };
        }
        return { ok: false, reason: 'cf-jwt-expired' };
      } catch (err) {
        console.warn('CF JWT decode failed', err);
        return { ok: false, reason: 'cf-jwt-decode-failed' };
      }
    }
    return { ok: false, reason: 'cf-jwt-format' };
  }

  const cfUser = request.headers.get('cf-access-authenticated-user') || request.headers.get('Cf-Access-Authenticated-User');
  if (cfUser) {
    try {
      const user = JSON.parse(cfUser);
      if (user && (user.email || user.id || user.identity)) {
        if (!isAllowedByRbac(user, env)) {
          console.warn('Admin auth denied by RBAC (cf-user)', { email: user.email });
          return { ok: false, reason: 'rbac-deny' };
        }
        console.info('Admin auth granted (cf-user)', { email: user.email || user.id });
        return { ok: true, method: 'cf-user', user };
      }
      return { ok: false, reason: 'cf-user-missing-claims' };
    } catch (err) {
      console.warn('CF Authenticated User header parse failed', err);
      return { ok: false, reason: 'cf-user-parse' };
    }
  }

  return { ok: false, reason: 'no-auth' };
}

/*
 * Notes:
 * - Set `CF_ACCESS_JWKS_URL` in staging to the tenant JWKS endpoint (e.g., https://<tenant>.cloudflareaccess.com/cdn-cgi/access/certs)
 * - Optionally set `CF_ACCESS_ISSUER` and `CF_ACCESS_AUD` to validate issuer/audience claims.
 * - Optionally set `ADMIN_ALLOWED_EMAILS` (comma-separated) and/or `ADMIN_ALLOWED_GROUPS` for extra RBAC.
 */
