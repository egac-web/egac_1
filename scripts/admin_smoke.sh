#!/usr/bin/env bash
# admin_smoke.sh — simple smoke test for admin endpoints
# Usage:
#   ADMIN_TOKEN="test-secret-123" ADMIN_BASE="http://localhost:3001" ./scripts/admin_smoke.sh
# Notes: requires `jq` in PATH. This script will not send membership emails (send_membership_link=false).
set -euo pipefail

ADMIN_TOKEN="${ADMIN_TOKEN:-}"
BASE="${ADMIN_BASE:-http://localhost:3001}"

if [ -z "$ADMIN_TOKEN" ]; then
  echo "ERROR: ADMIN_TOKEN environment variable is not set"
  echo "Usage: ADMIN_TOKEN=... ADMIN_BASE=http://localhost:3001 $0"
  exit 2
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required but not installed. Install jq and retry."
  exit 2
fi

echo "Checking GET $BASE/api/admin/enquiries.json"
# Use curl to return body + code
res=$(curl -s -w "%{http_code}" -H "x-admin-token: $ADMIN_TOKEN" -H "Accept: application/json" "$BASE/api/admin/enquiries.json")
http=${res: -3}
body=${res%???}

if [ "$http" != "200" ]; then
  echo "GET returned HTTP $http"
  echo "$body"
  exit 1
fi

ok=$(echo "$body" | jq -r '.ok // false')
if [ "$ok" != "true" ]; then
  echo "GET returned ok=false"
  echo "$body"
  exit 1
fi

count=$(echo "$body" | jq '.enquiries | length')
echo "GET OK — found $count enquiries"

# find first booking id if present
booking_id=$(echo "$body" | jq -r '.enquiries[]?.bookings[]?.id' | head -n1 | tr -d '\r\n')
if [ -z "$booking_id" ]; then
  echo "No bookings found — GET is OK. Smoke complete."
  exit 0
fi

echo "Found booking id: $booking_id — performing safe attendance POST (send_membership_link=false)"
post=$(curl -s -w "%{http_code}" -X POST -H "x-admin-token: $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"booking_id\":\"$booking_id\",\"status\":\"attended\",\"send_membership_link\":false}" "$BASE/api/admin/booking/attendance.json")
post_http=${post: -3}
post_body=${post%???}

if [ "$post_http" != "200" ]; then
  echo "POST returned HTTP $post_http"
  echo "$post_body"
  exit 1
fi

post_ok=$(echo "$post_body" | jq -r '.ok // false')
if [ "$post_ok" != "true" ]; then
  echo "POST returned ok=false"
  echo "$post_body"
  exit 1
fi

echo "Attendance POST OK"
# show small summary
echo "$post_body" | jq '{ok, booking: .booking.id, membership_sent, membership_error, coachMessage, presliCSV}'

echo "Admin smoke test completed successfully"
exit 0
