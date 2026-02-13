# Next.js Site

Next.js 实现的 AI 阅读网站。

## 开发

```bash
cd .nextjs-site
npm install
npm run dev
```

访问 <http://localhost:3000/ai-reading>

> 说明：`/search` 的全文搜索依赖 `pagefind` 索引，纯 `dev` 模式不包含该索引。

## 构建

```bash
npm run build
```

输出目录：`out/`（包含 `pagefind/` 搜索索引）

## 预览构建产物

```bash
npm run preview
```

访问 <http://localhost:4173/ai-reading>

> 说明：预览命令会把 `out/` 挂载到 `/ai-reading` 路径，和线上 basePath 保持一致。

## 部署

将 `out/` 目录部署到静态托管服务（如 GitHub Pages）。

## 技术栈

- Next.js 16.1.6 (App Router + Turbopack)
- React 19.2.4
- TypeScript 5.9.3
- Tailwind CSS 4.1.18
- Static Site Generation (SSG)

## 目录结构

```text
.nextjs-site/
├── app/                    # Next.js App Router 页面
│   ├── not-found.tsx       # 全局 404 兜底页
│   ├── layout.tsx         # 根布局
│   ├── layout-client.tsx  # 客户端布局
│   ├── page.tsx           # 首页
│   ├── books/[slug]/      # 书籍详情页
│   └── search/            # 全文搜索页
├── components/            # React 组件
│   ├── Header.tsx         # 顶部导航
│   ├── Sidebar.tsx        # 侧边栏
│   └── SearchBar.tsx      # 搜索栏
├── lib/                   # 数据与工具函数
│   └── books.ts           # 书籍数据处理
├── docs/                  # 开发与协作文档
│   └── development.md     # 开发、构建与预览流程
└── public/                # 静态资源
```

## 书籍数据

书籍 Markdown 文件位于 `../books/` 目录。
