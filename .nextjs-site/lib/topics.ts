import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BookMeta, getAllBookMetas } from '@/lib/books';
import legacyRoutes from '@/data/topic-legacy-routes.json';
import { DOMAIN_ORDER, normalizeTopicSearch } from '@/lib/topic-discovery';
import { buildBookTopicIndex, type BookTopicLink } from '@/lib/book-topic-index.mjs';

export type TopicBookStatus = 'in_library' | 'planned';
export type TopicMode = 'path' | 'comparison' | 'collection';
export type ReadingUse = 'start' | 'next' | 'compare' | 'optional' | 'reference';
export interface TopicBookRecommendation {
  title: string;
  author: string;
  originalTitle?: string;
  role: string;
  reason: string;
  reading: ReadingUse;
  status: TopicBookStatus;
  slug?: string;
  path?: string;
  book?: BookMeta;
}
export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  bookCount: number;
  availableCount: number;
  domain: string;
  domains: string[];
  mode: TopicMode;
  entry: string;
  related: string[];
  searchText: string;
}
export interface TopicDetail extends TopicMeta {
  content: string;
  books: TopicBookRecommendation[];
  filePath: string;
}
export interface TopicLegacyRoute {
  slug: string;
  title: string;
  targets: string[];
}
const TOPICS_DIR = path.join(process.cwd(), '..', 'topics');
let cachedTopicDetails: TopicDetail[] | null = null;
let cachedBookTopicIndex: Map<string, BookTopicLink[]> | null = null;
function toTopicMeta({ content: _content, books: _books, filePath: _filePath, ...meta }: TopicDetail): TopicMeta {
  return meta;
}
function loadTopicDetails(): TopicDetail[] {
  if (cachedTopicDetails) return cachedTopicDetails;
  if (!fs.existsSync(TOPICS_DIR)) return [];
  const bookBySlug = new Map(getAllBookMetas().map(book => [book.slug, book]));
  const topics = fs.readdirSync(TOPICS_DIR).filter(name => name.endsWith('.md')).map(name => {
    const filePath = path.join(TOPICS_DIR, name);
    const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
    const books: TopicBookRecommendation[] = (data.books || []).map((item: TopicBookRecommendation) => {
      const book = item.status === 'in_library' && item.slug ? bookBySlug.get(item.slug) : undefined;
      if (item.status === 'in_library' && !book) throw new Error(`Unresolved book in ${name}: ${item.title}`);
      return { ...item, book };
    });
    const domains: string[] = data.domains || [data.domain];
    return {
      slug: data.slug, title: data.title, description: data.description, tags: data.tags || [], date: data.date,
      domain: domains[0], domains, mode: data.mode, entry: data.entry, related: data.related || [],
      bookCount: books.length, availableCount: books.filter(book => book.book).length, books, content, filePath,
      searchText: normalizeTopicSearch([data.title, data.description, data.entry, ...domains, ...(data.tags || []),
        ...books.flatMap(book => [book.title, book.originalTitle, book.author, book.role, book.reason])].filter(Boolean).join(' ')),
    } as TopicDetail;
  });
  cachedTopicDetails = topics.sort((a, b) => {
    const rank = (domain: string) => { const i = DOMAIN_ORDER.indexOf(domain); return i === -1 ? DOMAIN_ORDER.length : i; };
    return rank(a.domain) - rank(b.domain) || a.title.localeCompare(b.title, 'zh-CN');
  });
  return cachedTopicDetails;
}
export function getAllTopicMetas(): TopicMeta[] { return loadTopicDetails().map(toTopicMeta); }
export function getAllTopicDetails(): TopicDetail[] { return loadTopicDetails(); }
export function getTopicsForBook(bookSlug: string): readonly BookTopicLink[] {
  if (!cachedBookTopicIndex) {
    cachedBookTopicIndex = buildBookTopicIndex(
      loadTopicDetails(),
      new Set(getAllBookMetas().map(book => book.slug)),
    );
  }
  return cachedBookTopicIndex.get(bookSlug) || [];
}
export function getTopicDetailBySlug(slug: string): TopicDetail | null {
  return loadTopicDetails().find(topic => topic.slug === slug) || null;
}
export function getRelatedTopics(topic: TopicDetail): TopicMeta[] {
  return topic.related.flatMap(slug => { const related = getTopicDetailBySlug(slug); return related ? [toTopicMeta(related)] : []; });
}
export function getTopicLegacyRoute(slug: string): TopicLegacyRoute | null {
  return legacyRoutes.find(route => route.slug === slug) || null;
}
export function getAllTopicRouteSlugs(): string[] {
  return [...new Set([...loadTopicDetails().map(topic => topic.slug), ...legacyRoutes.map(route => route.slug)])];
}
export function getLatestTopics(n = 3): TopicMeta[] {
  const selected = ['zhong-da-jue-ce', 'wen-xue-ren-wen', 'sheng-ming-yan-hua', 'ai-bian-ge', 'qin-mi-guan-xi'];
  const topics = getAllTopicMetas();
  return [...selected.flatMap(slug => topics.filter(topic => topic.slug === slug)),
    ...topics.filter(topic => !selected.includes(topic.slug))].slice(0, n);
}
