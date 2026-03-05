# 百度统计快速开始

## 快速配置（3 步）

### 1. 修改配置文件

打开 `lib/analytics-config.ts`，修改你的站点 ID：

```typescript
export const analyticsConfig: AnalyticsConfig = {
  baidu: {
    enabled: true,  // 开启统计
    siteId: '你的百度统计站点ID', // 替换这里
  },
};
```

### 2. 构建并部署

```bash
npm run build
```

### 3. 验证是否生效

1. 访问你的网站
2. 打开浏览器开发者工具（F12）
3. 切换到 Network（网络）标签
4. 刷新页面
5. 搜索 `hm.baidu.com`，如果有请求说明已成功加载

## 查看统计数据

登录百度统计后台：https://tongji.baidu.com/

大约 20-30 分钟后可以看到数据。

## 禁用统计

如果需要临时禁用统计，只需修改配置：

```typescript
export const analyticsConfig: AnalyticsConfig = {
  baidu: {
    enabled: false,  // 设置为 false
    siteId: '8864588cde35a2181784b07b34f770f9',
  },
};
```

## 已自动追踪的事件

✅ 页面访问
✅ 章节切换
✅ 搜索行为
✅ 继续阅读
✅ 离线模式切换

无需额外配置，这些事件会自动上报到百度统计后台。

## 查看自定义事件

在百度统计后台：

1. 点击左侧菜单「事件跟踪」
2. 选择「自定义事件」
3. 可以看到：
   - 阅读相关事件（章节切换、继续阅读）
   - 搜索事件
   - 设置事件（离线模式）

## 更多功能

查看完整文档：[ANALYTICS.md](./ANALYTICS.md)
