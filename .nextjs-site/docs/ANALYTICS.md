# 百度统计集成

## 快速配置

编辑 `lib/analytics-config.ts`：

```typescript
export const analyticsConfig = {
  baidu: {
    // 默认仅在生产环境启用，避免开发时污染数据
    enabled: process.env.NODE_ENV === 'production',
    siteId: '8864588cde35a2181784b07b34f770f9',  // 替换为你的站点 ID
  },
};
```

**注意**：
- 开发环境（`npm run dev`）不会加载统计，避免污染数据和控制台警告
- 生产构建（`npm run build`）会自动启用统计
- 如需在开发环境测试，可临时改为 `enabled: true`

构建并部署后，约 20-30 分钟可在 [百度统计后台](https://tongji.baidu.com/) 查看数据。

## 自动追踪的事件

项目已自动追踪以下用户行为：

| 事件 | 类别 | 动作 | 标签 | 触发时机 |
|------|------|------|------|----------|
| 章节切换 | 阅读 | 切换章节 | 书籍-章节 | 点击目录跳转 |
| 搜索 | 搜索 | 执行搜索 | 关键词 | 搜索有结果时 |
| 继续阅读 | 阅读 | 继续阅读 | 书籍 slug | 点击首页继续阅读卡片 |
| 离线模式 | 设置 | 离线模式 | 启用/禁用 | 切换离线模式开关 |

在百度统计后台的「事件跟踪 > 自定义事件」中查看。

## 自定义事件追踪

### 基础用法

```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('类别', '动作', '标签（可选）', 值（可选）);
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
4. 刷新页面，搜索 `hm.baidu.com`
5. 如果有请求，说明已成功加载 ✅

## PWA 兼容性

- Service Worker 不会缓存百度统计请求（`hm.baidu.com`）
- 离线时统计请求会静默失败，不影响应用功能
- 恢复网络后，新的事件会正常上报

## 扩展其他统计服务

如需添加 Google Analytics、Umami 等：

1. 在 `lib/analytics-config.ts` 中添加配置
2. 创建对应组件（参考 `components/BaiduAnalytics.tsx`）
3. 在 `app/layout.tsx` 中引入
4. 在 `lib/analytics.ts` 中添加追踪函数

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

A: 将 `lib/analytics-config.ts` 中的 `enabled` 设置为 `false`。
