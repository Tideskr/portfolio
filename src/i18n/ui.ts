import { DEFAULT_LOCALE, LOCALES, type Locale } from '~/consts';

/**
 * UI copy. Every key must exist in every locale — the `satisfies` clause below
 * turns a missing translation into a TypeScript error rather than a blank
 * string on the page.
 */
const en = {
  'nav.home': 'Home',
  'nav.blog': 'Notes',
  'nav.projects': 'Projects',
  'nav.links': 'Links',
  'nav.about': 'About',
  'nav.menu': 'Menu',
  'nav.close': 'Close menu',

  'a11y.skip': 'Skip to main content',
  'a11y.toggleTheme': 'Switch to light mode',
  'a11y.switchLang': 'Switch to Chinese',
  'a11y.toTop': 'Back to top',

  'home.kicker': 'A small corner of the web',
  'home.role': 'Tools, notes, and things worth keeping',
  'home.tagline': 'Made slowly, with room for questions and second thoughts.',
  'home.intro':
    'Skr comes from *seeker*. The name is less an answer than a way of paying attention.',
  'home.cta.read': 'Read the notes',
  'home.cta.work': 'See the projects',
  'home.featured': 'A few projects',
  'home.latest': 'New notes',
  'home.viewAll': 'All notes',
  'home.viewAllProjects': 'More projects',
  'home.elsewhere': 'Elsewhere',
  'home.eyebrowWork': 'Projects',
  'home.eyebrowLog': 'Notes',

  'blog.title': 'Notes',
  'blog.subtitle': 'Things noticed, considered, and set down before they slip away.',
  'blog.empty': 'No notes here yet.',
  'blog.readMore': 'Read note',
  'blog.readingTime': 'min read',
  'blog.published': 'Published',
  'blog.updated': 'Updated',
  'blog.tags': 'Tags',
  'blog.allTags': 'All tags',
  'blog.taggedWith': 'Tag',
  'blog.postCount': 'notes',
  'blog.postCountOne': 'note',
  'blog.backToBlog': 'Back to all notes',
  'blog.prev': 'Previous',
  'blog.next': 'Next',
  'blog.writtenIn': 'Written in',
  'blog.langEn': 'English',
  'blog.langZh': 'Chinese',
  'blog.toc': 'On this page',

  'projects.title': 'Projects',
  'projects.subtitle': 'Some are still in use. Others have simply run their course.',
  'projects.empty': 'No projects here yet.',
  'projects.source': 'View source',
  'projects.visit': 'Open project',
  'projects.writeup': 'Read note',
  'projects.featured': 'Featured',
  'projects.archived': 'Archived',

  'links.title': 'Links',
  'links.subtitle': 'A short list of places worth returning to.',
  'links.empty': 'No links yet.',
  'links.exchange': 'Exchange links',
  'links.exchangeBody': 'Send a site name, URL, optional avatar, and one short line about it.',

  'about.title': 'About',
  'about.subtitle': 'A little context for what lives here.',

  'footer.builtWith': 'Made with Astro. Kept deliberately simple.',
  'footer.source': 'Source',
  'footer.rss': 'RSS',
  'footer.rights': 'All rights reserved.',

  '404.title': 'Page not found',
  '404.body': 'There is nothing at this address.',
  '404.home': 'Go home',
} as const;

const zh = {
  'nav.home': '首页',
  'nav.blog': '随笔',
  'nav.projects': '项目',
  'nav.links': '友链',
  'nav.about': '关于',
  'nav.menu': '菜单',
  'nav.close': '关闭菜单',

  'a11y.skip': '跳转到主要内容',
  'a11y.toggleTheme': '切换到浅色模式',
  'a11y.switchLang': '切换到英文',
  'a11y.toTop': '回到顶部',

  'home.kicker': '网络一隅',
  'home.role': '工具、文字，以及值得留下的东西',
  'home.tagline': '慢一点做，也给问题和反复留些余地。',
  'home.intro': 'Skr 取自 *seeker*。比起答案，这个名字更像一种留心观看的方式。',
  'home.cta.read': '读几篇',
  'home.cta.work': '看项目',
  'home.featured': '几个项目',
  'home.latest': '新近写下',
  'home.viewAll': '全部文章',
  'home.viewAllProjects': '更多项目',
  'home.elsewhere': '别处',
  'home.eyebrowWork': '项目',
  'home.eyebrowLog': '随笔',

  'blog.title': '随笔',
  'blog.subtitle': '记下一些看见的、想过的，以及不愿太快忘掉的事。',
  'blog.empty': '这里还没有文章。',
  'blog.readMore': '阅读全文',
  'blog.readingTime': '分钟阅读',
  'blog.published': '发布于',
  'blog.updated': '更新于',
  'blog.tags': '标签',
  'blog.allTags': '全部标签',
  'blog.taggedWith': '标签',
  'blog.postCount': '篇',
  'blog.postCountOne': '篇',
  'blog.backToBlog': '返回全部随笔',
  'blog.prev': '上一篇',
  'blog.next': '下一篇',
  'blog.writtenIn': '写作语言',
  'blog.langEn': '英文',
  'blog.langZh': '中文',
  'blog.toc': '目录',

  'projects.title': '项目',
  'projects.subtitle': '有些仍在使用，有些已经走完了自己的路。',
  'projects.empty': '暂时还没有项目。',
  'projects.source': '查看源码',
  'projects.visit': '打开项目',
  'projects.writeup': '阅读说明',
  'projects.featured': '精选',
  'projects.archived': '已归档',

  'links.title': '友链',
  'links.subtitle': '一份很短的清单，收着值得再去的地方。',
  'links.empty': '这里还没有友链。',
  'links.exchange': '交换友链',
  'links.exchangeBody': '来信附上站点名称、网址、可选的头像，以及一句简短介绍即可。',

  'about.title': '关于',
  'about.subtitle': '关于这里，以及它为何是现在的样子。',

  'footer.builtWith': '用 Astro 搭建，尽量保持简单。',
  'footer.source': '源码',
  'footer.rss': 'RSS',
  'footer.rights': '保留所有权利。',

  '404.title': '页面不存在',
  '404.body': '这个地址下没有内容。',
  '404.home': '回到首页',
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
