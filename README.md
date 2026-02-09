# AI 阅读

AI 驱动的书籍解读与知识分享平台。

🔗 **GitHub**: https://github.com/chess99/ai-reading

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev
```

## 添加书籍

在分类目录下创建 Markdown 文件：

```bash
# 文件命名：作者-书名.md
touch 投资/彼得·林奇-彼得·林奇的成功投资.md
```

## 创建新分类

直接创建目录并添加文件：

```bash
mkdir 新分类
touch 新分类/作者-书名.md
```

所有配置（侧边栏、元数据）都会自动生成。

## 部署

推送到 GitHub 自动部署：

```bash
git push
```

## 文档

详细文档在 `.vitepress/docs/` 目录：

- **USAGE.md** - 使用说明
- **DEPLOY.md** - 部署指南
- **ARCHITECTURE.md** - 技术架构

## 特性

- ✅ AI 智能解读
- ✅ 自动发现分类
- ✅ 智能搜索
- ✅ 随机推荐
- ✅ 现代化 UI
- ✅ 自动部署

零维护，只需添加 Markdown 文件。
