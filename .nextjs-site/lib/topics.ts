import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BookMeta, getAllBookMetas } from '@/lib/books';

export type TopicBookStatus = 'in_library' | 'planned';
export type TopicKind = 'primary' | 'specialty';

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
  domain?: string;
  group?: string;
  kind: TopicKind;
  parentSlug?: string;
  searchText: string;
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
  domain?: string;
  group?: string;
  kind?: TopicKind;
  parent?: string;
  books?: TopicBookRecommendation[];
}

export interface TopicMerge {
  slug: string;
  title: string;
  targetSlug: string;
}

export const TOPIC_MERGES: TopicMerge[] = [
  {
    slug: 'qin-mi-chong-tu',
    title: '如何处理亲密关系中的冲突',
    targetSlug: 'qin-mi-guan-xi',
  },
  {
    slug: 'chan-pin-ji-hui',
    title: '如何验证产品机会',
    targetSlug: 'chan-pin-0-dao-1',
  },
  {
    slug: 'shu-zi-gong-gong-sheng-huo',
    title: '数字公共生活与信息网络',
    targetSlug: 'mei-ti-gong-gong-tao-lun',
  },
];

const TOPICS_DIR = path.join(process.cwd(), '..', 'topics');
let cachedTopicDetails: TopicDetail[] | null = null;

function buildTopicSearchText(topic: Pick<TopicDetail, 'title' | 'description' | 'tags' | 'domain' | 'group' | 'books'>): string {
  return [
    topic.title,
    topic.description,
    topic.domain,
    topic.group,
    ...topic.tags,
    ...topic.books.flatMap(book => [book.title, book.author, book.role, book.reason]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function toTopicMeta(topic: TopicDetail): TopicMeta {
  return {
    slug: topic.slug,
    title: topic.title,
    description: topic.description,
    tags: topic.tags,
    date: topic.date,
    bookCount: topic.bookCount,
    domain: topic.domain,
    group: topic.group,
    kind: topic.kind,
    parentSlug: topic.parentSlug,
    searchText: buildTopicSearchText(topic),
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
      const kind: TopicKind = frontmatter.kind === 'specialty' ? 'specialty' : 'primary';

      topics.push({
        slug,
        title: frontmatter.title || slug,
        description: frontmatter.description || '',
        tags: frontmatter.tags || [],
        date: frontmatter.date || '',
        bookCount: books.length,
        domain: frontmatter.domain,
        group: frontmatter.group,
        kind,
        parentSlug: kind === 'specialty' ? frontmatter.parent : undefined,
        searchText: '',
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

export function getTopicChildren(parentSlug: string): TopicMeta[] {
  return loadTopicDetails()
    .filter(topic => topic.kind === 'specialty' && topic.parentSlug === parentSlug)
    .map(toTopicMeta);
}

export function getTopicMergeBySlug(slug: string): TopicMerge | null {
  return TOPIC_MERGES.find(merge => merge.slug === slug) || null;
}

export function getAllTopicRouteSlugs(): string[] {
  return Array.from(new Set([...loadTopicDetails().map(topic => topic.slug), ...TOPIC_MERGES.map(merge => merge.slug)]));
}

export function getLatestTopics(n = 3): TopicMeta[] {
  return getAllTopicMetas()
    .filter(topic => topic.kind === 'primary')
    .slice(0, n);
}
