import { createHash } from 'node:crypto';

const readingPriority = { start: 0, next: 1, compare: 1, optional: 2, reference: 2 };

// Shared by static page rendering and the offline manifest generator.
export function buildBookTopicIndex(topics, knownBookSlugs) {
  const index = new Map();
  for (const topic of topics) {
    const seenBooks = new Set();
    for (const book of topic.books || []) {
      if (book.status !== 'in_library') continue;
      if (!book.slug || !knownBookSlugs.has(book.slug)) {
        throw new Error(`Unknown book reference in ${topic.slug}: ${book.slug || book.title}`);
      }
      if (seenBooks.has(book.slug)) continue;
      seenBooks.add(book.slug);
      const associations = index.get(book.slug) || [];
      associations.push({
        slug: topic.slug,
        title: topic.title,
        reason: book.reason,
        domain: topic.domains?.[0] || topic.domain || '',
        priority: readingPriority[book.reading] ?? 2,
      });
      index.set(book.slug, associations);
    }
  }
  for (const [slug, associations] of index) {
    associations.sort((a, b) => a.priority - b.priority ||
      a.domain.localeCompare(b.domain, 'zh-CN') ||
      a.title.localeCompare(b.title, 'zh-CN') || a.slug.localeCompare(b.slug));
    index.set(slug, associations.map(({ slug, title, reason }) => ({ slug, title, reason })));
  }
  return index;
}

export function bookPageHash(sourceHash, relatedTopics) {
  // Preserve existing hashes for pages without the new module. Removing the last
  // association still changes a previously combined hash back to the source hash.
  if (relatedTopics.length === 0) return sourceHash;
  return createHash('sha256')
    .update(JSON.stringify([sourceHash, relatedTopics]))
    .digest('hex').slice(0, 16);
}
