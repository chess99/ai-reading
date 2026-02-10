# AI 阅读

AI 驱动的书籍解读与知识分享平台

## 特性

- ✨ 基于 Astro 构建，性能卓越
- 📚 自动发现和组织书籍内容
- 🔍 智能搜索功能
- 🎲 随机书籍推荐
- 📱 完全响应式设计
- 🎨 现代化 AI 主题

## 项目结构

零维护的纯净目录结构，书籍内容与工程文件完全分离：

```
.
├── books/                      # 📚 所有书籍内容（主体，零维护）
│   ├── 投资/
│   ├── 心理学/
│   ├── 个人成长/
│   ├── 健康运动/
│   ├── 商业管理/
│   ├── 思维方式/
│   └── 社会科学/
├── .astro-site/               # 🔧 网站工程文件（辅助）
│   ├── src/
│   │   ├── content/
│   │   │   └── config.ts     # Glob Loader 配置
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── components/
│   ├── public/
│   ├── astro.config.mjs
│   ├── package.json
│   └── tsconfig.json
├── dist/                      # 构建输出
├── package.json               # 便捷脚本
└── README.md
```

**特点**：
- ✅ 根目录清晰：书籍为主，工程为辅
- ✅ **零维护**：添加新分类无需任何配置
- ✅ 单一数据源：`books/` 是唯一的内容来源
- ✅ 使用 Astro 5.0 Glob Loader 自动读取所有书籍

## 使用方法

### 开发

```bash
npm install
npm run dev
```

访问 http://localhost:4321/ai-reading

### 构建

```bash
npm run build
```

构建产物在 `dist/` 目录

### 预览

```bash
npm run preview
```

## 添加新书籍

**零维护**：直接在 `books/` 对应分类目录下创建 Markdown 文件即可，新分类会自动识别！

```markdown
---
title: 书名
author: 作者
category: 分类
tags: [标签1, 标签2]
---

书籍内容...
```

文件名格式：`作者-书名.md`

**添加新分类**（零维护）：
```bash
# 创建新分类目录，添加书籍，无需任何配置
mkdir books/新分类
echo "---\ntitle: 书名\nauthor: 作者\n---\n内容" > books/新分类/作者-书名.md
# 刷新浏览器，新分类自动出现！
```

## 自动化

- ✅ 自动发现所有分类
- ✅ 自动生成分类页面
- ✅ 自动生成书籍列表
- ✅ 自动部署到 GitHub Pages

## 技术栈

- [Astro](https://astro.build) - 现代化静态站点生成器
- TypeScript - 类型安全
- Content Collections - 内容管理
- GitHub Actions - 自动部署

## 许可证

MIT
