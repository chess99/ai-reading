/**
 * 从书籍集合中提取所有标签及其统计信息
 */
export interface TagData {
  name: string;
  count: number;
  books: string[]; // book slugs
}

export function extractAllTags(books: any[]): TagData[] {
  const tagMap = new Map<string, Set<string>>();

  books.forEach((book) => {
    const tags = book.data.tags || [];
    const slug = book.data.slug || book.id;

    tags.forEach((tag: string) => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, new Set());
      }
      tagMap.get(tag)!.add(slug);
    });
  });

  const tagData: TagData[] = Array.from(tagMap.entries())
    .map(([name, bookSet]) => ({
      name,
      count: bookSet.size,
      books: Array.from(bookSet),
    }))
    .sort((a, b) => b.count - a.count);

  return tagData;
}
