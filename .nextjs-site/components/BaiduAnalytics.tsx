'use client';

import { useEffect } from 'react';
import { getBaiduConfig } from '@/lib/analytics-config';

/**
 * 百度统计组件
 * 自动加载百度统计脚本
 * 使用 useEffect 而不是 next/script 以支持静态导出
 */
export default function BaiduAnalytics() {
  const config = getBaiduConfig();

  useEffect(() => {
    // 如果未启用或缺少配置，不加载
    if (!config?.enabled || !config.siteId) {
      return;
    }

    window._hmt = window._hmt || [];

    const loadScript = () => {
      const src = `https://hm.baidu.com/hm.js?${config.siteId}`;
      if (document.querySelector(`script[src="${src}"]`)) {
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
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
