'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ReadingEvents } from '@/lib/analytics';
import { BRAND_NAME } from '@/lib/brand';
import { requestUpdateCheck } from '@/lib/pwa-updates';

interface SettingsContentProps {
  onNavigate?: () => void;
}

interface BuildManifest {
  booksCount?: number;
  books?: Record<string, unknown>;
}

const feedbackIssueUrl =
  'https://github.com/chess99/ai-reading/issues/new?' +
  new URLSearchParams({
    title: '反馈：',
    body: [
      '## 反馈类型',
      '<!-- Bug / 体验建议 / 内容问题 / 其他 -->',
      '',
      '## 具体描述',
      '',
      '## 相关页面',
      '<!-- 如果方便，请粘贴出现问题的页面链接 -->',
      '',
      '## 设备与浏览器',
      '<!-- 例如：iPhone Safari / Windows Chrome -->',
    ].join('\n'),
  }).toString();

export default function SettingsContent({ onNavigate }: SettingsContentProps) {
  const [offlineMode, setOfflineMode] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [cachedCount, setCachedCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [prefetchProgress, setPrefetchProgress] = useState(0);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  const handleCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    const result = await requestUpdateCheck();
    setUpdateStatus({
      available: '有更新可用', current: '已是最新版本', offline: '当前离线，联网后再检查',
      failed: '暂时无法检查，请稍后重试', unsupported: '请刷新页面获取最新内容',
    }[result]);
    setIsCheckingUpdate(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('offline-mode');
    setOfflineMode(saved === 'true');
    checkCachedBooks();
    loadBookCount();
  }, []);

  const loadBuildManifest = async (): Promise<BuildManifest | null> => {
    try {
      const response = await fetch('/build-manifest.json');
      return response.ok ? await response.json() : null;
    } catch {
      return null;
    }
  };

  const loadBookCount = async () => {
    const manifest = await loadBuildManifest();
    if (!manifest) return;
    setBookCount(manifest.booksCount ?? Object.keys(manifest.books ?? {}).length);
  };

  const checkCachedBooks = async () => {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open('reading-v2');
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
    const manifest = await loadBuildManifest();
    const bookUrls = Object.keys(manifest?.books ?? {}).map(slug => `/books/${slug}/`);
    setBookCount(manifest?.booksCount ?? bookUrls.length);
    if (bookUrls.length === 0) {
      setIsPrefetching(false);
      return;
    }
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
    <div>
      {/* 离线模式 */}
      <div className="settings-section">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="font-bold text-stone-950 mb-1">离线模式</h2>
            <p className="text-sm text-stone-600">开启后将缓存站内全部书籍解读，方便无网络时离线阅读</p>
          </div>
          <button
            role="switch"
            aria-label="离线模式"
            aria-checked={offlineMode}
            onClick={handleOfflineModeToggle}
            disabled={isPrefetching}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full before:absolute before:-inset-y-3 before:inset-x-0 transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
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
        <div className="mt-3 rounded-lg bg-(--color-field) px-3 py-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">已缓存书籍</span>
            <span className="font-semibold text-stone-950">{cachedCount} / {bookCount}</span>
          </div>
        </div>
      </div>

      {/* 存储管理 */}
      <div className="settings-section">
        <h2 className="font-bold text-stone-950 mb-3">存储管理</h2>
        <button
          onClick={handleClearCache}
          className="min-h-11 px-4 py-2 border border-stone-200 text-stone-700 rounded-lg font-semibold hover:bg-stone-50 transition-colors active:scale-[0.99]"
        >
          清除所有缓存
        </button>
      </div>

      {/* 反馈与补充 */}
      <div className="settings-section">
        <h2 className="font-bold text-stone-950 mb-1">反馈与补充</h2>
        <p className="mb-3 text-sm leading-6 text-stone-600">
          没有找到想看的书？可以提交书名和作者，请求补充到书库。
        </p>
        <Link
          href="/request-book"
          prefetch={false}
          onClick={onNavigate}
          className="inline-flex min-h-11 items-center rounded-lg bg-stone-900 px-4 text-sm font-semibold text-white hover:bg-stone-700"
        >
          申请加入书库
        </Link>
        <div className="mt-3 border-t border-stone-200/80 pt-3">
          <a
            href={feedbackIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-md px-1 py-1 text-sm transition-colors hover:text-brand"
          >
            <span className="text-stone-600">遇到 Bug、内容错误或体验问题？</span>
            <span className="font-bold text-brand whitespace-nowrap">提交反馈 →</span>
          </a>
        </div>
      </div>

      {/* 站点信息 */}
      <div className="settings-section">
        <h2 className="font-bold text-stone-950 mb-3">站点信息</h2>
        <div className="divide-y divide-stone-200/80 text-sm">
          <div className="flex items-center justify-between gap-3 py-2.5">
            <div>
              <p className="font-semibold text-stone-950">版本更新</p>
              <p aria-live="polite" className="mt-0.5 leading-5 text-stone-500">{updateStatus || '检查最新内容和版本'}</p>
            </div>
            <button onClick={handleCheckUpdate} disabled={isCheckingUpdate}
              className="min-h-11 shrink-0 rounded-lg border border-stone-200 px-3 font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50">
              {isCheckingUpdate ? '检查中…' : '检查更新'}
            </button>
          </div>
          <Link
            href="/listen"
            prefetch={false}
            onClick={onNavigate}
            className="flex items-center justify-between gap-3 rounded-md py-2.5 transition-colors hover:text-brand"
          >
            <span>
              <span className="block font-semibold text-stone-950">订阅收听</span>
              <span className="mt-0.5 block leading-5 text-stone-500">用全文 RSS 在朗读器中听书籍解读与主题阅读</span>
            </span>
            <span className="font-bold text-brand">→</span>
          </Link>
          <Link
            href="/about"
            prefetch={false}
            onClick={onNavigate}
            className="flex items-center justify-between gap-3 rounded-md py-2.5 transition-colors hover:text-brand"
          >
            <span>
              <span className="block font-semibold text-stone-950">关于{BRAND_NAME}</span>
              <span className="mt-0.5 block leading-5 text-stone-500">内容整理方式、使用边界与质量标准</span>
            </span>
            <span className="font-bold text-brand">→</span>
          </Link>
          <a
            href="https://github.com/chess99/ai-reading"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-md py-2.5 transition-colors hover:text-brand"
          >
            <span className="font-semibold text-stone-700">GitHub 仓库</span>
            <span className="font-bold text-brand">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
