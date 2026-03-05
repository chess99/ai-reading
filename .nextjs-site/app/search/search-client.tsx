'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ReadingEvents } from '@/lib/analytics';

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta?: {
    title?: string;
  };
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

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/ai-reading';

function normalizeResultUrl(url: string): string {
  if (!url) return `${BASE_PATH}/`;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith(BASE_PATH)) return url;
  if (url.startsWith('/')) return `${BASE_PATH}${url}`;
  return `${BASE_PATH}/${url}`;
}

export default function SearchPageClient() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isIndexReady, setIsIndexReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const pagefindRef = useRef<PagefindModule | null>(null);

  const trimmedKeyword = useMemo(() => keyword.trim(), [keyword]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!trimmedKeyword) {
        setResults([]);
        setErrorMessage('');
        return;
      }

      setIsSearching(true);
      setErrorMessage('');
      try {
        if (!pagefindRef.current) {
          const pagefindScriptUrl = `${BASE_PATH}/pagefind/pagefind.js`;
          const imported = await import(/* webpackIgnore: true */ pagefindScriptUrl);
          pagefindRef.current = (imported.default || imported) as PagefindModule;
          if (!cancelled) {
            setIsIndexReady(true);
          }
        }

        const searchResponse = await pagefindRef.current.search(trimmedKeyword);
        const detailList = await Promise.all(
          searchResponse.results.slice(0, 50).map(result => result.data())
        );

        if (cancelled) return;

        const searchResults = detailList.map(item => ({
          url: normalizeResultUrl(item.url),
          title: item.meta?.title || '未命名书籍',
          excerptHtml: item.excerpt || '',
        }));

        setResults(searchResults);

        // 追踪搜索事件（只在有结果时追踪，避免过多无效搜索）
        if (searchResults.length > 0) {
          ReadingEvents.trackSearch(trimmedKeyword);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          if (process.env.NODE_ENV === 'development') {
            setErrorMessage('开发模式下请先执行 npm run build 生成 pagefind 索引，再使用 npm run preview 验证全文搜索。');
          } else {
            setErrorMessage('搜索索引加载失败，请稍后刷新页面重试。');
          }
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [trimmedKeyword]);

  return (
    <div className="page-container">
      <div className="page-content-4xl">
        <h1 className="heading-gradient text-2xl md:text-3xl font-bold mb-8 md:mb-10">全文搜索</h1>

        <div className="mb-6 md:mb-8">
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="搜索书籍标题、作者、内容..."
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
          {isSearching && (
            <p className="text-sm text-slate-500 mt-3">
              {isIndexReady ? '正在检索...' : '正在加载搜索索引...'}
            </p>
          )}
          {errorMessage && <p className="text-sm text-rose-600 mt-3">{errorMessage}</p>}
        </div>

        {!trimmedKeyword ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-slate-500 text-lg">输入关键词开始搜索</p>
            <p className="text-slate-400 text-sm mt-2">全文检索基于静态索引，按需加载，避免首屏大包。</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-slate-600">
              <span>找到 {results.length} 个结果</span>
            </div>
            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map(result => (
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
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-slate-500 text-lg">未找到匹配的书籍</p>
                <p className="text-slate-400 text-sm mt-2">试试其他关键词</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
