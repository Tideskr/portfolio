import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Posts are written in whichever language they were thought in — `lang` records
 * that. The UI chrome around them is translated; the prose is not.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      lang: z.enum(['en', 'zh']),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

const localized = z.object({ en: z.string(), zh: z.string() });

/**
 * Projects are data, not prose — a card grid on /projects. A project with a
 * long-form story links to a blog post instead of getting its own page type.
 */
const projects = defineCollection({
  loader: file('./src/content/projects.yaml'),
  schema: z.object({
    title: localized,
    summary: localized,
    year: z.number().int(),
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    url: z.url().optional(),
    post: reference('blog').optional(),
    featured: z.boolean().default(false),
    archived: z.boolean().default(false),
    /** Two hex colours; the card renders a gradient chip from them. */
    accent: z.tuple([z.string(), z.string()]).optional(),
  }),
});

const links = defineCollection({
  loader: file('./src/content/links.yaml'),
  schema: z.object({
    name: z.string(),
    url: z.url(),
    avatar: z.string().optional(),
    desc: localized,
  }),
});

export const collections = { blog, projects, links };
