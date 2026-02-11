# AI 阅读 - 开发指引

## 项目简介

基于 Astro 构建的静态网站，用于展示 AI 解读的书籍内容。

## 技术栈

- **框架**: Astro 5.0
- **搜索**: Pagefind（全文搜索）
- **部署**: GitHub Pages

## 开发环境

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

开发服务器会在 `http://localhost:4321` 启动（或其他可用端口）。

**注意**：开发模式下全文搜索功能不可用，但首页的即时搜索可以正常使用。

### 构建和预览

```bash
npm run build && npm run preview
# 或
yarn build && yarn preview
```

预览服务器会在 `http://localhost:4322` 启动。

**用途**：
- 测试全文搜索功能
- 发布前的最终测试
- 验证构建产物

## 项目结构

```
.astro-site/
├── src/
│   ├── content/
│   │   └── books/          # 书籍 Markdown 文件
│   │       ├── 投资/
│   │       ├── 健康运动/
│   │       └── ...
│   ├── layouts/
│   │   └── BaseLayout.astro  # 基础布局
│   ├── pages/
│   │   ├── index.astro       # 首页（即时搜索）
│   │   ├── search.astro      # 全文搜索页
│   │   ├── category/
│   │   │   └── [category].astro  # 分类页面
│   │   └── books/
│   │       └── [...slug].astro   # 书籍详情页
│   └── styles/
│       └── global.css        # 全局样式
├── public/                   # 静态资源
├── dist/                     # 构建输出目录
└── astro.config.mjs          # Astro 配置
```

## 功能说明

### 1. 首页即时搜索

- 基于 JavaScript 客户端搜索
- 可搜索：书籍标题、作者、分类、标签
- 开发模式和生产模式都可用
- 搜索结果实时显示

### 2. 全文搜索

- 基于 Pagefind 静态搜索引擎
- 可搜索书籍的完整内容
- 仅在构建后可用（需要运行 `npm run build`）
- 适合深度内容搜索

### 3. 分类浏览

- 按书籍分类展示
- 每个分类显示该分类下的所有书籍
- 支持中文分类名称

### 4. 书籍详情

- 展示书籍完整内容
- Markdown 渲染
- 支持代码高亮、表格等

## 添加新书籍

1. 在 `src/content/books/` 下创建或选择分类目录
2. 创建 Markdown 文件，文件名格式：`作者-书名.md`
3. 添加 frontmatter：

```markdown
---
title: 书名
author: 作者
tags: [标签1, 标签2]
---

书籍内容...
```

4. 保存后自动生成页面

## 部署

### GitHub Pages

项目配置了 GitHub Pages 部署，base path 为 `/ai-reading`。

```bash
# 构建
npm run build

# 构建产物在 dist/ 目录
```

构建完成后，Pagefind 会自动生成搜索索引到 `dist/pagefind/` 目录。

### 配置说明

在 `astro.config.mjs` 中配置：

```javascript
export default defineConfig({
  site: 'https://chess99.github.io',
  base: '/ai-reading',
  // ...
});
```

## 常见问题

### Q: 为什么全文搜索在开发模式下不工作？

A: Pagefind 需要扫描构建后的 HTML 文件生成索引，开发模式下没有构建产物，所以无法使用。请使用 `npm run build && npm run preview` 来测试全文搜索。

### Q: 如何修改样式？

A:
- 全局样式：编辑 `src/styles/global.css`
- 页面样式：在各个 `.astro` 文件的 `<style>` 标签中修改
- 所有样式都使用 CSS 变量，定义在 `global.css` 中

### Q: 如何修改搜索功能？

A:
- 首页即时搜索：编辑 `src/pages/index.astro` 的 `<script>` 部分
- 全文搜索：编辑 `src/pages/search.astro`

## 开发建议

1. **日常开发**：使用 `npm run dev`，修改后自动刷新
2. **测试搜索**：首页即时搜索在开发模式下可用
3. **发布前测试**：运行 `npm run build && npm run preview` 完整测试
4. **代码检查**：运行 `astro check` 检查类型错误

## PWA 支持

项目已配置为 PWA（渐进式 Web 应用），支持：
- 离线访问
- 添加到主屏幕
- 独立的应用体验

### PWA 配置

- **Manifest**: `public/manifest.json`
- **Service Worker**: `public/sw.js`
- **作用域**: `/ai-reading/` （不影响 `https://cearl.cc/` 的其他路径）

### 生成 PWA 图标

需要将 `public/icon.svg` 转换为 PNG 格式：

```bash
# 使用 ImageMagick 或在线工具生成
# 192x192
convert -background none -resize 192x192 public/icon.svg public/icon-192.png

# 512x512
convert -background none -resize 512x512 public/icon.svg public/icon-512.png
```

或使用在线工具：
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://www.pwabuilder.com/)

## 相关链接

- [Astro 文档](https://docs.astro.build/)
- [Pagefind 文档](https://pagefind.app/)
- [PWA 文档](https://web.dev/progressive-web-apps/)
- [项目仓库](https://github.com/chess99/ai-reading)
