# AI 阅读

AI 驱动的书籍解读与知识分享平台

## 特性

- ✨ 基于 Next.js 构建，真正的 SPA 体验
- 📚 自动发现和组织书籍内容
- 🔍 三种搜索方式（实时搜索、侧边栏搜索、全文搜索）
- 🏷️ 标签浏览和过滤
- 🎲 随机书籍推荐
- 📱 移动优先设计，完全响应式
- 🎨 现代化 AI 主题
- 🗂️ VSCode 风格的文件树侧边栏

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
├── .nextjs-site/              # 🔧 Next.js 工程文件（辅助）
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx          # 首页
│   │   ├── books/[slug]/     # 书籍详情页
│   │   └── search/           # 全文搜索页
│   ├── components/            # React 组件
│   │   ├── Header.tsx        # 顶部导航
│   │   ├── Sidebar.tsx       # 侧边栏
│   │   └── SearchBar.tsx     # 搜索栏
│   ├── lib/                   # 工具函数
│   │   └── books.ts          # 书籍数据处理
│   ├── out/                   # 构建输出（SSG）
│   ├── public/
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

**特点**：
- ✅ 根目录清晰：书籍为主，工程为辅
- ✅ **零维护**：添加新分类无需任何配置
- ✅ 单一数据源：`books/` 是唯一的内容来源
- ✅ 自动读取所有书籍，生成静态页面

## 使用方法

### 开发

```bash
cd .nextjs-site
npm install
npm run dev
```

访问 http://localhost:3000/ai-reading

说明：`/search` 全文搜索依赖构建产物中的 `pagefind` 索引，纯 `dev` 模式下不可用。

### 构建

```bash
cd .nextjs-site
npm run build
```

构建产物在 `.nextjs-site/out/` 目录（含 `pagefind/` 搜索索引）

### 预览

```bash
cd .nextjs-site
npm run build
npm run preview
```

说明：`preview` 会在本地按 `/ai-reading` basePath 挂载 `out/`，用于还原线上访问路径。

## 添加新书籍

**零维护**：直接在 `books/` 对应分类目录下创建 Markdown 文件即可，新分类会自动识别！

文件名格式：`作者-书名.md`，支持子分类（在分类目录下创建子目录）。

详细的文件格式规范、frontmatter 字段说明和内容结构建议，见：

📄 [书籍内容规范](.nextjs-site/docs/book-format.md)

## 自动化

- ✅ 自动发现所有分类
- ✅ 自动生成分类页面
- ✅ 自动生成书籍列表
- ✅ 自动部署到 GitHub Pages

## 技术栈

- [Next.js 16](https://nextjs.org) - React 框架 + App Router + Turbopack
- [React 19](https://react.dev) - UI 库
- TypeScript - 类型安全
- [Tailwind CSS 4](https://tailwindcss.com) - 样式框架
- Static Site Generation (SSG) - 静态站点生成
- GitHub Actions - 自动部署

## 许可证

MIT
