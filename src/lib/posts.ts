import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/**
 * `getCollection` makes no ordering guarantee, so every caller goes through
 * here: drafts dropped in production, newest first.
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Neighbours in the chronological list, for the prev/next footer on a post. */
export function neighbours(posts: Post[], id: string) {
  const index = posts.findIndex((p) => p.id === id);
  return {
    // The list runs newest → oldest, so "previous" is the older entry.
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

/**
 * Reading time. CJK is counted per character (~340 chars/min) and Latin per
 * word (~220 wpm); counting CJK as "words" would report a wildly low number.
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ');

  const cjk = (text.match(/[㐀-鿿豈-﫿぀-ヿ]/g) ?? []).length;
  const latin = (text.replace(/[㐀-鿿豈-﫿぀-ヿ]/g, ' ').match(/\b[\w'-]+\b/g) ?? [])
    .length;

  return Math.max(1, Math.round(cjk / 340 + latin / 220));
}

export function tagSlug(tag: string): string {
  return encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'));
}
