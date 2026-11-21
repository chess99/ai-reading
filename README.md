# 晨笙阅读

> 在线阅读：[https://read.cearl.cc](https://read.cearl.cc)

**晨笙阅读**是一个静态书籍解读与跨书主题阅读站点。站内收录单本书籍解读（帮助读者在精读前摸清问题与内容脉络，或在读完后回顾重点）与跨书主题阅读（围绕一个真实问题独立选书，串联多部作品对照比较）。内容基于完整原书整理，经人工校审与多轮打磨，按作品体裁保留核心论证、成立条件或连贯剧情。

## 主要功能

- **书籍解读与主题阅读**：单本解读页提供章节目录、关联主题与微信读书原书入口；主题阅读页围绕真实问题组织“从这里开始”、书单与读法及观点对照。
- **分类书库与标签筛选**：书库树按需加载，支持按两级分类目录、书名、作者与标签检索。
- **全文搜索**：基于 Pagefind 构建中文全文索引，书名搜索即时匹配元数据，正文搜索支持连续短语优先排序、按需分批加载与章节高亮定位。
- **全文 RSS 订阅收听**：提供全站最新、单书、主题阅读、按分类归档及 OPML 导入源，方便在支持朗读的 RSS 客户端中收听。
- **PWA 离线阅读**：支持整站书籍离线缓存、更新检测与按正文段落锚点恢复阅读位置。

## 仓库结构

```text
.
├── books/                   # 书籍解读文稿（12 个一级分类 × 二级书架）
│   ├── 人文艺术/
│   ├── 关系家庭/
│   ├── 商业产品/
│   ├── 健康身体/
│   ├── 历史世界/
│   ├── 思维科学/
│   ├── 心理修复/
│   ├── 社会公共/
│   ├── 科技媒介/
│   ├── 职业组织/
│   ├── 自我管理/
│   └── 金钱投资/
├── topics/                  # 跨书主题阅读策展文稿（与书库独立选书）
├── docs/                    # 分类计划、策展规范与待补书单（topic-book-backlog.md）
├── .nextjs-site/            # Next.js 静态站点工程与全文索引脚本
└── AGENTS.md                # 仓库协作、书目命名与策展规范（CLAUDE.md 软链至此）
```

## 本地开发与构建

所有站点脚本均在 `.nextjs-site/` 目录下执行（需要 Node.js 20+）：

```bash
cd .nextjs-site
npm install

# 本地开发服务器（自动生成清单与 RSS；/search 全文正文检索需完整 build）
npm run dev

# 运行站点单元测试
npm test

# 静态导出（out/）与 Pagefind 中文全文索引（out/pagefind/）
npm run build

# 在根路径挂载 out/ 预览完整静态站点与全文搜索
npm run preview

# 对实际构建产物检验中文人名、短语排序与章节定位
npm run test:search-index
```

## 内容维护规范

- **书籍文稿**：使用固定两级目录 `books/<一级分类>/<二级分类>/<作者>-<书名>.md`。格式要求、slug 规则、体裁组织方式与写作要求见 [书籍内容规范](.nextjs-site/docs/book-format.md)；分类清单与入库规范见 [AGENTS.md](AGENTS.md)。
- **微信读书链接**：统一维护在 `.nextjs-site/data/weread-links.json`，提交前运行 `node --test tests/weread-links.test.mjs` 验证映射完整。
- **主题阅读**：主题与书库相互独立，选书优先面向读者问题而非现有馆藏；策展与写作规范见 [topic-curation-policy.md](docs/topic-curation-policy.md) 与 [topic-production-guide.md](docs/topic-production-guide.md)。增删待补书目后运行 `node .nextjs-site/scripts/generate-topic-backlog.mjs` 同步 [topic-book-backlog.md](docs/topic-book-backlog.md)。

## 技术栈

- [Next.js 16](https://nextjs.org)（App Router + 静态导出）与 React 19
- TypeScript + Tailwind CSS 4
- Pagefind 1.6 中文全文索引
- GitHub Actions 自动构建并部署至 GitHub Pages（`read.cearl.cc`）

## 许可证

MIT
