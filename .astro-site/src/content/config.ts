import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const books = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: new URL('../../../books', import.meta.url)
  }),
  schema: z.object({
    // 只保留 tags，title/author/category 从文件路径解析
    tags: z.array(z.string()).optional(),
    // 可选的额外字段
    rating: z.number().min(0).max(5).optional(),
    readDate: z.date().optional(),
  }),
});

export const collections = { books };
