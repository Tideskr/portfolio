import { DEFAULT_LOCALE, LOCALES, type Locale } from '~/consts';

/**
 * UI copy. Every key must exist in every locale — the `satisfies` clause below
 * turns a missing translation into a TypeScript error rather than a blank
 * string on the page.
 */
const en = {
  'nav.home': 'Home',
  'nav.blog': 'Blog',
  'nav.projects': 'Projects',
  'nav.links': 'Links',
  'nav.about': 'About',
  'nav.menu': 'Menu',
  'nav.close': 'Close menu',

  'a11y.skip': 'Skip to content',
  'a11y.toggleTheme': 'Light mode',
  'a11y.switchLang': 'Switch to Chinese',
  'a11y.toTop': 'Back to top',

  'home.kicker': 'Celestial navigation',
  'home.role': 'Seeker · builder · night-shift tinkerer',
  'home.tagline':
    'I chart small, well-made things — tools, interfaces, and the odd corner of the internet.',
  'home.intro':
    '“Skr” is short for *seeker*. I build software the way a navigator reads the sky: fix a bearing, take the next leg, correct as the water changes.',
  'home.cta.read': 'Read the log',
  'home.cta.work': 'See the work',
  'home.featured': 'Selected work',
  'home.latest': 'Recent writing',
  'home.viewAll': 'All posts',
  'home.viewAllProjects': 'All projects',
  'home.elsewhere': 'Elsewhere',
  'home.eyebrowWork': 'Work',
  'home.eyebrowLog': 'Log',

  'blog.title': 'Blog',
  'blog.subtitle': "A ship's log — notes on what I build and what I break.",
  'blog.empty': 'Nothing here yet. The first entry is being written.',
  'blog.readMore': 'Read',
  'blog.readingTime': 'min read',
  'blog.published': 'Published',
  'blog.updated': 'Updated',
  'blog.tags': 'Tags',
  'blog.allTags': 'All tags',
  'blog.taggedWith': 'Tagged',
  'blog.postCount': 'posts',
  'blog.postCountOne': 'post',
  'blog.backToBlog': 'Back to all posts',
  'blog.prev': 'Previous',
  'blog.next': 'Next',
  'blog.writtenIn': 'Written in',
  'blog.langEn': 'English',
  'blog.langZh': 'Chinese',
  'blog.toc': 'On this page',

  'projects.title': 'Projects',
  'projects.subtitle': 'Things I have shipped, half-shipped, or still tinker with.',
  'projects.empty': 'The dock is empty right now.',
  'projects.source': 'Source',
  'projects.visit': 'Visit',
  'projects.writeup': 'Write-up',
  'projects.featured': 'Featured',
  'projects.archived': 'Archived',

  'links.title': 'Links',
  'links.subtitle': 'Good people and good places, worth the detour.',
  'links.empty': 'No links yet.',
  'links.exchange': 'Want to trade links?',
  'links.exchangeBody': 'Send me a note with your site name, URL, avatar and a one-line description.',

  'about.title': 'About',
  'about.subtitle': 'Who is behind the compass.',

  'footer.builtWith': 'Built with Astro. Hand-drawn, no template.',
  'footer.source': 'Source',
  'footer.rss': 'RSS',
  'footer.rights': 'All rights reserved.',

  '404.title': 'Off course',
  '404.body': 'No chart for this heading. The page you asked for is not here.',
  '404.home': 'Return to port',
} as const;

const zh = {
  'nav.home': '首页',
  'nav.blog': '博客',
  'nav.projects': '项目',
  'nav.links': '友链',
  'nav.about': '关于',
  'nav.menu': '菜单',
  'nav.close': '关闭菜单',

  'a11y.skip': '跳到主要内容',
  'a11y.toggleTheme': '浅色模式',
  'a11y.switchLang': '切换到英文',
  'a11y.toTop': '回到顶部',

  'home.kicker': '以星辰导航',
  'home.role': '寻路者 · 造物者 · 夜航修补匠',
  'home.tagline': '我做一些小而讲究的东西：工具、界面，还有互联网上一些少有人问津的角落。',
  'home.intro':
    '「Skr」取自 *seeker*，意思是寻路者。我写代码就像领航员看星辰认路：先定一个方向，走完这一程，再根据风浪随时修正。',
  'home.cta.read': '翻开航海日志',
  'home.cta.work': '看看作品',
  'home.featured': '精选作品',
  'home.latest': '最近写的',
  'home.viewAll': '全部文章',
  'home.viewAllProjects': '全部项目',
  'home.elsewhere': '在别处',
  'home.eyebrowWork': '作品',
  'home.eyebrowLog': '日志',

  'blog.title': '博客',
  'blog.subtitle': '一份航海日志，记录我造了什么，又弄坏了什么。',
  'blog.empty': '这里还空着，第一篇正在写。',
  'blog.readMore': '阅读',
  'blog.readingTime': '分钟',
  'blog.published': '发布于',
  'blog.updated': '更新于',
  'blog.tags': '标签',
  'blog.allTags': '全部标签',
  'blog.taggedWith': '标签',
  'blog.postCount': '篇',
  'blog.postCountOne': '篇',
  'blog.backToBlog': '返回文章列表',
  'blog.prev': '上一篇',
  'blog.next': '下一篇',
  'blog.writtenIn': '原文语言',
  'blog.langEn': '英文',
  'blog.langZh': '中文',
  'blog.toc': '本页目录',

  'projects.title': '项目',
  'projects.subtitle': '已经完工出海的，做到一半的，还有仍在船坞里敲敲打打的。',
  'projects.empty': '船坞暂时是空的。',
  'projects.source': '源码',
  'projects.visit': '访问',
  'projects.writeup': '相关文章',
  'projects.featured': '精选',
  'projects.archived': '已归档',

  'links.title': '友链',
  'links.subtitle': '值得绕路一趟的人和地方。',
  'links.empty': '还没有友链。',
  'links.exchange': '想交换友链？',
  'links.exchangeBody': '把站点名称、网址、头像和一句话简介发给我就好。',

  'about.title': '关于',
  'about.subtitle': '罗盘背后的人。',

  'footer.builtWith': '基于 Astro 构建，纯手工设计，不套模板。',
  'footer.source': '源码',
  'footer.rss': 'RSS',
  'footer.rights': '保留所有权利。',

  '404.title': '偏离航线',
  '404.body': '没有海图指向这个方位，你要找的页面并不在这里。',
  '404.home': '返回港口',
} as const;

export type UIKey = keyof typeof en;

export const ui = { en, zh } satisfies Record<Locale, Record<UIKey, string>>;

/** Narrow an arbitrary string (e.g. `Astro.currentLocale`) to a known locale. */
export function asLocale(value: string | undefined): Locale {
  return (LOCALES as readonly string[]).includes(value ?? '')
    ? (value as Locale)
    : DEFAULT_LOCALE;
}

/** Read the locale out of a URL pathname, for use where currentLocale is awkward. */
export function getLangFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  return asLocale(first);
}

export function useTranslations(lang: Locale) {
  return function t(key: UIKey): string {
    return ui[lang][key];
  };
}

/**
 * The public shape of a path, matching `trailingSlash: 'never'`.
 *
 * With `build.format: 'file'` the build-time `Astro.url.pathname` carries the
 * on-disk extension (`/blog.html`), which must not reach a canonical, an
 * hreflang, or a link. In dev the pathname is already clean, so this is a
 * no-op there.
 */
export function canonicalPath(pathname: string): string {
  const clean = pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  return clean.length > 1 ? clean.replace(/\/$/, '') : '/';
}

/**
 * Map the current pathname onto the other locale, keeping the reader on the
 * same page instead of bouncing them to the homepage.
 */
export function switchLocalePath(pathname: string, to: Locale): string {
  const stripped = pathname.replace(/^\/zh(?=\/|$)/, '') || '/';
  const target = to === DEFAULT_LOCALE ? stripped : `/zh${stripped === '/' ? '' : stripped}`;
  return target === '' ? '/' : target;
}

export const OTHER_LOCALE: Record<Locale, Locale> = { en: 'zh', zh: 'en' };

/** Locale-aware date formatting, used on cards and post headers. */
export function formatDate(date: Date, lang: Locale): string {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: lang === 'zh' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
