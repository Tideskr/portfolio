// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://skr.moe',
  output: 'static',
  // One canonical URL shape: no trailing slash. The i18n link helpers and the
  // canonical/hreflang tags all follow this, and nginx serves it via $uri.html.
  trailingSlash: 'never',

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
