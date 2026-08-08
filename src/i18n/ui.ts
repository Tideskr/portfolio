import { DEFAULT_LOCALE, LOCALES, type Locale } from '~/consts';

/**
 * UI copy. Every key must exist in every locale — the `satisfies` clause below
 * turns a missing translation into a TypeScript error rather than a blank
 * string on the page.
 */
const en = {
  'nav.home': 'Home',
  'nav.blog': 'Writing',
  'nav.projects': 'Projects',
  'nav.links': 'Links',
  'nav.about': 'About',
  'nav.menu': 'Menu',
  'nav.close': 'Close menu',

  'a11y.skip': 'Skip to main content',
  'a11y.toggleTheme': 'Switch to light mode',
  'a11y.switchLang': 'Switch to Chinese',
  'a11y.toTop': 'Back to top',

  'home.kicker': 'Small software, carefully made',
  'home.role': 'Developer · toolmaker · writer',
  'home.tagline':
    'I build small tools and interfaces, then spend too much time making them feel obvious.',
  'home.intro':
    'Skr is short for *seeker*. I like work that rewards attention: clear constraints, boring infrastructure, and interfaces that do not need a manual.',
  'home.cta.read': 'Read the writing',
  'home.cta.work': 'Browse projects',
  'home.featured': 'Selected projects',
  'home.latest': 'Recent writing',
  'home.viewAll': 'All writing',
  'home.viewAllProjects': 'All projects',
  'home.elsewhere': 'Find me elsewhere',
  'home.eyebrowWork': 'Projects',
  'home.eyebrowLog': 'Writing',

  'blog.title': 'Writing',
  'blog.subtitle': 'Notes on software, tools, and the decisions behind them.',
  'blog.empty': 'Nothing published yet. I am still working on the first piece.',
  'blog.readMore': 'Read article',
  'blog.readingTime': 'min read',
  'blog.published': 'Published',
  'blog.updated': 'Updated',
  'blog.tags': 'Tags',
  'blog.allTags': 'All tags',
  'blog.taggedWith': 'Tag',
  'blog.postCount': 'articles',
  'blog.postCountOne': 'article',
  'blog.backToBlog': 'Back to all writing',
  'blog.prev': 'Previous',
  'blog.next': 'Next',
  'blog.writtenIn': 'Written in',
  'blog.langEn': 'English',
  'blog.langZh': 'Chinese',
  'blog.toc': 'On this page',

  'projects.title': 'Projects',
  'projects.subtitle': 'A few things I have made, shipped, shelved, or kept around to learn from.',
  'projects.empty': 'No projects here yet.',
  'projects.source': 'View source',
  'projects.visit': 'Open project',
  'projects.writeup': 'Read note',
  'projects.featured': 'Featured',
  'projects.archived': 'Archived',

  'links.title': 'Links',
  'links.subtitle': 'People, projects, and places I keep coming back to.',
  'links.empty': 'No links yet.',
  'links.exchange': 'Want to be listed here?',
  'links.exchangeBody': 'Send your site name, URL, avatar if you have one, and a short description.',

  'about.title': 'About',
  'about.subtitle': 'A little context, without the résumé.',

  'footer.builtWith': 'Built with Astro, designed and written from scratch.',
  'footer.source': 'Source',
  'footer.rss': 'RSS',
  'footer.rights': 'All rights reserved.',

  '404.title': 'Page not found',
  '404.body': 'The address looks valid, but there is nothing here.',
  '404.home': 'Back home',
} as const;

const zh = {
  'nav.home': '首页',
  'nav.blog': '文章',
  'nav.projects': '项目',
  'nav.links': '友链',
  'nav.about': '关于',
  'nav.menu': '菜单',
  'nav.close': '关闭菜单',

  'a11y.skip': '跳转到主要内容',
  'a11y.toggleTheme': '切换到浅色模式',
  'a11y.switchLang': '切换到英文',
  'a11y.toTop': '回到顶部',

  'home.kicker': '把小东西做好',
  'home.role': '开发者 · 工具制作者 · 写作者',
  'home.tagline': '我做小工具和界面，也会花不少时间把它们打磨到不需要解释。',
  'home.intro':
    'Skr 是 *seeker* 的缩写。我喜欢把问题先说清楚、把基础打牢，再把界面做到顺手。',
  'home.cta.read': '读读文章',
  'home.cta.work': '看看项目',
  'home.featured': '精选项目',
  'home.latest': '最近写的',
  'home.viewAll': '查看全部文章',
  'home.viewAllProjects': '查看全部项目',
  'home.elsewhere': '其他地方也能找到我',
  'home.eyebrowWork': '项目',
  'home.eyebrowLog': '文章',

  'blog.title': '文章',
  'blog.subtitle': '写软件、工具，以及做这些东西时不得不做的判断。',
  'blog.empty': '这里还没有文章，第一篇还在整理。',
  'blog.readMore': '阅读全文',
  'blog.readingTime': '分钟阅读',
  'blog.published': '发布于',
  'blog.updated': '更新于',
  'blog.tags': '标签',
  'blog.allTags': '全部标签',
  'blog.taggedWith': '标签',
  'blog.postCount': '篇文章',
  'blog.postCountOne': '篇文章',
  'blog.backToBlog': '返回文章列表',
  'blog.prev': '上一篇',
  'blog.next': '下一篇',
  'blog.writtenIn': '写作语言',
  'blog.langEn': '英文',
  'blog.langZh': '中文',
  'blog.toc': '目录',

  'projects.title': '项目',
  'projects.subtitle': '这里放着我做过、上线过，也从中学到过东西的项目。',
  'projects.empty': '暂时还没有项目。',
  'projects.source': '查看源码',
  'projects.visit': '打开项目',
  'projects.writeup': '阅读说明',
  'projects.featured': '精选',
  'projects.archived': '已归档',

  'links.title': '友链',
  'links.subtitle': '一些我愿意反复访问的人和项目。',
  'links.empty': '这里还没有友链。',
  'links.exchange': '想出现在这里？',
  'links.exchangeBody': '把站点名称、网址、头像（有的话）和一段简短介绍发给我。',

  'about.title': '关于',
  'about.subtitle': '一些个人背景，也包括我正在做的事。',

  'footer.builtWith': '使用 Astro 搭建，设计和文字都从头开始。',
  'footer.source': '源码',
  'footer.rss': 'RSS',
  'footer.rights': '版权所有。',

  '404.title': '页面不存在',
  '404.body': '这个地址看起来没问题，但这里没有对应的页面。',
  '404.home': '返回首页',
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
