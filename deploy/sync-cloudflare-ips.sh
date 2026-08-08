#!/usr/bin/env bash
#
# Refresh the Cloudflare IP ranges in the Caddyfile's trusted_proxies list.
#
# The stock Caddy binary has no `cloudflare` IP source (that needs a plugin), so
# the ranges are inlined. They change rarely — a handful of times a decade — but
# a stale list means client_ip falls back to the edge address rather than the
# visitor's. Run this if Cloudflare announces a change, then reload Caddy.

set -euo pipefail

CADDYFILE="${1:-/etc/caddy/Caddyfile}"

v4=$(curl -fsS https://www.cloudflare.com/ips-v4)
v6=$(curl -fsS https://www.cloudflare.com/ips-v6)
ranges=$(printf '%s\n%s\n' "$v4" "$v6" | tr '\n' ' ' | sed 's/ *$//')

[ -n "$ranges" ] || { echo "empty range list, refusing to write" >&2; exit 1; }

cp -a "$CADDYFILE" "$CADDYFILE.bak"
sed -i "s|^\(\s*\)trusted_proxies static .*|\1trusted_proxies static $ranges|" "$CADDYFILE"

if caddy validate --config "$CADDYFILE" >/dev/null 2>&1; then
  echo "updated; reload with: systemctl reload caddy"
  rm -f "$CADDYFILE.bak"
else
  echo "validation failed, restoring" >&2
  mv -f "$CADDYFILE.bak" "$CADDYFILE"
  exit 1
fi
