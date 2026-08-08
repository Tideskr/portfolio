# skr.moe

Personal site — [skr.moe](https://skr.moe). Astro, static output, no client-side
framework. Bilingual: English at the root, Chinese under `/zh`.

## Local

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm check      # types + content schemas
pnpm build      # -> dist/
pnpm assets     # regenerate favicon / PWA icons / OG card
```

## Writing

Posts live in `src/content/blog/` as `.md` or `.mdx`. Frontmatter:

```yaml
---
title: Compass as motif
description: One sentence, used for the listing and the meta description.
pubDate: 2026-08-01
lang: en # or zh — the language the post is *written* in
tags: [design, astro]
draft: false
---
```

A post is written in one language and is not mirrored by hand. Both locales
list every post; the chrome around a post in the other locale is translated but
the body is not, and that copy carries `noindex, follow` so search engines only
ever index the canonical URL. Those mirrors are also excluded from the sitemap,
and the feed always links to the canonical.

Projects and links are data, not pages: `src/content/projects.yaml` and
`src/content/links.yaml`.

## Design

Tokens live in `src/styles/global.css` — a single `:root` block for dark and a
`:root.light` block for the dawn variant. Everything else consumes the semantic
names (`--ink`, `--ink-dim`, `--card`, `--beacon`, …) rather than raw palette
values. Every text token clears WCAG AA 4.5:1 against all four surfaces it can
land on; if you retune one, re-check it.

## Deployment

Push to `main`. `.github/workflows/deploy.yml` runs `pnpm check` and
`pnpm build`, rsyncs `dist/` into `/srv/skr.moe/releases/<sha>/` on the origin,
and calls `activate.sh`, which flips the `current` symlink. The swap is a
rename, so a request sees either the whole old release or the whole new one.
The last five releases are kept, which makes a rollback a symlink away:

```bash
ssh deploy@<host> '/srv/skr.moe/activate.sh <older-sha>'
```

### Origin

Debian, Caddy, config in `deploy/Caddyfile` (deployed to `/etc/caddy/`). Caddy
holds its own Let's Encrypt certificate; Cloudflare proxies in front of it in
Full (strict) mode. `www` 301s to the apex, and trailing slashes 301 away, so
every page has exactly one URL.

Astro is built with `format: 'file'` and `trailingSlash: 'never'`, so `/blog`
is a file at `/blog.html` — `try_files` maps the canonical URL onto it without
a redirect. Changing either setting means changing the Caddyfile to match.

`deploy/sync-cloudflare-ips.sh` refreshes the inlined Cloudflare ranges used
for real-visitor-IP logging.
