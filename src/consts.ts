import type { IconName } from '~/components/icons';

/**
 * Site-wide constants. Anything here is safe to edit without touching layout code.
 * TODO(skr): replace the placeholder handles below with your real accounts.
 */

export const SITE = {
  domain: 'skr.moe',
  url: 'https://skr.moe',
  author: 'Skr',
  /** `skr` is short for *seeker*. */
  handle: 'skr',
  email: 'contact@skr.moe',
  startYear: 2026,
} as const;

export type Locale = 'en' | 'zh';
export const LOCALES = ['en', 'zh'] as const satisfies readonly Locale[];
export const DEFAULT_LOCALE: Locale = 'en';

export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
};

/** BCP-47 tags used for <html lang> and hreflang. */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-Hans',
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  /** Key in the icon set (see src/components/icons.ts). */
  icon: IconName;
};

export const SOCIALS: SocialLink[] = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/TideSkr', icon: 'github' },
  { id: 'x', label: 'X', href: 'https://x.com/SkrTide', icon: 'x' },
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/TideSkr', icon: 'telegram' },
  { id: 'mail', label: 'Email', href: `mailto:${SITE.email}`, icon: 'mail' },
  { id: 'rss', label: 'RSS', href: '/rss.xml', icon: 'rss' },
];

/** Primary navigation. `path` is locale-agnostic; links are built with getRelativeLocaleUrl. */
export const NAV = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.blog', path: '/blog' },
  { key: 'nav.projects', path: '/projects' },
  { key: 'nav.links', path: '/links' },
  { key: 'nav.about', path: '/about' },
] as const;
