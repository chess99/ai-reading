# AI 阅读笔记

个人知识库，使用 VitePress 构建。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev
```

## 使用方法

### 添加笔记

在分类目录下创建 Markdown 文件：

```bash
# 文件命名：作者-书名.md
touch 个人成长/作者-书名.md
```

### 创建新分类

直接创建目录并添加文件：

```bash
mkdir 新分类
touch 新分类/作者-书名.md
```

所有配置（导航栏、侧边栏、元数据）都会自动生成。

## 部署

推送到 GitHub 自动部署：

```bash
git push
```

## 文档

详细文档在 `.vitepress/docs/` 目录：

- **USAGE.md** - 使用说明（推荐阅读）
- **QUICKSTART.md** - 快速开始
- **DEPLOY.md** - 部署指南
- **ARCHITECTURE.md** - 技术架构

## 特性

- ✅ 自动发现分类目录
- ✅ 自动生成导航和侧边栏
- ✅ 自动提取元数据和标签
- ✅ 全文搜索
- ✅ 响应式设计
- ✅ 自动部署到 GitHub Pages

唯一需要手动做的就是添加 Markdown 文件，其他都是自动的。
