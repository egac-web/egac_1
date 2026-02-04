import { describe, test, expect } from 'vitest';
import { ensureAdmin } from '../admin-auth';

// Determine whether jose is available at runtime (optional dependency)
let joseAvailable = true;
try {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await import('jose');
} catch (e) {
  joseAvailable = false;
}

describe('ensureAdmin', () => {
  test('accepts a valid CF JWT (expiry in future) with fallback decode', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub: 'test-user', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
    const jwt = `${header}.${payload}.sig`;

    const req = new Request('https://example.test/', { headers: { 'cf-access-jwt-assertion': jwt } });
    const res = await ensureAdmin(req, { runtime: { env: {} } });
    expect(res.ok).toBe(true);
    expect(res.method).toBe('cf-jwt');
    expect(res.user && res.user.sub).toBe('test-user');
  });

  test('rejects expired CF JWT with fallback decode', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub: 'test-user', exp: Math.floor(Date.now() / 1000) - 3600 })).toString('base64url');
    const jwt = `${header}.${payload}.sig`;

    const req = new Request('https://example.test/', { headers: { 'cf-access-jwt-assertion': jwt } });
    const res = await ensureAdmin(req, { runtime: { env: {} } });
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('cf-jwt-expired');
  });

  test('rejects when no auth present', async () => {
    const req = new Request('https://example.test/');
    const res = await ensureAdmin(req, { runtime: { env: {} } });
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('no-auth');
  });

  if (joseAvailable) {
    test('verifies JWT signature using JWKS (mocked endpoint) and RBAC allows', async () => {
      const { generateKeyPair, exportJWK, SignJWT } = await import('jose');
      const { publicKey, privateKey } = await generateKeyPair('RS256');
      const jwk = await exportJWK(publicKey);
      jwk.kid = 'test-key-1';

      // Start a local HTTP server to return JWKS (avoids DNS/network resolution issues in tests)
      const http = await import('node:http');
      const server = http.createServer((req, res) => {
        if (req.url === '/.well-known/jwks.json') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ keys: [jwk] }));
        } else {
          res.writeHead(404);
          res.end();
        }
      });
      await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
      const port = server.address().port;
      const jwksUrl = `http://127.0.0.1:${port}/.well-known/jwks.json`;

      // sign a token with email claim
      const jwt = await new SignJWT({ sub: 'signed-user', email: 'signed@example.com' }).setProtectedHeader({ alg: 'RS256', kid: 'test-key-1' }).setIssuedAt().setExpirationTime('2h').sign(privateKey);

      const req = new Request('https://example.test/', { headers: { 'cf-access-jwt-assertion': jwt } });
      const res = await ensureAdmin(req, { runtime: { env: { CF_ACCESS_JWKS_URL: jwksUrl, ADMIN_ALLOWED_EMAILS: 'signed@example.com' } } });

      server.close();

      expect(res.ok).toBe(true);
      expect(res.method).toBe('cf-jwt');
      expect(res.verified).toBe(true);
      expect(res.user && res.user.sub).toBe('signed-user');
    });

    test('verifies JWT signature using JWKS (mocked endpoint) and RBAC denies when not in list', async () => {
      const { generateKeyPair, exportJWK, SignJWT } = await import('jose');
      const { publicKey, privateKey } = await generateKeyPair('RS256');
      const jwk = await exportJWK(publicKey);
      jwk.kid = 'test-key-1';

      // Start a local HTTP server to return JWKS (avoids DNS/network resolution issues in tests)
      const http = await import('node:http');
      const server = http.createServer((req, res) => {
        if (req.url === '/.well-known/jwks.json') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ keys: [jwk] }));
        } else {
          res.writeHead(404);
          res.end();
        }
      });
      await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
      const port = server.address().port;
      const jwksUrl = `http://127.0.0.1:${port}/.well-known/jwks.json`;

      const jwt = await new SignJWT({ sub: 'signed-user', email: 'signed@example.com' }).setProtectedHeader({ alg: 'RS256', kid: 'test-key-1' }).setIssuedAt().setExpirationTime('2h').sign(privateKey);

      const req = new Request('https://example.test/', { headers: { 'cf-access-jwt-assertion': jwt } });
      const res = await ensureAdmin(req, { runtime: { env: { CF_ACCESS_JWKS_URL: jwksUrl, ADMIN_ALLOWED_EMAILS: 'other@example.com' } } });

      server.close();

      expect(res.ok).toBe(false);
      expect(res.reason).toBe('rbac-deny');
    });
  } else {
    test.skip('jose not available: skipping JWKS verification test', () => { });
  }

  test('CF authenticated user header is accepted and RBAC enforced', async () => {
    const cfUser = JSON.stringify({ email: 'user1@example.com', id: 'u1' });
    const req = new Request('https://example.test/', { headers: { 'cf-access-authenticated-user': cfUser } });
    const res1 = await ensureAdmin(req, { runtime: { env: { ADMIN_ALLOWED_EMAILS: 'user1@example.com' } } });
    expect(res1.ok).toBe(true);
    expect(res1.method).toBe('cf-user');

    const res2 = await ensureAdmin(req, { runtime: { env: { ADMIN_ALLOWED_EMAILS: 'other@example.com' } } });
    expect(res2.ok).toBe(false);
    expect(res2.reason).toBe('rbac-deny');
  });
});
