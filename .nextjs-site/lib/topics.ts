import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BookMeta, getAllBookMetas } from '@/lib/books';

export type TopicBookStatus = 'in_library' | 'planned';

export interface TopicBookRecommendation {
  title: string;
  author: string;
  role: string;
  reason: string;
  status: TopicBookStatus;
  slug?: string;
  book?: BookMeta;
}

export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  bookCount: number;
}

export interface TopicDetail extends TopicMeta {
  content: string;
  books: TopicBookRecommendation[];
  filePath: string;
}

interface TopicFrontmatter {
  slug?: string;
  title?: string;
  description?: string;
  tags?: string[];
  date?: string;
  books?: TopicBookRecommendation[];
}

const TOPICS_DIR = path.join(process.cwd(), '..', 'topics');
let cachedTopicDetails: TopicDetail[] | null = null;

function toTopicMeta(topic: TopicDetail): TopicMeta {
  return {
    slug: topic.slug,
    title: topic.title,
    description: topic.description,
    tags: topic.tags,
    date: topic.date,
    bookCount: topic.bookCount,
  };
}

function normalizeTopicBook(book: TopicBookRecommendation, bookBySlug: Map<string, BookMeta>): TopicBookRecommendation {
  const normalized: TopicBookRecommendation = {
    title: book.title,
    author: book.author,
    role: book.role,
    reason: book.reason,
    status: book.status,
    slug: book.slug,
  };

  if (book.status === 'in_library' && book.slug) {
    normalized.book = bookBySlug.get(book.slug);
  }

  return normalized;
}

function loadTopicDetails(): TopicDetail[] {
  if (cachedTopicDetails) {
    return cachedTopicDetails;
  }

  if (!fs.existsSync(TOPICS_DIR)) {
    cachedTopicDetails = [];
    return cachedTopicDetails;
  }

  const bookBySlug = new Map(getAllBookMetas().map(book => [book.slug, book]));
  const topics: TopicDetail[] = [];

  for (const entry of fs.readdirSync(TOPICS_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    const filePath = path.join(TOPICS_DIR, entry.name);
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      const frontmatter = data as TopicFrontmatter;
      const slug = frontmatter.slug || entry.name.replace(/\.md$/, '');
      const books = (frontmatter.books || []).map(book => normalizeTopicBook(book, bookBySlug));

      topics.push({
        slug,
        title: frontmatter.title || slug,
        description: frontmatter.description || '',
        tags: frontmatter.tags || [],
        date: frontmatter.date || '',
        bookCount: books.length,
        books,
        content,
        filePath,
      });
    } catch (error) {
      console.error(`Error parsing topic ${filePath}:`, error);
    }
  }

  cachedTopicDetails = topics.sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    return dateCompare || a.title.localeCompare(b.title, 'zh-CN');
  });
  return cachedTopicDetails;
}

export function getAllTopicMetas(): TopicMeta[] {
  return loadTopicDetails().map(toTopicMeta);
}

export function getAllTopicDetails(): TopicDetail[] {
  return loadTopicDetails();
}

export function getTopicDetailBySlug(slug: string): TopicDetail | null {
  return loadTopicDetails().find(topic => topic.slug === slug) || null;
}

export function getLatestTopics(n = 3): TopicMeta[] {
  return getAllTopicMetas().slice(0, n);
}
