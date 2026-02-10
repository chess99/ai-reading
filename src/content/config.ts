import { defineCollection, z } from 'astro:content';

const books = defineCollection({
  type: 'content',
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
