# AI 阅读笔记

个人知识库，使用 VitePress 构建的静态网站。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建网站
npm run docs:build
```

## 添加笔记

在相应的分类目录下创建 Markdown 文件：

```bash
# 文件命名格式：作者-书名.md
touch 个人成长/作者-书名.md
```

## 部署

推送到 GitHub 后会自动部署到 GitHub Pages。

## 文档

详细文档请查看 `.vitepress/docs/` 目录：

- `QUICKSTART.md` - 快速开始指南
- `DEPLOY.md` - 部署指南
- `ARCHITECTURE.md` - 技术架构文档

## 特性

- ✅ 自动生成导航和侧边栏
- ✅ 全文搜索
- ✅ 标签提取
- ✅ 响应式设计
- ✅ 自动部署

## 技术栈

- VitePress
- Vue 3
- GitHub Actions
- GitHub Pages
