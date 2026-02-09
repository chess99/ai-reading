# 使用说明

## 📝 日常使用

### 添加新笔记

只需要在相应目录下创建 Markdown 文件：

```bash
# 文件命名格式：作者-书名.md
touch 个人成长/作者名-书名.md
```

然后编辑文件内容即可。所有其他事情（导航栏、侧边栏、元数据、索引）都会自动处理。

### 创建新分类

直接创建新目录并在里面放置 Markdown 文件：

```bash
mkdir 新分类
touch 新分类/作者-书名.md
```

构建时会自动：
- 发现新分类
- 添加到导航栏
- 生成侧边栏
- 创建索引页

### 添加标签

在文章中使用 `#标签` 格式：

```markdown
这本书讲述了 #价值投资 和 #长期主义 的重要性。
```

构建时会自动提取到 frontmatter 的 `tags` 字段。

### 自定义 frontmatter

如果需要，可以手动添加 frontmatter：

```markdown
---
title: 自定义标题
author: 作者名
category: 分类
tags: [标签1, 标签2]
description: 自定义描述
---

# 文章内容
```

如果不添加，构建时会自动从文件名提取并生成。

## 🚀 开发和部署

### 本地开发

```bash
npm run docs:dev
```

访问 http://localhost:5173 查看效果。

### 构建

```bash
npm run docs:build
```

### 部署

```bash
git add .
git commit -m "Add new notes"
git push
```

GitHub Actions 会自动构建并部署。

## 🎨 自定义配置

### 修改网站标题和描述

编辑 `.vitepress/config.mts`:

```typescript
export default defineConfig({
  title: "你的网站标题",
  description: "你的网站描述",
  // ...
})
```

### 修改首页

编辑根目录的 `index.md`。

### 自定义样式

编辑 `.vitepress/theme/style.css`。

### 添加社交链接

编辑 `.vitepress/config.mts` 中的 `socialLinks`：

```typescript
socialLinks: [
  { icon: 'github', link: 'https://github.com/username/repo' }
]
```

## 📁 目录结构

```
AI阅读/
├── .github/workflows/     # GitHub Actions
├── .vitepress/           # VitePress 配置
│   ├── config.mts        # 主配置
│   ├── theme/            # 主题
│   ├── scripts/          # 构建脚本
│   └── docs/             # 工程文档
├── 个人成长/              # 笔记分类（自动发现）
├── 投资/
├── ...                   # 其他分类
├── index.md              # 首页
├── package.json
└── README.md
```

## 🔧 工作原理

### 自动发现机制

构建时，脚本会：
1. 扫描根目录下的所有目录
2. 检查目录是否包含 `.md` 文件
3. 如果包含，识别为内容分类
4. 自动生成导航栏和侧边栏

### 元数据提取

对于每个 Markdown 文件：
1. 从文件名提取作者和书名（格式：`作者-书名.md`）
2. 从内容中提取标签（`#标签` 格式）
3. 自动补充 frontmatter
4. 不覆盖已有的 frontmatter

### 索引页生成

每个分类目录会自动生成 `index.md`（如果不存在）。

## ⚙️ 高级用法

### 子分类

支持多级目录结构：

```
商业管理/
├── 公司战略/
│   └── 作者-书名.md
├── 市场营销/
│   └── 作者-书名.md
└── 作者-书名.md
```

侧边栏会自动生成嵌套结构。

### 忽略文件

编辑 `.vitepress/scripts/generate-sidebar.mjs` 中的 `ignorePatterns`：

```javascript
const ignorePatterns = [
  'node_modules',
  '.vitepress',
  '.git',
  '.DS_Store',
  'index.md',
  'drafts',  // 添加你想忽略的目录
  // ...
]
```

## 🐛 故障排查

### 构建失败

1. 检查 Markdown 语法
2. 验证文件名格式
3. 查看构建日志

### 新分类未显示

1. 确保目录中有 `.md` 文件
2. 重新构建：`npm run docs:build`
3. 检查目录名是否在忽略列表中

### 搜索不工作

搜索功能只在构建后的网站中可用：

```bash
npm run docs:build
npm run docs:preview
```

## 💡 最佳实践

1. **文件命名**: 使用 `作者-书名.md` 格式
2. **标签使用**: 在文章中使用 `#标签` 添加标签
3. **目录组织**: 按主题分类，支持多级目录
4. **定期提交**: 及时提交更改到 Git
5. **保持简洁**: 不要在根目录放置过多文件

## 📚 更多资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- 工程文档：`.vitepress/docs/` 目录
