'use client';

import { useEffect, useState } from 'react';

interface BookUpdate {
  slug: string;
  title: string;
  author: string;
}

export default function UpdateNotification() {
  const [updates, setUpdates] = useState<BookUpdate[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, count, updates: bookUpdates } = event.data;

      if (type === 'BOOKS_UPDATED') {
        console.log(`📚 发现 ${count} 本书籍有更新`);
        setUpdates(bookUpdates || []);
      } else if (type === 'UPDATE_COMPLETE') {
        console.log(`✅ 已更新 ${count} 本书籍`);
        setIsUpdating(false);
        setUpdates([]);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleUpdate = async () => {
    if (!navigator.serviceWorker.controller) return;

    setIsUpdating(true);

    // 发送更新请求
    navigator.serviceWorker.controller.postMessage({
      type: 'UPDATE_BOOKS',
      data: {
        slugs: updates.map(u => u.slug),
      },
    });
  };

  const handleDismiss = () => {
    setUpdates([]);
  };

  if (updates.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="surface-card shadow-2xl rounded-xl p-5 border-2 border-brand/20">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 mb-1">
              发现内容更新
            </h3>
            <p className="text-sm text-slate-600">
              有 {updates.length} 本书籍有新内容
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-slate-100 rounded transition-colors"
            aria-label="关闭"
          >
            <svg
              className="w-5 h-5 text-slate-400"
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

        {/* Book List */}
        {updates.length <= 3 && (
          <div className="mb-4 space-y-2">
            {updates.map(book => (
              <div
                key={book.slug}
                className="text-sm p-2 bg-slate-50 rounded-lg"
              >
                <div className="font-medium text-slate-900 line-clamp-1">
                  {book.title}
                </div>
                <div className="text-xs text-slate-500">
                  {book.author}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-brand to-brand-dark text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                更新中...
              </span>
            ) : (
              '立即更新'
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2.5 border-2 border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            稍后
          </button>
        </div>
      </div>
    </div>
  );
}
