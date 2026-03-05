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

    // 初始化百度统计数组
    if (typeof window !== 'undefined') {
      window._hmt = window._hmt || [];

      // 动态注入百度统计脚本
      const script = document.createElement('script');
      script.src = `https://hm.baidu.com/hm.js?${config.siteId}`;
      script.async = true;

      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    }
  }, [config]);

  return null;
}
