'use client';

import PageHeading from '@/components/PageHeading';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookMeta } from '@/lib/books';
import { BookIcon, CloseIcon, SearchIcon } from '@/components/Icons';
import { useFulltextSearch } from '@/hooks/use-fulltext-search';

type SearchTab = 'books' | 'fulltext';

interface SearchPageClientProps {
  allBooks: BookMeta[];
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

  const trimmedKeyword = useMemo(() => keyword.trim(), [keyword]);
  const fulltext = useFulltextSearch(trimmedKeyword, activeTab === 'fulltext' && !isComposing);
  const { isSearching, isIndexReady, errorMessage } = fulltext;
  const isCurrentResult = fulltext.query === trimmedKeyword;

  return (
    <div className="page-container">
      <div className="page-content-4xl">
        <PageHeading title="搜索" description="查找书籍，或在正文中定位一段话" />

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
                <button onClick={fulltext.retrySearch} className="ml-3 underline underline-offset-4">重试</button>
              </p>
            )}
            {!trimmedKeyword ? (
              <div className="text-center py-16">
                <div className="icon-tile w-14 h-14 mx-auto mb-4">
                  <BookIcon className="w-7 h-7" />
                </div>
                <p className="px-4 text-stone-500 text-base md:text-lg">输入人物、概念或句子，查找相关正文</p>
              </div>
            ) : isCurrentResult && !isSearching && !isComposing && fulltext.entries.length > 0 ? (
              <>
                <p role="status" className="text-sm text-stone-500 mb-4">
                  找到 {fulltext.total} 个结果{fulltext.readyCount > 0 && fulltext.readyCount < fulltext.total && `，已显示 ${fulltext.readyCount} 个`}
                </p>
                <div className="space-y-6">
                  {fulltext.entries.map((entry, index) => {
                    const result = entry.status === 'ready' ? entry.item : null;
                    return (
                      <div key={entry.id} data-result-state={entry.status}>
                        {!entry.phraseMatch && fulltext.phraseCount > 0 && (index === 0 || fulltext.entries[index - 1].phraseMatch) && (
                          <p className="mb-4 text-sm text-stone-500">其他相关结果</p>
                        )}
                        {result ? <a href={result.url} className="surface-card surface-card-hover block p-6">
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
                        </a> : entry.status === 'loading' ? (
                          <div aria-hidden="true" className="surface-card min-h-44 animate-pulse space-y-3 p-6">
                            <div className="h-5 w-1/3 rounded bg-stone-200" />
                            <div className="h-3 w-2/3 rounded bg-stone-100" />
                            <div className="h-3 rounded bg-stone-100" />
                          </div>
                        ) : (
                          <div className="surface-card p-5 text-sm text-stone-500">这条结果暂时无法显示，可在下方重试。</div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div ref={fulltext.sentinelRef} className="mt-6 pb-4 text-center text-sm text-stone-500">
                  {fulltext.failedCount > 0 ? (
                    <>
                      <p className="mb-3" role="status">{fulltext.failedCount} 条结果尚未加载，其他结果可继续查看。</p>
                      <button onClick={() => void fulltext.retryFailed()} disabled={fulltext.isLoadingMore} className="btn-outline-brand disabled:opacity-50">
                        {fulltext.isLoadingMore ? '正在重试...' : '重试未加载的结果'}
                      </button>
                    </>
                  ) : fulltext.isLoadingMore ? (
                    <p role="status">正在加载结果...</p>
                  ) : fulltext.hasMore ? (
                    fulltext.automaticLoading ? null :
                      <button onClick={() => void fulltext.loadMore()} className="btn-outline-brand">加载更多</button>
                  ) : <p role="status">已显示全部结果</p>}
                </div>
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
