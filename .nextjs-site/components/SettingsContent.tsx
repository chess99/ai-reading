'use client';

import { useEffect, useState } from 'react';
import { ReadingEvents } from '@/lib/analytics';

interface SettingsContentProps {
  allBooks: { slug: string; title: string; author: string }[];
}

export default function SettingsContent({ allBooks }: SettingsContentProps) {
  const [offlineMode, setOfflineMode] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [cachedCount, setCachedCount] = useState(0);
  const [prefetchProgress, setPrefetchProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('offline-mode');
    setOfflineMode(saved === 'true');
    checkCachedBooks();
  }, []);

  const checkCachedBooks = async () => {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open('reading-v1');
      const requests = await cache.keys();
      setCachedCount(
        requests.filter(r => r.url.includes('/books/') && !r.url.includes('__next')).length
      );
    } catch {}
  };

  const handleOfflineModeToggle = async () => {
    const newValue = !offlineMode;
    setOfflineMode(newValue);
    localStorage.setItem('offline-mode', String(newValue));
    ReadingEvents.trackOfflineMode(newValue);
    if (newValue) await prefetchAllBooks();
  };

  const prefetchAllBooks = async () => {
    if (!navigator.serviceWorker.controller) {
      alert('Service Worker 未就绪，请刷新页面后重试');
      return;
    }
    setIsPrefetching(true);
    setPrefetchProgress(0);
    const bookUrls = allBooks.map(book => `/books/${book.slug}/`);
    const batchSize = 5;
    for (let i = 0; i < bookUrls.length; i += batchSize) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PREFETCH_BOOKS',
        data: { urls: bookUrls.slice(i, i + batchSize) },
      });
      setPrefetchProgress(Math.floor(Math.min(((i + batchSize) / bookUrls.length) * 100, 100)));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsPrefetching(false);
    setPrefetchProgress(100);
    setTimeout(checkCachedBooks, 1000);
  };

  const handleClearCache = async () => {
    if (!confirm('确定要清除所有缓存吗？这将删除所有已下载的书籍。')) return;
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      setCachedCount(0);
      alert('缓存已清除');
    } catch {
      alert('清除缓存失败');
    }
  };

  return (
    <div className="space-y-6">
      {/* 离线模式 */}
      <div className="surface-card p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-stone-950 mb-1">离线模式</h3>
            <p className="text-sm text-stone-600">开启后将下载所有书籍供离线阅读（约 10MB）</p>
          </div>
          <button
            onClick={handleOfflineModeToggle}
            disabled={isPrefetching}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
              offlineMode ? 'bg-brand' : 'bg-stone-300'
            } ${isPrefetching ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${offlineMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        {isPrefetching && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-stone-600 mb-2">
              <span>下载中...</span>
              <span>{prefetchProgress}%</span>
            </div>
            <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${prefetchProgress}%` }}
              />
            </div>
          </div>
        )}
        <div className="mt-3 p-3 bg-stone-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">已缓存书籍</span>
            <span className="font-semibold text-stone-950">{cachedCount} / {allBooks.length}</span>
          </div>
        </div>
      </div>

      {/* 存储管理 */}
      <div className="surface-card p-4">
        <h3 className="font-bold text-stone-950 mb-3">存储管理</h3>
        <button
          onClick={handleClearCache}
          className="w-full px-4 py-2.5 border border-stone-200 text-stone-700 rounded-lg font-semibold hover:bg-stone-50 transition-colors active:scale-[0.99]"
        >
          清除所有缓存
        </button>
      </div>

      {/* 关于 */}
      <div className="surface-card p-4">
        <h3 className="font-bold text-stone-950 mb-3">关于</h3>
        <div className="space-y-2 text-sm text-stone-600">
          <p>AI 阅读 - AI 驱动的书籍解读平台</p>
          <p>当前收录：{allBooks.length} 本书籍</p>
          <p>
            <a
              href="https://github.com/chess99/ai-reading"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              GitHub 仓库
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
