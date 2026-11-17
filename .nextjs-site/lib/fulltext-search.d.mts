export interface PagefindSection {
  url: string;
  title?: string;
  excerpt?: string;
  locations?: number[];
}
export interface PagefindResult {
  id: string;
  phraseMatch?: boolean;
  data: () => Promise<{
    url: string;
    excerpt?: string;
    meta?: { title?: string };
    sub_results?: PagefindSection[];
  }>;
}
export interface PagefindModule {
  init: () => Promise<void>;
  preload: (term: string) => Promise<void>;
  destroy: () => Promise<void>;
  search: (term: string) => Promise<{ results: PagefindResult[] }>;
}
export interface FulltextItem {
  id: string;
  phraseMatch: boolean;
  url: string;
  title: string;
  section: string;
  excerptHtml: string;
}
interface FulltextIdentity { id: string; phraseMatch: boolean; }
export type FulltextEntry = FulltextIdentity & (
  { status: 'loading' } |
  { status: 'ready'; item: FulltextItem } |
  { status: 'error'; error: unknown }
);
export interface FulltextLoadOptions {
  signal?: AbortSignal;
  onSettled?: (entry: FulltextEntry) => void;
  concurrency?: number;
  retries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}
export const FULLTEXT_PAGE_SIZE: number;
export function searchFulltext(pagefind: PagefindModule, keyword: string): Promise<PagefindResult[]>;
export function loadFulltextBatch(results: PagefindResult[], keyword: string, offset?: number, options?: FulltextLoadOptions): Promise<{
  entries: FulltextEntry[];
  nextOffset: number;
}>;
