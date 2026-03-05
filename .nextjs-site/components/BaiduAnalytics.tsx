'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { getBaiduConfig } from '@/lib/analytics-config';

/**
 * 百度统计组件
 * 自动加载百度统计脚本
 */
export default function BaiduAnalytics() {
  const config = getBaiduConfig();

  // 如果未启用或缺少配置，不渲染
  if (!config?.enabled || !config.siteId) {
    return null;
  }

  useEffect(() => {
    // 初始化百度统计数组
    if (typeof window !== 'undefined') {
      window._hmt = window._hmt || [];
    }
  }, []);

  return (
    <>
      <Script
        id="baidu-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?${config.siteId}";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
          `.trim(),
        }}
      />
    </>
  );
}
