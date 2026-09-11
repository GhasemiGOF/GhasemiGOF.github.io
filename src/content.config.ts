import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
    heroImage: z.string().optional(),
    featured: z.boolean().optional().default(false),
    readingTime: z.number().optional(),
    updatedDate: z.coerce.date().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    toc: z.boolean().optional().default(true),
    keywords: z.array(z.string()).optional(),
    canonicalUrl: z.string().optional(),
    ogImage: z.string().optional(),
    related: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    icon: z.enum(['shadonet', 'spore', 'topo']),
    tag: z.string(),
    status: z.string().optional().default('In progress'),
    order: z.number(),
    keywords: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, projects };
