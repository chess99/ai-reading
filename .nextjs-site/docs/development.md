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

- 访问地址：`http://localhost:3000/ai-reading`
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

- 预览地址：`http://localhost:4173/ai-reading`
- 该命令将 `out/` 目录挂载到 `/ai-reading` 路径，与生产环境的 basePath 一致
- 使用此模式可以验证全文搜索功能是否正常

## PWA 验证

执行 `npm run build` 和 `npm run preview` 后：

1. 打开 `http://localhost:4173/ai-reading/`
2. 验证 manifest 可访问：`http://localhost:4173/ai-reading/manifest.webmanifest`
3. 在浏览器开发者工具中检查 Service Worker 注册作用域为 `/ai-reading/`
4. 可选：测试离线模式，静态页面应回退到缓存的首页

## 部署

将 `out/` 目录（包含 `out/pagefind/`）部署到静态托管服务。
