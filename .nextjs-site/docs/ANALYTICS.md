# 网站统计集成

## 快速配置

编辑 `lib/analytics-config.ts`：

```typescript
export const analyticsConfig = {
  baidu: {
    // 默认仅在生产环境启用，避免开发时污染数据
    enabled: process.env.NODE_ENV === 'production',
    siteId: '0714f29d4bd40888b45d7b59e9bf224f',
  },
  google: {
    enabled: process.env.NODE_ENV === 'production',
    measurementId: 'G-P5ZH4CH8MK',
  },
};
```

**注意**：
- 开发环境（`npm run dev`）不会加载统计，避免污染数据和控制台警告
- 生产构建（`npm run build`）会自动启用百度统计与 Google Analytics 4
- 两个统计脚本都在页面加载完成后的空闲时段异步加载，避免影响首屏性能
- 如需在开发环境测试，可临时改为 `enabled: true`

构建并部署后，可分别在 [百度统计后台](https://tongji.baidu.com/) 与 [Google Analytics](https://analytics.google.com/) 查看数据。

## 自动追踪的事件

项目已自动追踪以下用户行为：

| 事件 | 类别 | 动作 | 标签 | 触发时机 |
|------|------|------|------|----------|
| 章节切换 | 阅读 | 切换章节 | 书籍-章节 | 点击目录跳转 |
| 搜索 | 搜索 | 执行搜索 | 关键词 | 搜索有结果时 |
| 继续阅读 | 阅读 | 继续阅读 | 书籍 slug | 点击首页继续阅读卡片 |
| 离线模式 | 设置 | 离线模式 | 启用/禁用 | 切换离线模式开关 |
| 首页模块曝光 | 首页 | 模块曝光 | 模块与上下文 | 模块进入有效视口并停留 600ms |
| 首页模块点击 | 首页 | 模块点击 | 模块与上下文 | 点击首页模块、卡片或入口 |

首页事件在 GA4 中使用独立事件名 `home_module_impression` 和 `home_module_click`，并携带以下参数：

- `module`：`continue`、`search`、`latest`、`topics`、`categories` 或 `random`
- `position`：卡片在当前模块中的位置（从 1 开始）
- `item_slug`：被点击的书籍、主题或聚合入口标识
- `has_reading_history`：当前浏览器是否存在阅读记录

若要在 GA4 标准报表中直接筛选这些参数，需要在 GA4 管理后台将它们注册为事件范围的自定义维度。

百度统计可在「事件跟踪 > 自定义事件」中查看。GA4 中原有通用行为继续记录为 `custom_interaction`；首页曝光和点击使用上述两个独立事件名。

## 自定义事件追踪

### 基础用法

```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('类别', '动作', '标签（可选）', 值（可选）);
```

需要独立事件名和结构化参数时：

```typescript
import { trackAnalyticsEvent } from '@/lib/analytics';

trackAnalyticsEvent('event_name', {
  module: 'latest',
  position: 1,
  item_slug: 'book-slug',
});
```

### 预定义事件

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

## 验证

1. 构建并部署：`npm run build`
2. 访问网站，打开浏览器开发者工具（F12）
3. 切换到 Network 标签
4. 刷新页面，搜索 `hm.baidu.com` 与 `googletagmanager.com`
5. 如果两个请求都出现，说明已成功加载 ✅

## PWA 兼容性

- Service Worker 不会缓存百度统计请求（`hm.baidu.com`）
- 离线时统计请求会静默失败，不影响应用功能
- 恢复网络后，新的事件会正常上报

## 扩展其他统计服务

如需添加 Umami 等其他统计服务，可参考 `components/BaiduAnalytics.tsx` 和 `components/GoogleAnalytics.tsx`，并在 `lib/analytics.ts` 中补充事件上报。

## 常见问题

**Q: 为什么看不到统计数据？**

A:
1. 检查 `lib/analytics-config.ts` 中 `enabled` 是否为 `true`
2. 检查 `siteId` 是否正确
3. 等待 20-30 分钟，百度统计有延迟
4. 打开浏览器开发者工具，查看是否有请求到 `hm.baidu.com`

**Q: 开发环境看到跨域警告怎么办？**

A: 默认配置下开发环境不会加载统计，不会有警告。如果临时启用了统计，跨域警告是正常的，百度统计使用 JSONP 和 Image 方式发送数据，不受 CORS 限制，数据已成功发送。

**Q: 如何在开发环境测试统计？**

A: 将 `enabled` 临时改为 `true`，或使用 `npm run build && npm run preview` 预览生产构建。

**Q: 如何完全禁用统计？**

A: 将 `lib/analytics-config.ts` 中百度和 Google 的 `enabled` 都设置为 `false`。
