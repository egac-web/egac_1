#!/usr/bin/env bash
set -euo pipefail

# Usage:
# ACCESS_URL=https://staging.eastgrinsteadac.co.uk ADMIN_TOKEN=secret ./scripts/check_staging_access.sh
# Or with a real Cloudflare Access JWT for smoke: ACCESS_JWT=<jwt> ./scripts/check_staging_access.sh

URL=${ACCESS_URL:-https://staging.eastgrinsteadac.co.uk}
ADMIN_TOKEN=${ADMIN_TOKEN:-}
ACCESS_JWT=${ACCESS_JWT:-}

echo "Testing staging admin access on $URL"

# unauthenticated should be 401
code=$(curl -sS -o /dev/null -w "%{http_code}" "$URL/api/admin/enquiries.json") || true
if [ "$code" != "401" ]; then
  echo "WARN: Unauthenticated request expected 401, got $code";
else
  echo "PASS: Unauthenticated request returned 401 as expected";
fi

if [ -n "$ACCESS_JWT" ]; then
  code=$(curl -sS -o /dev/null -w "%{http_code}" -H "Cf-Access-Jwt-Assertion: $ACCESS_JWT" "$URL/api/admin/enquiries.json") || true
  if [ "$code" = "200" ]; then
    echo "PASS: Request with Cf-Access-Jwt-Assertion succeeded (200)";
    exit 0
  else
    echo "FAIL: Request with Cf-Access-Jwt-Assertion returned $code";
    exit 2
  fi
fi

if [ -n "$ADMIN_TOKEN" ]; then
  code=$(curl -sS -o /dev/null -w "%{http_code}" -H "x-admin-token: $ADMIN_TOKEN" "$URL/api/admin/enquiries.json") || true
  if [ "$code" = "200" ]; then
    echo "PASS: Request with ADMIN_TOKEN succeeded (200)";
    exit 0
  else
    echo "FAIL: Request with ADMIN_TOKEN returned $code";
    exit 3
  fi
fi

echo "INFO: No ACCESS_JWT or ADMIN_TOKEN provided, only unauthenticated check performed."
exit 0
