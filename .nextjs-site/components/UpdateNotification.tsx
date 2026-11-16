'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getUpdateKind, preparePageUpdate, UPDATE_CHECK_EVENT, type UpdateCheckResult, type UpdateKind, type UpdateManifest } from '@/lib/pwa-updates';
import { savePositionForReload } from '@/lib/reading-position';

interface AvailableUpdate { version: string; kind: UpdateKind }

export default function UpdateNotification() {
  const pathname = usePathname();
  const [available, setAvailable] = useState<AvailableUpdate | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const dismissed = useRef(new Set<string>());

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    let cancelled = false;
    let checking = false;
    let lastCheck = 0;
    let installing: ServiceWorker | null = null;
    setAvailable(null);
    setError('');
    const show = (update: AvailableUpdate) => {
      if (update.kind === 'app' && dismissed.current.has(`${pathname}:worker`)) return;
      if (!cancelled && !dismissed.current.has(`${pathname}:${update.version}`)) setAvailable(update);
    };
    const onInstalled = () => {
      if (installing?.state === 'installed' && navigator.serviceWorker.controller) {
        show({ version: 'worker', kind: 'app' });
      }
    };
    const onUpdateFound = () => {
      installing?.removeEventListener('statechange', onInstalled);
      installing = registrationRef.current?.installing ?? null;
      installing?.addEventListener('statechange', onInstalled);
    };
    const meta = (name: string) => document.querySelector<HTMLMetaElement>(`meta[name="ai-reading-${name}"]`)?.content ?? '';
    const check = async (force = false): Promise<UpdateCheckResult> => {
      if (!navigator.onLine) return 'offline';
      if (cancelled || document.hidden || checking || (!force && Date.now() - lastCheck < 60_000)) return 'failed';
      checking = true;
      lastCheck = Date.now();
      let found = Boolean(registrationRef.current?.waiting);
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10_000);
      try {
        const response = await fetch('/build-manifest.json', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Update check failed');
        const manifest: UpdateManifest = await response.json();
        const kind = getUpdateKind(manifest, { app: meta('app'), library: meta('library'), content: meta('content') }, pathname);
        if (kind) {
          found = true;
          const url = `${pathname.replace(/\/$/, '')}/`;
          const version = kind === 'app' ? manifest.appVersion : kind === 'library'
            ? manifest.contentVersion : manifest.content?.[url]?.hash ?? `removed-${meta('content')}`;
          show({ version: version || manifest.version, kind });
        }
        await registrationRef.current?.update();
        if (registrationRef.current?.waiting) {
          found = true;
          show({ version: 'worker', kind: 'app' });
        }
        return found ? 'available' : 'current';
      } catch { return found ? 'available' : 'failed'; }
      finally { window.clearTimeout(timeout); checking = false; }
    };
    const checkWhenVisible = () => { void check(); };
    const checkWhenOnline = () => { void check(true); };
    const checkManually = (event: Event) => {
      for (const key of dismissed.current) {
        if (key.startsWith(`${pathname}:`)) dismissed.current.delete(key);
      }
      void check(true).then((event as CustomEvent<(result: UpdateCheckResult) => void>).detail);
    };
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then(registration => {
      if (cancelled) return;
      registrationRef.current = registration;
      registration.addEventListener('updatefound', onUpdateFound);
      if (registration.waiting) show({ version: 'worker', kind: 'app' });
      if (registration.installing) onUpdateFound();
    }).catch(() => {});

    // 在页面显示后检查；由页面定时器承担周期任务，避免依赖随时会被回收的 worker。
    const initialTimer = window.setTimeout(checkWhenVisible, 3000);
    const interval = window.setInterval(checkWhenVisible, 5 * 60_000);
    document.addEventListener('visibilitychange', checkWhenVisible);
    window.addEventListener('online', checkWhenOnline);
    window.addEventListener(UPDATE_CHECK_EVENT, checkManually);
    return () => {
      cancelled = true;
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', checkWhenVisible);
      window.removeEventListener('online', checkWhenOnline);
      window.removeEventListener(UPDATE_CHECK_EVENT, checkManually);
      registrationRef.current?.removeEventListener('updatefound', onUpdateFound);
      installing?.removeEventListener('statechange', onInstalled);
    };
  }, [pathname]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError('');
    try {
      const registration = registrationRef.current ?? await navigator.serviceWorker.getRegistration();
      const worker = registration?.waiting ?? navigator.serviceWorker.controller ?? registration?.active;
      if (!worker) throw new Error('更新尚未就绪，请稍后重试');
      // 页面下载成功后才刷新，失败时保留当前正文与位置。
      await preparePageUpdate(worker, window.location.href);
      if (registration?.waiting) {
        await new Promise<void>((resolve, reject) => {
          const onChange = () => { cleanup(); resolve(); };
          const timer = window.setTimeout(() => { cleanup(); reject(new Error('更新超时，请重试')); }, 10_000);
          const cleanup = () => {
            window.clearTimeout(timer);
            navigator.serviceWorker.removeEventListener('controllerchange', onChange);
          };
          navigator.serviceWorker.addEventListener('controllerchange', onChange);
          registration.waiting!.postMessage({ type: 'SKIP_WAITING' });
        });
      }
      savePositionForReload();
      window.location.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '更新未完成，请重试');
      setIsUpdating(false);
    }
  };

  if (!available) return null;
  const isReading = /^\/(books|topics)\/[^/]+\/?$/.test(pathname);
  const title = { app: '有新版本可用', content: '这篇内容有更新', library: '书库有更新' }[available.kind];
  return (
    <aside aria-label="更新提示" className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md md:inset-x-auto md:bottom-6 md:right-6 animate-slide-up">
      <div className="surface-floating rounded-lg p-4">
        <div role="status" aria-live="polite">
          <p className="font-bold text-stone-950">{title}</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            {isReading ? '更新后将回到当前阅读位置。' : '刷新即可查看最新内容。'}
          </p>
        </div>
        {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button onClick={handleUpdate} disabled={isUpdating}
            className="min-h-11 flex-1 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-[#fffdf8] hover:bg-stone-800 disabled:opacity-50">
            {isUpdating ? '正在更新…' : isReading ? '更新并继续阅读' : '刷新查看'}
          </button>
          <button disabled={isUpdating} onClick={() => {
            dismissed.current.add(`${pathname}:${available.version}`);
            if (available.kind === 'app') dismissed.current.add(`${pathname}:worker`);
            setAvailable(null);
          }} className="min-h-11 rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-50">
            稍后
          </button>
        </div>
      </div>
    </aside>
  );
}
