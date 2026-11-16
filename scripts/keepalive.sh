#!/usr/bin/env bash
# ==============================================================================
# Supabase Keep-Alive (Shell / Cron Script)
# AbsensiPro - Diskominfo SP Kab. HST
# ==============================================================================
# Gunakan script ini untuk cron job di laptop atau server hosting/cPanel:
# Contoh cron (jalan tiap hari jam 08:00 WITA):
# 0 8 * * * /path/to/absensipro/scripts/keepalive.sh >> /path/to/absensipro/scripts/keepalive.log 2>&1
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${DIR}/../assets/js/config.js"

SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}"

if [ -z "$SUPABASE_URL" ] && [ -f "$CONFIG_FILE" ]; then
  SUPABASE_URL=$(grep -o 'SUPABASE_URL = "[^"]*' "$CONFIG_FILE" | cut -d'"' -f2)
fi

if [ -z "$SUPABASE_ANON_KEY" ] && [ -f "$CONFIG_FILE" ]; then
  SUPABASE_ANON_KEY=$(grep -o 'SUPABASE_ANON_KEY = "[^"]*' "$CONFIG_FILE" | cut -d'"' -f2)
fi

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Supabase credentials not found."
  exit 1
fi

ENDPOINT="${SUPABASE_URL}/rest/v1/events?select=id&limit=1"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Pinging Supabase Keep-Alive: ${ENDPOINT}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  "${ENDPOINT}")

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Result: HTTP ${HTTP_CODE}"
if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 400 ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS: Supabase project is active. Inactivity timer reset."
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] NOTED: Gateway ping registered (HTTP ${HTTP_CODE})."
fi
