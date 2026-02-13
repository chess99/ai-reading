import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BookFrontmatter {
  slug?: string;
  title?: string;
  author?: string;
  tags?: string[];
}

export interface BookMeta {
  slug: string;
  title: string;
  author: string;
  category: string;
  categoryPath: string[];
  tags: string[];
}

export interface BookDetail extends BookMeta {
  content: string;
  filePath: string;
}

export interface BookTreeNode {
  name: string;
  type: 'category' | 'book';
  path: string;
  children?: BookTreeNode[];
  book?: BookMeta;
}

const BOOKS_DIR = path.join(process.cwd(), '..', 'books');
let cachedBookDetails: BookDetail[] | null = null;

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

function extractCategoryPath(filePath: string): string[] {
  const relativePath = path.relative(BOOKS_DIR, path.dirname(filePath));
  if (!relativePath || relativePath === '.') {
    return [];
  }
  return relativePath.split(path.sep);
}

function toBookMeta(book: BookDetail): BookMeta {
  return {
    slug: book.slug,
    title: book.title,
    author: book.author,
    category: book.category,
    categoryPath: book.categoryPath,
    tags: book.tags,
  };
}

function loadBookDetails(): BookDetail[] {
  if (cachedBookDetails) {
    return cachedBookDetails;
  }

  const books: BookDetail[] = [];
  const scanDirectory = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith('.md')) {
        continue;
      }
      try {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const { data, content } = matter(fileContent);
        const frontmatter = data as Partial<BookFrontmatter>;
        const { author, title } = parseFilename(entry.name);
        const categoryPath = extractCategoryPath(fullPath);
        books.push({
          slug: frontmatter.slug || entry.name.replace(/\.md$/, ''),
          title: frontmatter.title || title,
          author: frontmatter.author || author,
          category: categoryPath.join('/') || '未分类',
          categoryPath,
          tags: frontmatter.tags || [],
          content,
          filePath: fullPath,
        });
      } catch (error) {
        console.error(`Error parsing book ${fullPath}:`, error);
      }
    }
  };

  scanDirectory(BOOKS_DIR);
  cachedBookDetails = books;
  return books;
}

export function getAllBookMetas(): BookMeta[] {
  return loadBookDetails().map(toBookMeta);
}

export function getAllBookDetails(): BookDetail[] {
  return loadBookDetails();
}

export function getBookDetailBySlug(slug: string): BookDetail | null {
  const books = loadBookDetails();
  return books.find(book => book.slug === slug) || null;
}

export function getAllCategories(): string[] {
  const categories = new Set(getAllBookMetas().map(book => book.category));
  return Array.from(categories).sort();
}

export function getBooksByCategory(category: string): BookMeta[] {
  return getAllBookMetas().filter(book => book.category === category);
}

export function buildBookTree(): BookTreeNode[] {
  const books = getAllBookMetas();
  const root: BookTreeNode[] = [];

  function getOrCreateCategory(parent: BookTreeNode[], categoryName: string, fullPath: string): BookTreeNode {
    let node = parent.find(n => n.name === categoryName && n.type === 'category');
    if (!node) {
      node = { name: categoryName, type: 'category', path: fullPath, children: [] };
      parent.push(node);
    }
    return node;
  }

  for (const book of books) {
    let currentLevel = root;
    let pathSoFar = '';
    for (const categoryName of book.categoryPath) {
      pathSoFar = pathSoFar ? `${pathSoFar}/${categoryName}` : categoryName;
      const categoryNode = getOrCreateCategory(currentLevel, categoryName, pathSoFar);
      currentLevel = categoryNode.children!;
    }
    currentLevel.push({
      name: `${book.author} - ${book.title}`,
      type: 'book',
      path: `/books/${book.slug}`,
      book,
    });
  }

  const sortTree = (nodes: BookTreeNode[]) => {
    nodes.sort((a, b) => {
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
  };

  sortTree(root);
  return root;
}

export function getAllTags(): { tag: string; count: number }[] {
  const tagCount = new Map<string, number>();
  getAllBookMetas().forEach(book => {
    book.tags.forEach(tag => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagCount.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function searchBooks(keyword: string): BookMeta[] {
  const lowerKeyword = keyword.toLowerCase();
  return getAllBookMetas().filter(book => {
    return (
      book.title.toLowerCase().includes(lowerKeyword) ||
      book.author.toLowerCase().includes(lowerKeyword) ||
      book.category.toLowerCase().includes(lowerKeyword) ||
      book.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  });
}
