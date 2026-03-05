/**
 * 网站分析统计配置
 * 类似 Hexo 的统一配置管理
 */

export interface AnalyticsConfig {
  // 百度统计
  baidu?: {
    enabled: boolean;
    siteId: string; // 百度统计站点 ID
  };
  // 可以扩展其他统计服务
  // google?: {
  //   enabled: boolean;
  //   measurementId: string;
  // };
}

// 统一配置入口
export const analyticsConfig: AnalyticsConfig = {
  baidu: {
    enabled: true, // 设置为 false 可以完全禁用百度统计
    siteId: '8864588cde35a2181784b07b34f770f9',
  },
};

// 检查是否启用了任何统计服务
export function isAnalyticsEnabled(): boolean {
  return !!(analyticsConfig.baidu?.enabled);
}

// 获取百度统计配置
export function getBaiduConfig() {
  return analyticsConfig.baidu;
}
