# 2026-07-05 性能审计

## 范围

本次审计覆盖静态站本地生产构建：

- 首页 `/`
- 主题详情 `/topics/sang-shi-ai-shang-si-wang/`
- 书籍详情 `/books/lun-yu/`
- 搜索页 `/search/`

审计方法：

- `npm run build`
- Lighthouse mobile / desktop
- Playwright network waterfall
- 静态输出 HTML / RSC / JS chunk 体积检查
- 书库增长到 1000 / 3000 本时的元数据载荷估算

## 结论

当前最主要的性能问题不是单纯的资源预取，而是根布局把全站书库数据传入根 Client Component，导致每个静态页面都嵌入较大的 hydration 数据。

`output: 'export'` 下使用 Server Component 是合理的：Markdown、frontmatter、目录构建等工作都可以在构建期完成，避免浏览器运行内容解析逻辑。但 Server Component 的优势会被一个模式抵消：在 Server Component 中读取全站数据，再作为 props 传给根 Client Component。这样会把构建期数据复制到每个 HTML/RSC payload 中。

## Lighthouse 摘要

| 页面 | Mobile | Desktop | Mobile LCP | Mobile TBT | Byte Weight |
| --- | ---: | ---: | ---: | ---: | ---: |
| 首页 | 99 | 100 | 2009 ms | 27 ms | 254 KB |
| 主题页 | 96 | 100 | 2671 ms | 55 ms | 244 KB |
| 书页 | 95 | 100 | 2672 ms | 127 ms | 472 KB |
| 搜索页 | 91 | 99 | 3372 ms | 80 ms | 239 KB |

Lighthouse 分数整体不差，但它没有充分暴露静态 HTML 中重复嵌入的全站数据问题。这个问题会随着书库增长线性放大。

## 资源与载荷

静态 HTML 体积：

| 文件 | Raw | Gzip | Brotli |
| --- | ---: | ---: | ---: |
| `out/index.html` | 921 KB | 128 KB | 64 KB |
| `out/topics/sang-shi-ai-shang-si-wang/index.html` | 475 KB | 92 KB | 57 KB |
| `out/books/lun-yu/index.html` | 488 KB | 105 KB | 63 KB |
| `out/search/index.html` | 601 KB | 104 KB | 54 KB |
| `out/library/index.html` | 816 KB | 128 KB | 56 KB |

最大 JS chunks：

| Chunk | Raw | Gzip | Brotli | 判断 |
| --- | ---: | ---: | ---: | --- |
| `64342f5c5f611269.js` | 748 KB | 221 KB | 181 KB | 书页 Markdown/rehype/KaTeX/highlight 相关，书页加载 |
| `a796bf3905571d55.js` | 219 KB | 69 KB | 59 KB | 公共客户端运行时代码 |
| `d1e380e53588e373.js` | 119 KB | 33 KB | 28 KB | 公共客户端壳层相关 |

Playwright 本地网络采样显示，关闭路由预取后代表页面初载没有 `?_rsc` / `__next_tree.txt` 额外请求。剩余主要成本来自当前页面 HTML、公共 JS、书页 Markdown 客户端 chunk。

## 架构发现

### P1: 根 Client Component 承载全站数据

`app/layout.tsx` 在构建期读取：

- `buildBookTree()`
- `getAllBookMetas()`
- `getAllTopicMetas()`

然后传给 `LayoutClient`。由于 `LayoutClient` 是根级 Client Component，这些 props 会被序列化进每个页面的 hydration 数据。

当前估算：

- `allBooks`: 89 KB JSON
- `bookTree`: 135 KB JSON
- `bookTree + allBooks`: 224 KB JSON
- `allTopics`: 22 KB JSON

增长模拟：

| 书籍数 | `bookTree + allBooks` 估算 |
| ---: | ---: |
| 366 | 224 KB |
| 1000 | 611 KB |
| 3000 | 1833 KB |

这个数据会出现在很多页面的静态输出中，不只是某一个页面。

建议方向：

- 根布局只保留真正全局且小的数据。
- 侧边栏书树改为按需加载静态 JSON，或只在桌面展开/用户打开书库导航时加载。
- `SettingsDialog` 的离线缓存书单不应要求每页注入完整 `allBooks`，可改为按需读取 `/build-manifest.json` 或专门的轻量 manifest。
- Header 当前标题只需要当前书/主题标题，不需要全站 `allBooks/allTopics` 查找。

### P1: 书页客户端 Markdown chunk 偏大

书页加载 `64342f5c5f611269.js`，raw 约 748 KB，gzip 约 221 KB。该 chunk 包含 Markdown/rehype/sanitize/KaTeX/highlight 相关逻辑。

如果内容已经在构建期渲染，浏览器不应再承担完整 Markdown 渲染栈。更合理的方向是：

- 在 Server Component/构建期完成 Markdown to HTML。
- 客户端只保留目录、阅读进度、分享、历史记录等交互小岛。
- 若必须保留 ReactMarkdown，至少按内容特征拆分：无数学公式的页面不要加载 KaTeX；无代码块的页面不要加载 highlight。

### P2: 全站默认关闭 prefetch 是止血，不是最终策略

关闭大量列表链接的 prefetch 是合理的，尤其是侧边栏、搜索结果、书卡/主题卡列表。

可考虑恢复预取的位置：

- 顶部主导航：链接少、命中率高。
- 继续阅读：点击概率高。

仍建议关闭的位置：

- 侧边栏书籍树。
- 搜索结果。
- 主题页推荐书卡。
- 书籍/主题列表卡片。

### P2: Service Worker 应继续保持克制

当前已排除 `index.txt` / `__next_tree` 类 RSC 文本缓存，这是正确方向。

后续需要确认：

- 离线全量缓存只在用户主动开启时触发。
- 缓存统计和清理不扫描过多非书籍资源。
- 新版本 SW 是否能可靠清理旧 `reading-v1` 缓存。

## Server Component 在纯静态站里的判断

合理使用：

- 读取 Markdown/frontmatter。
- 构建书籍详情页和主题详情页 HTML。
- 生成 SEO metadata、JSON-LD、sitemap。
- 生成静态分类/主题/书籍页面。

不合理使用：

- 读取全站数据后传给根 Client Component。
- 让每个页面都携带全站导航、搜索、设置所需的完整数据。
- 客户端再次加载构建期已经可以完成的 Markdown 渲染栈。

一句话：纯静态站仍然适合 Server Component，但要把它当构建期模板系统和 HTML 生成器使用，而不是把 Server Component 数据桥接到全局客户端状态。

## 建议优先级

1. 拆分根 `LayoutClient` 数据依赖，移除每页重复嵌入的 `bookTree/allBooks/allTopics`。
2. 将书页/主题页 Markdown 渲染尽量前移到构建期，减少客户端 Markdown/KaTeX/highlight chunk。
3. 恢复少量高命中率导航 prefetch，保留大量列表链接 `prefetch={false}`。
4. 为性能建立可重复脚本：构建后输出页面 HTML 体积、最大 chunk、Lighthouse 摘要、RSC 文本数量。
5. 在书库增长前做 1000/3000 本模拟构建，验证 HTML 和客户端数据不会线性失控。
