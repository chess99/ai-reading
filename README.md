# 晨笙阅读

AI 驱动的书籍解读与知识分享平台

## 特性

- ✨ 基于 Next.js 构建，真正的 SPA 体验
- 📚 自动发现和组织书籍内容
- 🔍 三种搜索方式（实时搜索、侧边栏搜索、全文搜索）
- 🏷️ 标签浏览和过滤
- 🎲 随机书籍推荐
- 📱 移动优先设计，完全响应式
- 🎨 适合长文阅读的现代化界面
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

访问 http://localhost:3000/

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

说明：`preview` 会在本地以站点根路径挂载 `out/`，用于还原线上访问路径。

## 搜索

“书名”搜索即时匹配书名、作者、分类和标签；“正文”使用 Pagefind 1.6 的中文全文索引，两种搜索独立。

正文索引只收录书籍解读和主题阅读，排除导航、标签入口与关联推荐。查询先确定全部匹配及排序，优先显示连续短语命中，再补充分词结果；摘要每批取 10 条，接近列表底部时自动加载下一批。详情最多同时读取 3 条，成功后逐条显示，短暂失败自动重试一次；仍失败时保留已有结果并暂停自动加载，手动重试只补失败项。不支持自动加载的浏览器保留“加载更多”按钮。结果附带命中章节、正文摘要和高亮链接，进入阅读页后定位相关内容。

修改搜索逻辑或升级 Pagefind 后，先运行 `npm test`，再运行 `npm run build && npm run test:search-index`（均在 `.nextjs-site/` 下执行）。索引检查使用实际构建产物，验证中文人名、完整短语、分页和章节锚点；开发服务器本身不生成全文索引。

## 添加新书籍

**零维护**：直接在 `books/` 对应分类目录下创建 Markdown 文件即可，新分类会自动识别！

文件名格式：`作者-书名.md`，支持子分类（在分类目录下创建子目录）。

详细的文件格式规范、frontmatter 字段说明和内容结构建议，见：

📄 [书籍内容规范](.nextjs-site/docs/book-format.md)

## 首页最近更新

“最近更新”使用书籍 frontmatter 中现有的 `date`，包含新增书籍和重写的旧书，不表示首次上架日期。

按北京时间展示今天及此前 29 个自然日内的全部书籍，按日期倒序，不设本数上限。有近期内容时只展示这些内容；近期内容为空时，回退到最近 8 本。未来日期和无效日期不参与展示。

浏览器在打开页面、跨过北京时间午夜以及恢复页面时重新筛选，无需再次发布即可让过期内容退出列表。

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
