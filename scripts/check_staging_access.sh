#!/bin/bash
set -e

# Smoke check script for staging deployment
# Supports both JWT and Service Token authentication for Cloudflare Access

URL="${ACCESS_URL:-https://egac-staging.pages.dev}"

echo "🔍 Smoke checking: $URL"

# Build curl command with appropriate auth headers
CURL_CMD="curl -f -s -o /dev/null -w '%{http_code}'"

if [ -n "$CF_ACCESS_CLIENT_ID" ] && [ -n "$CF_ACCESS_CLIENT_SECRET" ]; then
  echo "Using Cloudflare Access Service Token authentication"
  CURL_CMD="$CURL_CMD -H 'CF-Access-Client-Id: $CF_ACCESS_CLIENT_ID' -H 'CF-Access-Client-Secret: $CF_ACCESS_CLIENT_SECRET'"
elif [ -n "$ACCESS_JWT" ]; then
  echo "Using JWT authentication"
  CURL_CMD="$CURL_CMD -H 'CF-Access-JWT-Assertion: $ACCESS_JWT'"
else
  echo "No authentication configured - checking public access"
fi

CURL_CMD="$CURL_CMD $URL"

# Execute the curl command
HTTP_CODE=$(eval $CURL_CMD)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Smoke check passed (HTTP $HTTP_CODE)"
  exit 0
else
  echo "❌ Smoke check failed (HTTP $HTTP_CODE)"
  exit 1
fi
