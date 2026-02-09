# 快速开始指南

## 🚀 5分钟快速上手

### 1. 本地预览

```bash
# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run docs:dev
```

打开浏览器访问 http://localhost:5173，即可看到网站效果。

### 2. 添加新笔记

在相应的分类目录下创建 Markdown 文件：

```bash
# 文件命名格式：作者-书名.md
touch 个人成长/斯蒂芬·柯维-高效能人士的七个习惯.md
```

编辑文件内容：

```markdown
---
title: 高效能人士的七个习惯
author: 斯蒂芬·柯维
category: 个人成长
tags: [个人成长, 习惯, 效能]
---

# 高效能人士的七个习惯

## 核心观点

这本书介绍了七个习惯...

## 主要内容

### 习惯一：积极主动

...
```

保存后，开发服务器会自动刷新，新笔记会出现在侧边栏中。

### 3. 部署到 GitHub Pages

```bash
# 提交更改
git add .
git commit -m "Add new reading notes"

# 推送到 GitHub
git push origin main
```

GitHub Actions 会自动构建并部署网站。

## 📝 写作技巧

### 使用标签

在文章中使用 `#标签` 格式：

```markdown
这本书讲述了 #价值投资 和 #长期主义 的重要性。
```

构建时会自动提取这些标签。

### 添加目录

VitePress 会自动根据标题生成目录（右侧）。使用 2-3 级标题：

```markdown
## 第一章
### 1.1 小节
### 1.2 小节

## 第二章
### 2.1 小节
```

### 使用提示框

```markdown
::: tip 提示
这是一个提示信息
:::

::: warning 警告
这是一个警告信息
:::

::: danger 危险
这是一个危险信息
:::

::: info 信息
这是一个普通信息
:::
```

### 代码块

````markdown
```javascript
function hello() {
  console.log('Hello World')
}
```
````

### 表格

```markdown
| 标题1 | 标题2 | 标题3 |
|------|------|------|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
```

## 🎨 自定义配置

### 修改网站标题

编辑 `.vitepress/config.mts`:

```typescript
export default defineConfig({
  title: "你的网站标题",  // 修改这里
  description: "你的网站描述",  // 修改这里
  // ...
})
```

### 添加新分类

1. 创建新的分类目录：
```bash
mkdir 新分类
```

2. 在 `.vitepress/scripts/generate-sidebar.mjs` 中添加分类：
```javascript
const categories = [
  '个人成长',
  '投资',
  '商业管理',
  '心理学',
  '健康运动',
  '社会科学',
  '思维方式',
  '新分类'  // 添加这里
]
```

3. 在 `.vitepress/scripts/prebuild.mjs` 中也添加相同的分类名称

4. 在 `.vitepress/config.mts` 的导航栏中添加链接：
```typescript
nav: [
  // ...
  { text: '新分类', link: '/新分类/' }
]
```

### 修改首页

编辑 `index.md` 文件，修改 hero 和 features 部分。

### 自定义样式

编辑 `.vitepress/theme/style.css`，可以修改：
- 主题颜色
- 字体
- 间距
- 动画效果

## 🔧 常用命令

```bash
# 开发模式
npm run docs:dev

# 构建网站
npm run docs:build

# 预览构建结果
npm run docs:preview

# 更新依赖
npm update

# 检查过时的包
npm outdated
```

## 📚 更多资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## ❓ 常见问题

### Q: 为什么我的更改没有显示？

A: 确保开发服务器正在运行，并且文件已保存。如果还是不行，尝试重启开发服务器。

### Q: 如何删除一篇笔记？

A: 直接删除对应的 Markdown 文件，侧边栏会自动更新。

### Q: 搜索功能不工作怎么办？

A: 搜索功能只在构建后的网站中可用。运行 `npm run docs:build && npm run docs:preview` 测试。

### Q: 如何修改 GitHub Pages 的 URL？

A: 在仓库设置中配置自定义域名，或者修改仓库名称（URL 会变为 `username.github.io/新仓库名`）。

### Q: 构建失败怎么办？

A: 查看 GitHub Actions 的日志，通常是 Markdown 语法错误或 frontmatter 格式问题。

## 🎯 下一步

1. **完善内容**: 继续添加和完善阅读笔记
2. **自定义主题**: 根据个人喜好调整样式
3. **添加功能**: 参考 ARCHITECTURE.md 添加新功能
4. **分享**: 将网站分享给朋友

祝你使用愉快！ 📖✨
