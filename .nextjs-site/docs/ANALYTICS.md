# 百度统计集成说明

本项目已集成百度统计，提供访问统计和自定义事件追踪功能。

## 配置方式

### 统一配置文件

配置文件位于：`lib/analytics-config.ts`

```typescript
export const analyticsConfig: AnalyticsConfig = {
  baidu: {
    enabled: true, // 设置为 false 可以完全禁用百度统计
    siteId: '8864588cde35a2181784b07b34f770f9', // 你的百度统计站点 ID
  },
};
```

### 如何修改配置

1. **启用/禁用百度统计**
   - 修改 `enabled` 字段为 `true` 或 `false`
   - 禁用后不会加载任何统计脚本

2. **更换站点 ID**
   - 修改 `siteId` 字段为你的百度统计站点 ID
   - 可在百度统计后台获取

## 自动追踪的事件

项目已自动追踪以下用户行为：

### 1. 章节切换
- **事件类别**：阅读
- **事件动作**：切换章节
- **事件标签**：书籍 slug - 章节标题
- **触发时机**：用户点击目录跳转到章节时

### 2. 搜索行为
- **事件类别**：搜索
- **事件动作**：执行搜索
- **事件标签**：搜索关键词
- **触发时机**：用户搜索并有结果返回时

### 3. 继续阅读
- **事件类别**：阅读
- **事件动作**：继续阅读
- **事件标签**：书籍 slug
- **触发时机**：用户点击首页"继续阅读"卡片时

### 4. 离线模式切换
- **事件类别**：设置
- **事件动作**：离线模式
- **事件标签**：启用/禁用
- **触发时机**：用户在设置中切换离线模式时

## 扩展自定义事件

如果需要追踪更多事件，可以使用 `lib/analytics.ts` 中提供的工具函数：

### 基础事件追踪

```typescript
import { trackEvent } from '@/lib/analytics';

// 追踪自定义事件
trackEvent('类别', '动作', '标签（可选）', 值（可选）);

// 示例
trackEvent('用户行为', '点击按钮', '分享按钮');
```

### 使用预定义的阅读事件

```typescript
import { ReadingEvents } from '@/lib/analytics';

// 追踪章节切换
ReadingEvents.trackChapterChange(bookSlug, chapterTitle);

// 追踪阅读进度（会在 25%、50%、75%、100% 时自动上报）
ReadingEvents.trackReadingProgress(bookSlug, progress);

// 追踪搜索
ReadingEvents.trackSearch(keyword);

// 追踪 PWA 安装
ReadingEvents.trackPWAInstall();

// 追踪离线模式切换
ReadingEvents.trackOfflineMode(enabled);
```

## PWA 离线模式处理

百度统计需要网络请求才能上报数据。在 PWA 离线模式下：

- ✅ 统计代码不会影响应用功能
- ✅ 离线时的追踪请求会自动失败（静默处理）
- ✅ 恢复网络后，新的事件会正常上报
- ⚠️ 离线期间的事件不会被缓存重试

## Service Worker 配置

Service Worker 已配置允许百度统计请求通过：

```javascript
// 统计域名不会被 Service Worker 缓存
const ANALYTICS_DOMAINS = ['hm.baidu.com'];
```

## 查看统计数据

1. 登录百度统计：https://tongji.baidu.com/
2. 选择你的站点
3. 查看以下报表：
   - **实时访客**：查看当前在线用户
   - **趋势分析**：查看访问趋势
   - **来源分析**：查看流量来源
   - **页面分析**：查看热门页面
   - **事件跟踪**：查看自定义事件（阅读、搜索等）

## 隐私说明

- 百度统计会收集用户的访问信息（IP、浏览器、操作系统等）
- 建议在网站底部添加隐私政策说明
- 如果有国际用户，可能需要 GDPR 合规声明

## 扩展其他统计服务

如需添加其他统计服务（如 Google Analytics、Umami 等），可以：

1. 在 `lib/analytics-config.ts` 中添加配置
2. 创建对应的组件（参考 `components/BaiduAnalytics.tsx`）
3. 在 `app/layout.tsx` 中引入组件
4. 在 `lib/analytics.ts` 中添加对应的追踪函数

## 常见问题

### Q: 为什么看不到统计数据？
A:
1. 检查 `lib/analytics-config.ts` 中 `enabled` 是否为 `true`
2. 检查 `siteId` 是否正确
3. 等待 20-30 分钟，百度统计有延迟
4. 打开浏览器开发者工具，查看是否有请求到 `hm.baidu.com`

### Q: 本地开发时能看到统计吗？
A: 可以，但建议在生产环境测试，避免污染数据

### Q: 如何完全禁用统计？
A: 将 `lib/analytics-config.ts` 中的 `enabled` 设置为 `false`

### Q: 自定义事件在哪里查看？
A: 百度统计后台 → 事件跟踪 → 自定义事件
