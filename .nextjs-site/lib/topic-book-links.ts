import type { TopicBookRecommendation } from './topics';
interface MarkdownNode { type: string; value?: string; url?: string; children?: MarkdownNode[]; }
export function topicBookHref(book: TopicBookRecommendation, index: number): string {
  return book.status === 'in_library' && book.slug ? `/books/${book.slug}/` : `#book-${index + 1}`;
}
export function remarkTopicBookLinks(books: TopicBookRecommendation[]) {
  const links = new Map<string, string>();
  books.forEach((book, index) => {
    const href = topicBookHref(book, index);
    links.set(book.title, href);
    // A subtitle can be omitted in prose; only use an unambiguous main title.
    const mainTitle = book.title.split(/[：:]/)[0];
    if (books.filter(item => item.title.split(/[：:]/)[0] === mainTitle).length === 1) links.set(mainTitle, href);
  });
  return (tree: MarkdownNode) => {
    function visit(node: MarkdownNode) {
      if (!node.children || ['link', 'linkReference', 'code', 'inlineCode', 'html'].includes(node.type)) return;
      node.children = node.children.flatMap(child => {
        if (child.type !== 'text' || !child.value) { visit(child); return [child]; }
        const result: MarkdownNode[] = [];
        let cursor = 0;
        for (const match of child.value.matchAll(/《([^》]+)》/g)) {
          const href = links.get(match[1]);
          if (!href) continue;
          const start = match.index!;
          if (start > cursor) result.push({ type: 'text', value: child.value.slice(cursor, start) });
          result.push({ type: 'link', url: href, children: [{ type: 'text', value: match[0] }] });
          cursor = start + match[0].length;
        }
        if (cursor === 0) return [child];
        if (cursor < child.value.length) result.push({ type: 'text', value: child.value.slice(cursor) });
        return result;
      });
    }
    visit(tree);
  };
}
