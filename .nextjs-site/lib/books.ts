import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BookFrontmatter {
  slug?: string;
  title?: string;
  author?: string;
  tags?: string[];
}

export interface Book {
  slug: string;
  title: string;
  author: string;
  category: string; // 显示用的分类路径,如 "商业管理/市场营销"
  categoryPath: string[]; // 分类路径数组,如 ["商业管理", "市场营销"]
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
 * Extract category path from file path
 */
function extractCategoryPath(filePath: string): string[] {
  const relativePath = path.relative(BOOKS_DIR, path.dirname(filePath));
  if (!relativePath || relativePath === '.') {
    return [];
  }
  return relativePath.split(path.sep);
}

/**
 * Get all books from the books directory
 */
export function getAllBooks(): Book[] {
  const books: Book[] = [];

  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
          const { data, content } = matter(fileContent);
          const frontmatter = data as Partial<BookFrontmatter>;

          // Parse from filename as fallback
          const { author, title } = parseFilename(entry.name);

          // Extract category from file path
          const categoryPath = extractCategoryPath(fullPath);
          const category = categoryPath.join('/') || '未分类';

          books.push({
            slug: frontmatter.slug || entry.name.replace(/\.md$/, ''),
            title: frontmatter.title || title,
            author: frontmatter.author || author,
            category,
            categoryPath,
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
  const root: BookTreeNode[] = [];

  // Helper function to get or create a category node
  function getOrCreateCategory(
    parent: BookTreeNode[],
    categoryName: string,
    fullPath: string
  ): BookTreeNode {
    let node = parent.find(n => n.name === categoryName && n.type === 'category');

    if (!node) {
      node = {
        name: categoryName,
        type: 'category',
        path: fullPath,
        children: [],
      };
      parent.push(node);
    }

    return node;
  }

  // Build the tree structure
  for (const book of books) {
    let currentLevel = root;
    let pathSoFar = '';

    // Navigate/create the category hierarchy
    for (const categoryName of book.categoryPath) {
      pathSoFar = pathSoFar ? `${pathSoFar}/${categoryName}` : categoryName;
      const categoryNode = getOrCreateCategory(currentLevel, categoryName, pathSoFar);
      currentLevel = categoryNode.children!;
    }

    // Add the book to the final level
    currentLevel.push({
      name: `${book.author} - ${book.title}`,
      type: 'book',
      path: `/books/${book.slug}`,
      book,
    });
  }

  // Sort recursively
  function sortTree(nodes: BookTreeNode[]) {
    nodes.sort((a, b) => {
      // Categories first, then books
      if (a.type !== b.type) {
        return a.type === 'category' ? -1 : 1;
      }
      return a.name.localeCompare(b.name, 'zh-CN');
    });

    nodes.forEach(node => {
      if (node.children) {
        sortTree(node.children);
      }
    });
  }

  sortTree(root);
  return root;
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
