'use client';

import { useEffect, useState } from 'react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  allBooks: { slug: string; title: string; author: string }[];
}

export default function SettingsDialog({ isOpen, onClose, allBooks }: SettingsDialogProps) {
  const [offlineMode, setOfflineMode] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [cachedCount, setCachedCount] = useState(0);
  const [prefetchProgress, setPrefetchProgress] = useState(0);

  useEffect(() => {
    // 读取离线模式设置
    const saved = localStorage.getItem('offline-mode');
    setOfflineMode(saved === 'true');

    // 检查已缓存的书籍数量
    checkCachedBooks();
  }, []);

  const checkCachedBooks = async () => {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open('ai-reading-v1');
      const requests = await cache.keys();
      const bookRequests = requests.filter(req =>
        req.url.includes('/books/') && !req.url.includes('__next')
      );
      setCachedCount(bookRequests.length);
    } catch (error) {
      console.error('Failed to check cache:', error);
    }
  };

  const handleOfflineModeToggle = async () => {
    const newValue = !offlineMode;
    setOfflineMode(newValue);
    localStorage.setItem('offline-mode', String(newValue));

    if (newValue) {
      // 开启离线模式，开始预缓存所有书籍
      await prefetchAllBooks();
    }
  };

  const prefetchAllBooks = async () => {
    if (!navigator.serviceWorker.controller) {
      alert('Service Worker 未就绪，请刷新页面后重试');
      return;
    }

    setIsPrefetching(true);
    setPrefetchProgress(0);

    const bookUrls = allBooks.map(book => `/ai-reading/books/${book.slug}/`);
    const batchSize = 5; // 每次缓存 5 本

    for (let i = 0; i < bookUrls.length; i += batchSize) {
      const batch = bookUrls.slice(i, i + batchSize);

      // 发送预缓存请求
      navigator.serviceWorker.controller.postMessage({
        type: 'PREFETCH_BOOKS',
        data: { urls: batch },
      });

      // 更新进度
      const progress = Math.min(((i + batchSize) / bookUrls.length) * 100, 100);
      setPrefetchProgress(Math.floor(progress));

      // 等待一下，避免过载
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsPrefetching(false);
    setPrefetchProgress(100);

    // 重新检查缓存数量
    setTimeout(() => {
      checkCachedBooks();
    }, 1000);
  };

  const handleClearCache = async () => {
    if (!confirm('确定要清除所有缓存吗？这将删除所有已下载的书籍。')) {
      return;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      setCachedCount(0);
      alert('缓存已清除');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('清除缓存失败');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 对话框 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="surface-card max-w-lg w-full max-h-[80vh] overflow-y-auto pointer-events-auto animate-slide-up"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">设置</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="关闭"
            >
              <svg
                className="w-5 h-5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* 离线模式 */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    离线模式
                  </h3>
                  <p className="text-sm text-slate-600">
                    开启后将下载所有书籍供离线阅读（约 10MB）
                  </p>
                </div>
                <button
                  onClick={handleOfflineModeToggle}
                  disabled={isPrefetching}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
                    offlineMode ? 'bg-brand' : 'bg-slate-300'
                  } ${isPrefetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      offlineMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 进度条 */}
              {isPrefetching && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                    <span>下载中...</span>
                    <span>{prefetchProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand to-brand-dark transition-all duration-300"
                      style={{ width: `${prefetchProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 缓存状态 */}
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">已缓存书籍</span>
                  <span className="font-medium text-slate-900">
                    {cachedCount} / {allBooks.length}
                  </span>
                </div>
              </div>
            </div>

            {/* 存储管理 */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">
                存储管理
              </h3>
              <button
                onClick={handleClearCache}
                className="w-full px-4 py-2.5 border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                清除所有缓存
              </button>
            </div>

            {/* 关于 */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">
                关于
              </h3>
              <div className="space-y-2 text-sm text-slate-600">
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
        </div>
      </div>
    </>
  );
}
