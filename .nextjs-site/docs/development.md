# 开发指南

本项目是基于 Next.js 的静态导出站点。书籍内容位于 `../books` 目录，Web 应用位于 `.nextjs-site` 目录。

## 环境要求

- Node.js 20+
- npm 10+

## 安装依赖

```bash
cd .nextjs-site
npm install
```

## 开发模式

```bash
npm run dev
```

- 访问地址：`http://localhost:3000`
- 支持热重载（UI 和内容更新）
- 注意：`/search` 的全文搜索依赖 Pagefind 索引，开发模式下不可用

## 构建

```bash
npm run build
```

该命令会执行两个操作：

1. 将静态页面构建到 `out/` 目录
2. 生成 Pagefind 搜索索引到 `out/pagefind/` 目录

## 预览构建产物

```bash
npm run preview
```

- 预览地址：`http://localhost:4173`
- 使用此模式可以验证全文搜索功能是否正常

## 书页关联主题

主题的 `books` 列表是关联的唯一来源，无需在书籍 Markdown 维护反向字段。
`lib/book-topic-index.mjs` 按有效的 `in_library` slug 生成反向索引，`lib/topics.ts`
缓存并提供 `getTopicsForBook`。书页服务端渲染紧凑列表，通过 ReactNode 插槽放在正文之后、标签之前；
模块位于 `.markdown-content` 外，不进入文章目录。没有关联时不显示模块或页首入口。

排序优先起读用途，其次继续/对照，最后按需/查阅；同级按领域、标题和 slug 稳定排序。
浏览器不下载全站关联表。构建清单与书页共用索引，将关联列表的标题、链接、推荐理由和实际顺序
合入书页指纹；新增、删除或修改关联会触发书页更新，主题正文等不影响该模块的编辑不会额外改变指纹。

相关回归检查：`node --test tests/book-related-topics.test.mjs`。

## PWA 验证

执行 `npm run build` 和 `npm run preview` 后：

1. 打开 `http://localhost:4173/`
2. 验证 manifest 可访问：`http://localhost:4173/manifest.webmanifest`
3. 在浏览器开发者工具中检查 Service Worker 注册作用域为 `/`
4. 可选：测试离线模式，静态页面应回退到缓存的首页

## 部署

将 `out/` 目录（包含 `out/pagefind/`）部署到静态托管服务。
