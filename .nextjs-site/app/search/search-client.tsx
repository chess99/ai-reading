'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookMeta } from '@/lib/books';
import { ReadingEvents } from '@/lib/analytics';
import { BookIcon, CloseIcon, SearchIcon } from '@/components/Icons';
import { loadFulltextPage, searchFulltext } from '@/lib/fulltext-search.mjs';
import type { FulltextItem, PagefindModule, PagefindResult } from '@/lib/fulltext-search.mjs';
import { devDependencies } from '@/package.json';

type SearchTab = 'books' | 'fulltext';

interface SearchPageClientProps {
  allBooks: BookMeta[];
}

let pagefindPromise: Promise<PagefindModule> | null = null;

function getPagefind(): Promise<PagefindModule> {
  if (!pagefindPromise) {
    const scriptUrl = `/pagefind/pagefind.js?v=${encodeURIComponent(devDependencies.pagefind)}`;
    pagefindPromise = import(/* webpackIgnore: true */ scriptUrl).then(async imported => {
      const pagefind = (imported.default ?? imported) as PagefindModule;
      try {
        await pagefind.init();
        await pagefind.preload('');
      } catch (error) {
        await pagefind.destroy();
        throw error;
      }
      return pagefind;
    }).catch(error => {
      pagefindPromise = null;
      throw error;
    });
  }
  return pagefindPromise;
}

export default function SearchPageClient({ allBooks }: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(() => searchParams.get('q') ?? '');
  const [activeTab, setActiveTab] = useState<SearchTab>(
    () => (searchParams.get('tab') === 'fulltext' ? 'fulltext' : 'books')
  );
  const [isComposing, setIsComposing] = useState(false);

  // ── Books tab: instant title/author/category/tags search ──────────────
  const bookResults = useMemo((): BookMeta[] => {
    if (!keyword.trim()) return [];
    const kw = keyword.trim().toLowerCase();
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
  const [fulltext, setFulltext] = useState<{ query: string; items: FulltextItem[]; total: number; phraseCount: number }>(
    { query: '', items: [], total: 0, phraseCount: 0 }
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isIndexReady, setIsIndexReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retry, setRetry] = useState(0);
  const searchIdRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const resultsRef = useRef<{ query: string; results: PagefindResult[] }>({ query: '', results: [] });
  const trimmedKeyword = useMemo(() => keyword.trim(), [keyword]);
  const isCurrentResult = fulltext.query === trimmedKeyword;

  useEffect(() => {
    let cancelled = false;
    getPagefind().then(() => {
      if (!cancelled) setIsIndexReady(true);
    }).catch(() => { /* A failed preload is retried when searching. */ });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    searchIdRef.current++;
    loadingMoreRef.current = false;
    setIsLoadingMore(false);
    setErrorMessage('');
    if (activeTab !== 'fulltext' || !trimmedKeyword || isComposing) {
      setIsSearching(false);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    const run = async () => {
      try {
        const pagefind = await getPagefind();
        if (cancelled) return;
        setIsIndexReady(true);
        const results = await searchFulltext(pagefind, trimmedKeyword);
        if (cancelled) return;
        const items = await loadFulltextPage(results, trimmedKeyword);
        if (cancelled) return;
        resultsRef.current = { query: trimmedKeyword, results };
        setFulltext({ query: trimmedKeyword, items, total: results.length, phraseCount: results.filter(result => result.phraseMatch).length });
        if (items.length > 0) ReadingEvents.trackSearch(trimmedKeyword);
      } catch {
        if (!cancelled) {
          setFulltext({ query: trimmedKeyword, items: [], total: 0, phraseCount: 0 });
          setErrorMessage('搜索暂时不可用，请重试。');
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };
    const timer = window.setTimeout(run, 250);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [trimmedKeyword, activeTab, isComposing, retry]);

  const loadMore = async () => {
    if (loadingMoreRef.current || resultsRef.current.query !== trimmedKeyword) return;
    const searchId = searchIdRef.current;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    setErrorMessage('');
    try {
      const items = await loadFulltextPage(resultsRef.current.results, trimmedKeyword, fulltext.items.length);
      if (searchId !== searchIdRef.current) return;
      setFulltext(current => ({ ...current, items: [...current.items, ...items] }));
    } catch {
      if (searchId === searchIdRef.current) setErrorMessage('更多结果加载失败，请重试。');
    } finally {
      if (searchId === searchIdRef.current) {
        loadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-content-4xl">
        <div className="mb-5">
          <p className="text-xs font-black tracking-[0.16em] text-brand mb-2">SEARCH</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-stone-950">搜索</h1>
        </div>

        {/* Search input */}
        <div className="mb-4 relative">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={e => { setKeyword(e.currentTarget.value); setIsComposing(false); }}
            placeholder={activeTab === 'books' ? '搜索书名、作者、分类、标签' : '搜索正文中的人物、概念或句子'}
            aria-label={activeTab === 'books' ? '搜索书籍' : '搜索正文'}
            className="input-brand"
            autoFocus
          />
          <span className="absolute left-[17px] top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-stone-500">
            <SearchIcon className="w-5 h-5" />
          </span>
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100"
              aria-label="清除搜索"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 mb-6">
          {(['books', 'fulltext'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
              className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-brand border-b-2 border-brand'
                  : 'text-stone-500 hover:text-stone-700'
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
                <div className="icon-tile w-14 h-14 mx-auto mb-4">
                  <BookIcon className="w-7 h-7" />
                </div>
                <p className="px-4 text-stone-500 text-base md:text-lg">输入关键词搜索书名、作者、分类</p>
              </div>
            ) : bookResults.length > 0 ? (
              <>
                <p className="text-sm text-stone-500 mb-4">找到 {bookResults.length} 个结果</p>
                <div className="space-y-3">
                  {bookResults.map(book => (
                    <Link key={book.slug} href={`/books/${book.slug}`} prefetch={false} className="surface-card surface-card-hover block p-4">
                      <div className="flex items-start gap-3">
                        <span className="icon-tile w-10 h-10 flex-shrink-0">
                          <BookIcon className="w-5 h-5" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-stone-950 mb-1 truncate">{book.title}</h3>
                          <p className="text-sm text-stone-600 mb-2">{book.author}</p>
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
                <div className="icon-tile w-14 h-14 mx-auto mb-4">
                  <SearchIcon className="w-7 h-7" />
                </div>
                <p className="px-4 text-stone-500 text-base md:text-lg">未找到匹配的书籍</p>
                <p className="text-stone-400 text-sm mt-2 mb-5">试试其他关键词，或者提交一本想看的书。</p>
                <Link href="/request-book" prefetch={false} className="btn-outline-brand inline-flex items-center justify-center">
                  申请加入书库
                </Link>
              </div>
            )}
          </>
        )}

        {/* Fulltext tab */}
        {activeTab === 'fulltext' && (
          <>
            {isSearching && (
              <p className="text-sm text-stone-500 mt-3 mb-4">
                {isIndexReady ? '正在检索...' : '正在加载搜索索引...'}
              </p>
            )}
            {errorMessage && (
              <p role="alert" className="text-sm text-rose-600 mt-3 mb-4">
                {errorMessage}
                {!fulltext.items.length && (
                  <button onClick={() => setRetry(value => value + 1)} className="ml-3 underline underline-offset-4">重试</button>
                )}
              </p>
            )}
            {!trimmedKeyword ? (
              <div className="text-center py-16">
                <div className="icon-tile w-14 h-14 mx-auto mb-4">
                  <BookIcon className="w-7 h-7" />
                </div>
                <p className="px-4 text-stone-500 text-base md:text-lg">输入人物、概念或句子，查找相关正文</p>
              </div>
            ) : isCurrentResult && !isSearching && !isComposing && fulltext.items.length > 0 ? (
              <>
                <p role="status" className="text-sm text-stone-500 mb-4">
                  找到 {fulltext.total} 个结果{fulltext.items.length < fulltext.total && `，已显示 ${fulltext.items.length} 个`}
                </p>
                <div className="space-y-6">
                  {fulltext.items.map((result, index) => (
                    <div key={result.id}>
                      {!result.phraseMatch && fulltext.phraseCount > 0 && (index === 0 || fulltext.items[index - 1].phraseMatch) && (
                        <p className="mb-4 text-sm text-stone-500">其他相关结果</p>
                      )}
                      <a href={result.url} className="surface-card surface-card-hover block p-6">
                        <div className="flex items-start gap-4">
                          <span className="icon-tile w-10 h-10 flex-shrink-0">
                            <BookIcon className="w-5 h-5" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold mb-2 text-stone-950">{result.title}</h3>
                            {result.section && result.section !== result.title && (
                              <p className="mb-2 text-xs text-stone-500">{result.section}</p>
                            )}
                            {result.excerptHtml && (
                              <p
                                className="search-excerpt text-sm text-stone-700 mb-2 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: result.excerptHtml }}
                              />
                            )}
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
                {fulltext.items.length < fulltext.total && (
                  <div className="mt-6 text-center">
                    <button onClick={loadMore} disabled={isLoadingMore} className="btn-outline-brand disabled:opacity-50">
                      {isLoadingMore ? '正在加载...' : '加载更多'}
                    </button>
                  </div>
                )}
              </>
            ) : isCurrentResult && !isSearching && !isComposing && !errorMessage ? (
              <div className="text-center py-16">
                <div className="icon-tile w-14 h-14 mx-auto mb-4">
                  <SearchIcon className="w-7 h-7" />
                </div>
                <p className="px-4 text-stone-500 text-base md:text-lg">正文中未找到匹配内容</p>
                <p className="text-stone-400 text-sm mt-2 mb-5">试试更短的关键词或其他表达。</p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
