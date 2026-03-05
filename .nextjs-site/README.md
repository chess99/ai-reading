# AI 阅读 - Next.js 站点

基于 Next.js 的 AI 驱动书籍解读平台。

## 快速开始

```bash
cd .nextjs-site
npm install
npm run dev
```

访问 <http://localhost:3000/ai-reading>

## 构建与部署

```bash
npm run build    # 构建静态站点到 out/ 目录
npm run preview  # 预览构建产物
```

部署 `out/` 目录到静态托管服务（如 GitHub Pages）。

## 技术栈

- Next.js 16 (App Router + Static Export)
- React 19
- TypeScript
- Tailwind CSS 4
- PWA (Service Worker + Manifest)
- Pagefind (全文搜索)

## 目录结构

```
.nextjs-site/
├── app/              # Next.js 页面
├── components/       # React 组件
├── lib/              # 工具函数与配置
│   ├── books.ts          # 书籍数据处理
│   ├── analytics.ts      # 统计追踪
│   └── analytics-config.ts  # 统计配置
├── docs/             # 开发文档
└── public/           # 静态资源
```

## 功能特性

- ✅ 静态站点生成 (SSG)
- ✅ PWA 支持（可安装、离线访问）
- ✅ 全文搜索
- ✅ 响应式设计
- ✅ 百度统计集成

## 配置

### 统计配置

编辑 `lib/analytics-config.ts`：

```typescript
export const analyticsConfig = {
  baidu: {
    enabled: true,  // 开启/关闭统计
    siteId: 'YOUR_SITE_ID',  // 替换为你的站点 ID
  },
};
```

详见 [docs/analytics.md](docs/analytics.md)

## 开发文档

- [开发指南](docs/development.md) - 开发、构建、预览流程
- [统计配置](docs/analytics.md) - 百度统计集成说明

## 书籍数据

书籍 Markdown 文件位于 `../books/` 目录。

## License

MIT
