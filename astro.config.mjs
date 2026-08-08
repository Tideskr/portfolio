// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Every post is emitted under both locales, but the copy whose chrome does not
 * match its prose is `noindex` (see src/layouts/Post.astro). Listing a noindex
 * URL in the sitemap asks crawlers to index something we told them not to, so
 * the mirrors are filtered out here. Frontmatter is read directly because the
 * config runs before `astro:content` exists.
 */
const POST_MIRRORS = new Set(
  readdirSync('src/content/blog')
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => {
      const slug = name.replace(/\.mdx?$/, '');
      const lang = readFileSync(`src/content/blog/${name}`, 'utf8').match(
        /^lang:\s*['"]?(\w+)/m,
      )?.[1];
      return lang === 'zh' ? `/blog/${slug}` : `/zh/blog/${slug}`;
    }),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://skr.moe',
  output: 'static',
  // One canonical URL shape: no trailing slash. The i18n link helpers and the
  // canonical/hreflang tags all follow this, and nginx serves it via $uri.html.
  trailingSlash: 'never',

  build: {
    // `file` emits dist/blog.html rather than dist/blog/index.html. With the
    // directory layout nginx would 301 /blog → /blog/ to serve the index,
    // undoing the canonical shape above.
    format: 'file',
  },

  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    routing: {
      // English lives at the root (/), Chinese under /zh.
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !POST_MIRRORS.has(new URL(page).pathname),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', zh: 'zh-CN' },
      },
    }),
  ],

  image: {
    // Ship modern formats; sharp handles the conversion at build time.
    responsiveStyles: true,
  },

  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
