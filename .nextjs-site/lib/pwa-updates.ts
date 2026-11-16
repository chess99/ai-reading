export interface UpdateManifest {
  version: string;
  appVersion?: string;
  contentVersion?: string;
  content?: Record<string, { hash: string }>;
}

export type UpdateKind = 'app' | 'content' | 'library';
export type UpdateCheckResult = 'available' | 'current' | 'offline' | 'failed' | 'unsupported';
export const UPDATE_CHECK_EVENT = 'ai-reading:check-updates';

export function requestUpdateCheck(): Promise<UpdateCheckResult> {
  if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return Promise.resolve('unsupported');
  return new Promise(resolve => {
    const timer = window.setTimeout(() => resolve('failed'), 15_000);
    window.dispatchEvent(new CustomEvent(UPDATE_CHECK_EVENT, {
      detail: (result: UpdateCheckResult) => { window.clearTimeout(timer); resolve(result); },
    }));
  });
}

export function getUpdateKind(
  manifest: UpdateManifest,
  rendered: { app: string; library: string; content: string },
  pathname: string,
): UpdateKind | null {
  if (manifest.appVersion && rendered.app && manifest.appVersion !== rendered.app) return 'app';
  const url = `${pathname.replace(/\/$/, '')}/`;
  const isReading = /^\/(books|topics)\/[^/]+\/$/.test(url);
  if (isReading) {
    if (rendered.content && manifest.content?.[url]?.hash !== rendered.content) return 'content';
    return null;
  }
  return manifest.contentVersion && rendered.library && manifest.contentVersion !== rendered.library ? 'library' : null;
}

export function preparePageUpdate(worker: ServiceWorker, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const finish = (error?: Error) => {
      clearTimeout(timer);
      channel.port1.close();
      error ? reject(error) : resolve();
    };
    const timer = setTimeout(() => finish(new Error('更新超时，请重试')), 20_000);
    channel.port1.onmessage = event => {
      finish(event.data?.type === 'UPDATE_READY' ? undefined : new Error('更新未完成，请检查网络后重试'));
    };
    try {
      worker.postMessage({ type: 'PREPARE_UPDATE', data: { url } }, [channel.port2]);
    } catch {
      finish(new Error('更新尚未就绪，请稍后重试'));
    }
  });
}
