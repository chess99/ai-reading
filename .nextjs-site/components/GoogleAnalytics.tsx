'use client';

import { useEffect } from 'react';
import { getGoogleConfig } from '@/lib/analytics-config';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4 组件。
 * 先建立事件队列，再在页面加载完成后的空闲时段加载 gtag.js，
 * 避免统计脚本与首屏渲染争抢资源。
 */
export default function GoogleAnalytics() {
  const config = getGoogleConfig();

  useEffect(() => {
    if (!config?.enabled || !config.measurementId) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', config.measurementId, {
      send_page_view: true,
    });

    const loadScript = () => {
      const src =
        `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
      if (document.querySelector(`script[src="${src}"]`)) {
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      document.head.appendChild(script);
    };

    const scheduleLoad = () => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(loadScript, { timeout: 4000 });
      } else {
        window.setTimeout(loadScript, 1500);
      }
    };

    if (document.readyState === 'complete') {
      scheduleLoad();
    } else {
      window.addEventListener('load', scheduleLoad, { once: true });
    }

    return () => window.removeEventListener('load', scheduleLoad);
  }, [config]);

  return null;
}
