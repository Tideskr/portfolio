import rss from '@astrojs/rss';
import { getRelativeLocaleUrl } from 'astro:i18n';
import type { APIContext } from 'astro';
import { SITE, HTML_LANG } from '~/consts';
import { ui } from '~/i18n/ui';
import { getPosts } from '~/lib/posts';

/**
 * One feed for everything. Posts are written in whichever language they were
 * thought in, so each item carries `dc:language` rather than the site being
 * split into two half-empty feeds.
 */
export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: `${SITE.author} — ${ui.en['blog.title']}`,
    description: ui.en['blog.subtitle'],
    site: context.site ?? SITE.url,
    // Match `trailingSlash: 'never'`; @astrojs/rss appends one by default and
    // the feed would then point at a different URL than the canonical tag.
    trailingSlash: false,
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    customData: `<language>${HTML_LANG.en}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      // The canonical copy is the one whose chrome matches the prose; the other
      // locale's mirror is noindex, so the feed must not send readers there.
      link: getRelativeLocaleUrl(post.data.lang, `/blog/${post.id}`),
      categories: post.data.tags,
      customData: `<dc:language>${HTML_LANG[post.data.lang]}</dc:language>`,
    })),
  });
}
