import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BookFrontmatter {
  slug: string;
  title: string;
  author: string;
  category: string;
  tags?: string[];
}

export interface Book {
  slug: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  content: string;
  filePath: string;
}

export interface BookTreeNode {
  name: string;
  type: 'category' | 'book';
  path: string;
  children?: BookTreeNode[];
  book?: Book;
}

const BOOKS_DIR = path.join(process.cwd(), '..', 'books');

/**
 * Parse book info from filename: 作者-书名.md
 */
function parseFilename(filename: string): { author: string; title: string } {
  const nameWithoutExt = filename.replace(/\.md$/, '');
  const dashIndex = nameWithoutExt.indexOf('-');

  if (dashIndex === -1) {
    return { author: '', title: nameWithoutExt };
  }

  return {
    author: nameWithoutExt.substring(0, dashIndex),
    title: nameWithoutExt.substring(dashIndex + 1),
  };
}

/**
 * Get all books from the books directory
 */
export function getAllBooks(): Book[] {
  const books: Book[] = [];

  function scanDirectory(dir: string, category: string = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        scanDirectory(fullPath, entry.name);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
          const { data, content } = matter(fileContent);
          const frontmatter = data as Partial<BookFrontmatter>;

          // Parse from filename as fallback
          const { author, title } = parseFilename(entry.name);

          books.push({
            slug: frontmatter.slug || entry.name.replace(/\.md$/, ''),
            title: frontmatter.title || title,
            author: frontmatter.author || author,
            category: frontmatter.category || category,
            tags: frontmatter.tags || [],
            content,
            filePath: fullPath,
          });
        } catch (error) {
          console.error(`Error parsing book ${fullPath}:`, error);
        }
      }
    }
  }

  scanDirectory(BOOKS_DIR);
  return books;
}

/**
 * Get a single book by slug
 */
export function getBookBySlug(slug: string): Book | null {
  const books = getAllBooks();
  return books.find(book => book.slug === slug) || null;
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const books = getAllBooks();
  const categories = new Set(books.map(book => book.category));
  return Array.from(categories).sort();
}

/**
 * Get books by category
 */
export function getBooksByCategory(category: string): Book[] {
  const books = getAllBooks();
  return books.filter(book => book.category === category);
}

/**
 * Build a tree structure for the file explorer
 */
export function buildBookTree(): BookTreeNode[] {
  const books = getAllBooks();
  const tree: BookTreeNode[] = [];
  const categoryMap = new Map<string, BookTreeNode>();

  // Group books by category
  for (const book of books) {
    if (!categoryMap.has(book.category)) {
      const categoryNode: BookTreeNode = {
        name: book.category,
        type: 'category',
        path: book.category,
        children: [],
      };
      categoryMap.set(book.category, categoryNode);
      tree.push(categoryNode);
    }

    const categoryNode = categoryMap.get(book.category)!;
    categoryNode.children!.push({
      name: `${book.author} - ${book.title}`,
      type: 'book',
      path: `/books/${book.slug}`,
      book,
    });
  }

  // Sort categories and books
  tree.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  tree.forEach(category => {
    category.children?.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  });

  return tree;
}

/**
 * Get all unique tags
 */
export function getAllTags(): { tag: string; count: number }[] {
  const books = getAllBooks();
  const tagCount = new Map<string, number>();

  books.forEach(book => {
    book.tags.forEach(tag => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCount.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Search books by keyword
 */
export function searchBooks(keyword: string): Book[] {
  const books = getAllBooks();
  const lowerKeyword = keyword.toLowerCase();

  return books.filter(book => {
    return (
      book.title.toLowerCase().includes(lowerKeyword) ||
      book.author.toLowerCase().includes(lowerKeyword) ||
      book.category.toLowerCase().includes(lowerKeyword) ||
      book.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)) ||
      book.content.toLowerCase().includes(lowerKeyword)
    );
  });
}
