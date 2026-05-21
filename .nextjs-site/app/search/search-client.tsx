'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookMeta } from '@/lib/books';
import { ReadingEvents } from '@/lib/analytics';

type SearchTab = 'books' | 'fulltext';

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta?: { title?: string };
}

interface SearchResultItem {
  url: string;
  title: string;
  excerptHtml: string;
}

interface PagefindModule {
  search: (term: string) => Promise<{
    results: Array<{ data: () => Promise<PagefindResultData> }>;
  }>;
}

interface SearchPageClientProps {
  allBooks: BookMeta[];
}

function normalizeResultUrl(url: string): string {
  if (!url) return '/';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  return `/${url}`;
}

export default function SearchPageClient({ allBooks }: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(() => searchParams.get('q') ?? '');
  const [activeTab, setActiveTab] = useState<SearchTab>(
    () => (searchParams.get('tab') === 'fulltext' ? 'fulltext' : 'books')
  );

  // ── Books tab: instant title/author/category/tags search ──────────────
  const bookResults = useMemo((): BookMeta[] => {
    if (!keyword.trim()) return [];
    const kw = keyword.toLowerCase();
    return allBooks
      .filter(b =>
        b.title.toLowerCase().includes(kw) ||
        b.author.toLowerCase().includes(kw) ||
        b.category.toLowerCase().includes(kw) ||
        b.tags.some(t => t.toLowerCase().includes(kw))
      )
      .slice(0, 30);
  }, [keyword, allBooks]);

  // ── Fulltext tab: Pagefind ─────────────────────────────────────────────
  const [fulltextResults, setFulltextResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isIndexReady, setIsIndexReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const pagefindRef = useRef<PagefindModule | null>(null);
  const trimmedKeyword = useMemo(() => keyword.trim(), [keyword]);

  useEffect(() => {
    if (activeTab !== 'fulltext') return;
    let cancelled = false;
    const run = async () => {
      if (!trimmedKeyword) {
        setFulltextResults([]);
        setErrorMessage('');
        return;
      }
      setIsSearching(true);
      setErrorMessage('');
      try {
        if (!pagefindRef.current) {
          const pagefindScriptUrl = `/pagefind/pagefind.js`;
          const imported = await import(/* webpackIgnore: true */ pagefindScriptUrl);
          pagefindRef.current = (imported.default || imported) as PagefindModule;
          if (!cancelled) setIsIndexReady(true);
        }
        const res = await pagefindRef.current.search(trimmedKeyword);
        const details = await Promise.all(res.results.slice(0, 50).map(r => r.data()));
        if (cancelled) return;
        const items = details.map(item => ({
          url: normalizeResultUrl(item.url),
          title: item.meta?.title ?? '未命名书籍',
          excerptHtml: item.excerpt ?? '',
        }));
        setFulltextResults(items);
        if (items.length > 0) ReadingEvents.trackSearch(trimmedKeyword);
      } catch {
        if (!cancelled) {
          setFulltextResults([]);
          setErrorMessage(
            process.env.NODE_ENV === 'development'
              ? '开发模式下请先执行 npm run build 生成 pagefind 索引，再使用 npm run preview 验证全文搜索。'
              : '搜索索引加载失败，请稍后刷新页面重试。'
          );
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [trimmedKeyword, activeTab]);

  return (
    <div className="page-container">
      <div className="page-content-4xl">
        {/* Search input */}
        <div className="mb-4 relative">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="搜索书名、作者、内容..."
            className="input-brand"
            autoFocus
          />
          <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-xl flex items-center pointer-events-none">
            🔍
          </span>
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          {(['books', 'fulltext'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-brand border-b-2 border-brand'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'books' ? '书名' : '正文'}
            </button>
          ))}
        </div>

        {/* Books tab */}
        {activeTab === 'books' && (
          <>
            {!keyword.trim() ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-slate-500 text-lg">输入关键词搜索书名、作者、分类</p>
              </div>
            ) : bookResults.length > 0 ? (
              <>
                <p className="text-sm text-slate-500 mb-4">找到 {bookResults.length} 个结果</p>
                <div className="space-y-3">
                  {bookResults.map(book => (
                    <Link key={book.slug} href={`/books/${book.slug}`} className="surface-card surface-card-hover block p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">📖</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 mb-1 truncate">{book.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">{book.author}</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="chip-brand px-2 py-0.5 text-xs">{book.category}</span>
                            {book.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="chip-muted px-2 py-0.5 text-xs">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-slate-500 text-lg">未找到匹配的书籍</p>
                <p className="text-slate-400 text-sm mt-2">试试其他关键词</p>
              </div>
            )}
          </>
        )}

        {/* Fulltext tab */}
        {activeTab === 'fulltext' && (
          <>
            {isSearching && (
              <p className="text-sm text-slate-500 mt-3 mb-4">
                {isIndexReady ? '正在检索...' : '正在加载搜索索引...'}
              </p>
            )}
            {errorMessage && <p className="text-sm text-rose-600 mt-3 mb-4">{errorMessage}</p>}
            {!trimmedKeyword ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-slate-500 text-lg">输入关键词搜索书摘内容</p>
                <p className="text-slate-400 text-sm mt-2">全文检索基于静态索引，按需加载，避免首屏大包。</p>
              </div>
            ) : fulltextResults.length > 0 ? (
              <>
                <p className="text-sm text-slate-500 mb-4">找到 {fulltextResults.length} 个结果</p>
                <div className="space-y-6">
                  {fulltextResults.map(result => (
                    <a key={result.url} href={result.url} className="surface-card surface-card-hover block p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">📖</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold mb-2 text-slate-900">{result.title}</h3>
                          {result.excerptHtml && (
                            <p
                              className="text-sm text-slate-700 mb-2 line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: result.excerptHtml }}
                            />
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            ) : !isSearching ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-slate-500 text-lg">未找到匹配的书籍</p>
                <p className="text-slate-400 text-sm mt-2">试试其他关键词</p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
