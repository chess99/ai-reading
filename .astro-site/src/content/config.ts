import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const books = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: new URL('../../../books', import.meta.url)
  }),
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    rating: z.number().min(0).max(5).optional(),
    readDate: z.date().optional(),
    layout: z.string().optional(),
  }),
});

export const collections = { books };
