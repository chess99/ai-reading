# Next.js Site

Next.js 实现的 AI 阅读网站。

## 开发

```bash
cd .nextjs-site
npm install
npm run dev
```

访问 <http://localhost:3000/ai-reading>

## 构建

```bash
npm run build
```

输出目录：`out/`

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
├── lib/                   # 工具函数
│   └── books.ts           # 书籍数据处理
└── public/                # 静态资源
```

## 书籍数据

书籍 Markdown 文件位于 `../books/` 目录。
