/**
 * 网站统计工具函数
 * 同时向百度统计与 Google Analytics 4 上报页面访问和自定义事件
 */

import { getBaiduConfig, getGoogleConfig } from './analytics-config';

// 百度统计全局对象类型定义
declare global {
  interface Window {
    _hmt?: any[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEventParameter = string | number | boolean | undefined;

export interface AnalyticsEventParameters {
  event_category?: string;
  event_action?: string;
  event_label?: string;
  value?: number;
  [key: string]: AnalyticsEventParameter;
}

export type HomeModule =
  | 'continue'
  | 'search'
  | 'latest'
  | 'topics'
  | 'library'
  | 'random';

export interface HomeModuleEventContext {
  position?: number;
  itemSlug?: string;
  hasReadingHistory: boolean;
}

/**
 * 追踪页面访问（百度统计会自动追踪，这里提供手动触发能力）
 * @param path 页面路径
 */
export function trackPageView(path: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const baiduConfig = getBaiduConfig();
  if (baiduConfig?.enabled && window._hmt) {
    window._hmt.push(['_trackPageview', path]);
  }

  const googleConfig = getGoogleConfig();
  if (googleConfig?.enabled && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path });
  }
}

/**
 * 以独立事件名和结构化参数追踪行为。
 * GA4 保留完整参数；百度统计映射为类别、动作、标签和值。
 */
export function trackAnalyticsEvent(
  eventName: string,
  parameters: AnalyticsEventParameters = {}
) {
  if (typeof window === 'undefined') {
    return;
  }

  const cleanedParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined)
  );
  const category = parameters.event_category || '交互';
  const action = parameters.event_action || eventName;
  const label = parameters.event_label;
  const value = parameters.value;

  const baiduConfig = getBaiduConfig();
  if (baiduConfig?.enabled && window._hmt) {
    window._hmt.push(['_trackEvent', category, action, label, value]);
  }

  const googleConfig = getGoogleConfig();
  if (googleConfig?.enabled && window.gtag) {
    window.gtag('event', eventName, cleanedParameters);
  }
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
  trackAnalyticsEvent('custom_interaction', {
    event_category: category,
    event_action: action,
    event_label: label,
    value,
  });
}

function trackHomeModuleEvent(
  eventName: 'home_module_impression' | 'home_module_click',
  action: '模块曝光' | '模块点击',
  module: HomeModule,
  context: HomeModuleEventContext
) {
  const label = [
    module,
    context.position ? `position:${context.position}` : '',
    context.itemSlug ? `item:${context.itemSlug}` : '',
    `history:${context.hasReadingHistory ? 'yes' : 'no'}`,
  ].filter(Boolean).join('|');

  trackAnalyticsEvent(eventName, {
    event_category: '首页',
    event_action: action,
    event_label: label,
    module,
    position: context.position,
    item_slug: context.itemSlug,
    has_reading_history: context.hasReadingHistory,
  });
}

export const HomeAnalyticsEvents = {
  trackModuleImpression(module: HomeModule, context: HomeModuleEventContext) {
    trackHomeModuleEvent('home_module_impression', '模块曝光', module, context);
  },

  trackModuleClick(module: HomeModule, context: HomeModuleEventContext) {
    trackHomeModuleEvent('home_module_click', '模块点击', module, context);
  },
};

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
