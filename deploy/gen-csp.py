#!/usr/bin/env python3
"""Write the CSP snippet for a release, derived from its own HTML.

Every script this site ships is inline: Astro inlines small bundles, and the
theme script is deliberately `is:inline` so it runs before first paint without
a flash. A plain `script-src 'self'` blocks all of them, and does it silently —
pages still render, only the interactive parts die.

Hashes rather than 'unsafe-inline': the point of the policy is that an injected
<script> must not run, and 'unsafe-inline' would hand that back.

This runs on the server against the release being activated, so the header can
never drift from the HTML actually being served.
"""
import base64
import hashlib
import pathlib
import re
import sys

# Only scripts without src are covered by a hash; external ones need 'self'.
INLINE = re.compile(rb"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", re.S)

release = pathlib.Path(sys.argv[1])
out = pathlib.Path(sys.argv[2])

hashes = set()
for page in release.rglob("*.html"):
    for body in INLINE.findall(page.read_bytes()):
        digest = hashlib.sha256(body).digest()
        hashes.add(f"'sha256-{base64.b64encode(digest).decode()}'")

if not hashes:
    print("no inline scripts found — refusing to write an empty policy", file=sys.stderr)
    sys.exit(1)

# Cloudflare injects an email-decoding script tag with a src on the origin, so
# 'self' has to stay alongside the hashes.
script_src = "'self' " + " ".join(sorted(hashes))

policy = (
    "default-src 'self'; "
    "img-src 'self' data: https:; "
    "style-src 'self' 'unsafe-inline'; "
    f"script-src {script_src}; "
    "font-src 'self'; "
    "connect-src 'self'; "
    "frame-ancestors 'none'; "
    "base-uri 'self'; "
    "form-action 'self'"
)

out.write_text(f'header Content-Security-Policy "{policy}"\n', encoding="utf-8")
print(f"csp: {len(hashes)} inline script hashes -> {out}")
