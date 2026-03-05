/**
 * 百度统计工具函数
 * 提供自定义事件追踪能力
 */

import { getBaiduConfig } from './analytics-config';

// 百度统计全局对象类型定义
declare global {
  interface Window {
    _hmt?: any[];
  }
}

/**
 * 追踪页面访问（百度统计会自动追踪，这里提供手动触发能力）
 * @param path 页面路径
 */
export function trackPageView(path: string) {
  const config = getBaiduConfig();
  if (!config?.enabled || typeof window === 'undefined' || !window._hmt) {
    return;
  }

  window._hmt.push(['_trackPageview', path]);
}

/**
 * 追踪自定义事件
 * @param category 事件类别
 * @param action 事件动作
 * @param label 事件标签（可选）
 * @param value 事件值（可选）
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
) {
  const config = getBaiduConfig();
  if (!config?.enabled || typeof window === 'undefined' || !window._hmt) {
    return;
  }

  window._hmt.push(['_trackEvent', category, action, label, value]);
}

/**
 * 阅读相关的事件追踪
 */
export const ReadingEvents = {
  /**
   * 追踪章节切换
   * @param bookSlug 书籍 slug
   * @param chapterTitle 章节标题
   */
  trackChapterChange(bookSlug: string, chapterTitle: string) {
    trackEvent('阅读', '切换章节', `${bookSlug} - ${chapterTitle}`);
  },

  /**
   * 追踪阅读进度
   * @param bookSlug 书籍 slug
   * @param progress 进度百分比 (0-100)
   */
  trackReadingProgress(bookSlug: string, progress: number) {
    // 只在特定进度节点追踪，避免过多请求
    const milestones = [25, 50, 75, 100];
    if (milestones.includes(Math.floor(progress))) {
      trackEvent('阅读', '阅读进度', bookSlug, Math.floor(progress));
    }
  },

  /**
   * 追踪继续阅读功能使用
   * @param bookSlug 书籍 slug
   */
  trackContinueReading(bookSlug: string) {
    trackEvent('阅读', '继续阅读', bookSlug);
  },

  /**
   * 追踪搜索行为
   * @param keyword 搜索关键词
   */
  trackSearch(keyword: string) {
    trackEvent('搜索', '执行搜索', keyword);
  },

  /**
   * 追踪 PWA 安装
   */
  trackPWAInstall() {
    trackEvent('PWA', '安装应用');
  },

  /**
   * 追踪离线模式切换
   * @param enabled 是否启用离线模式
   */
  trackOfflineMode(enabled: boolean) {
    trackEvent('设置', '离线模式', enabled ? '启用' : '禁用');
  },
};
