import type { MetadataRoute } from 'next';
import { getAllBookMetas } from '@/lib/books';

export const dynamic = 'force-static';

const BASE_URL = 'https://reading.cearl.cc';

export default function sitemap(): MetadataRoute.Sitemap {
  const books = getAllBookMetas();

  const bookEntries: MetadataRoute.Sitemap = books.map(book => ({
    url: `${BASE_URL}/books/${book.slug}/`,
    lastModified: book.addedAt ? new Date(book.addedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/search/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...bookEntries,
  ];
}
