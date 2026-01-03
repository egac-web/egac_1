#!/usr/bin/env bash
# scripts/test_endpoints.sh
# Safely test invite/retry/reminders endpoints on the deployed site
set -euo pipefail

# Safely extract CRON_SECRET from .env without sourcing
CRON_SECRET=$(grep '^CRON_SECRET=' .env | sed -E 's/^CRON_SECRET=("?)(.*)\1$/\2/')
SITE=${1:-https://egac-1.pages.dev}

echo "Using site: $SITE"
[ -z "$CRON_SECRET" ] && { echo "CRON_SECRET not found in .env" >&2; exit 2; }

echo "Calling invite-stats..."
curl -sS "$SITE/api/admin/invite-stats.json?secret=$CRON_SECRET" | jq || true

echo "Calling retry-invites..."
curl -sS "$SITE/api/admin/retry-invites.json?secret=$CRON_SECRET" | jq || true

echo "Calling send-reminders..."
curl -sS "$SITE/api/admin/send-reminders.json?secret=$CRON_SECRET" | jq || true

echo "Done."