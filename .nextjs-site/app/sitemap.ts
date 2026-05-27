import type { MetadataRoute } from 'next';
import { getAllBookMetas } from '@/lib/books';
import { BASE_URL } from '@/lib/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const books = getAllBookMetas();

  const bookEntries: MetadataRoute.Sitemap = books.map(book => ({
    url: `${BASE_URL}/books/${book.slug}/`,
    lastModified: new Date(book.addedAt),
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
    {
      url: `${BASE_URL}/library/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...bookEntries,
  ];
}
