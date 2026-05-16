# SEO & Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 reading.cearl.cc 补全 SEO 基础设施（sitemap、robots.txt、llms.txt、JSON-LD、canonical）并诊断/优化 Core Web Vitals。

**Architecture:** 站点是 Next.js 静态导出（`output: 'export'`），部署在 GitHub Pages。Next.js App Router 的 `sitemap.ts` / `robots.ts` 路由在静态导出模式下会在构建时生成对应静态文件，放入 `out/` 目录。llms.txt 直接放 `public/` 即可。JSON-LD 结构化数据以 `<script>` 标签注入各页面的服务器组件。性能方面，Baidu Analytics 目前通过 `useEffect` 在客户端注入，已基本不阻塞渲染，主要优化点是 canonical URL 补全和 Open Graph 完善。

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS 4, GitHub Pages, GitHub Actions

---

## File Map

| 操作 | 文件 | 说明 |
|------|------|------|
| 新建 | `.nextjs-site/app/sitemap.ts` | 生成全站 sitemap.xml |
| 新建 | `.nextjs-site/app/robots.ts` | 生成 robots.txt |
| 新建 | `.nextjs-site/public/llms.txt` | AI 搜索引擎理解文件 |
| 修改 | `.nextjs-site/app/layout.tsx` | 补全根页面 canonical + OG + Twitter Card + WebSite JSON-LD |
| 修改 | `.nextjs-site/app/books/[slug]/page.tsx` | 补全书籍页 canonical + OG type:article + Book JSON-LD |
| 新建 | `.nextjs-site/app/page.tsx` | 加 WebSite JSON-LD（在现有文件添加） |

---

## Task 1: 生成 sitemap.ts

**Files:**
- Create: `.nextjs-site/app/sitemap.ts`

静态导出模式下 Next.js 会将 `app/sitemap.ts` 默认导出的函数结果序列化为 `sitemap.xml`。

- [ ] **Step 1: 新建 `app/sitemap.ts`**

```typescript
// .nextjs-site/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllBookMetas } from '@/lib/books';

const BASE_URL = 'https://reading.cearl.cc';

export default function sitemap(): MetadataRoute.Sitemap {
  const books = getAllBookMetas();

  const bookEntries: MetadataRoute.Sitemap = books.map(book => ({
    url: `${BASE_URL}/books/${book.slug}/`,
    lastModified: book.addedAt ? new Date(book.addedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/search/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...bookEntries,
  ];
}
```

- [ ] **Step 2: 本地构建验证 sitemap.xml 生成**

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site
npm run build 2>&1 | tail -20
```

Expected: build 成功，`out/sitemap.xml` 存在。

```bash
head -30 out/sitemap.xml
```

Expected: 包含 `<urlset>` 和多个 `<url>` 条目，首条为 `https://reading.cearl.cc/`。

- [ ] **Step 3: Commit**

```bash
cd /Users/zcs/Notes/ai-reading
git add .nextjs-site/app/sitemap.ts
git commit -m "feat: add sitemap.ts with all book URLs"
```

---

## Task 2: 生成 robots.ts

**Files:**
- Create: `.nextjs-site/app/robots.ts`

- [ ] **Step 1: 新建 `app/robots.ts`**

```typescript
// .nextjs-site/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      // AI search bots — allow citation
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: 'https://reading.cearl.cc/sitemap.xml',
  };
}
```

- [ ] **Step 2: 构建并验证 robots.txt**

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site
npm run build 2>&1 | grep -E "error|Error" | head -5
cat out/robots.txt
```

Expected: 包含 `User-agent: *`、AI bot 条目、`Sitemap: https://reading.cearl.cc/sitemap.xml`。

- [ ] **Step 3: Commit**

```bash
cd /Users/zcs/Notes/ai-reading
git add .nextjs-site/app/robots.ts
git commit -m "feat: add robots.ts with AI bot allowlist and sitemap reference"
```

---

## Task 3: 创建 llms.txt

**Files:**
- Create: `.nextjs-site/public/llms.txt`

`public/` 目录下的文件会直接复制到 `out/`，无需构建处理。

- [ ] **Step 1: 新建 `public/llms.txt`**

```
# AI 阅读

> AI 驱动的书籍解读与知识分享平台，提炼 100+ 本经典书籍的核心知识。

## What

AI 阅读收录了投资、心理学、个人成长、商业管理、思维方式、历史传记等领域的优质书籍提炼。每本书由 AI 精读后提取核心框架、关键洞见和可执行要点，帮助读者快速掌握书籍精华，节省阅读时间。

## Key Pages

- [首页](https://reading.cearl.cc/) — 书籍分类浏览与搜索入口
- [投资类书籍](https://reading.cearl.cc/) — 股票投资、价值投资、量化交易等经典著作
- [心理学类书籍](https://reading.cearl.cc/) — 认知科学、行为经济学、心理健康相关书籍
- [个人成长类书籍](https://reading.cearl.cc/) — 习惯养成、效率提升、自我管理经典
- [全文搜索](https://reading.cearl.cc/search/) — 在全部书籍内容中搜索关键词
```

- [ ] **Step 2: 验证文件存在且内容正确**

```bash
cat /Users/zcs/Notes/ai-reading/.nextjs-site/public/llms.txt
```

Expected: 显示上述内容。

- [ ] **Step 3: 构建后验证 `out/llms.txt` 存在**

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site
npm run build 2>&1 | tail -5
ls out/llms.txt
```

Expected: `out/llms.txt` 存在。

- [ ] **Step 4: Commit**

```bash
cd /Users/zcs/Notes/ai-reading
git add .nextjs-site/public/llms.txt
git commit -m "feat: add llms.txt for AI search engine discovery"
```

---

## Task 4: 补全根布局 SEO — canonical、OG、Twitter Card、WebSite JSON-LD

**Files:**
- Modify: `.nextjs-site/app/layout.tsx`

当前 `layout.tsx` 缺少：canonical URL、OG `url`/`type` 字段、Twitter Card、WebSite JSON-LD。

- [ ] **Step 1: 读取当前 `app/layout.tsx` 确认现状**

```bash
cat /Users/zcs/Notes/ai-reading/.nextjs-site/app/layout.tsx
```

- [ ] **Step 2: 修改 `app/layout.tsx`**

将文件内容替换为：

```typescript
import type { Metadata, Viewport } from 'next';
import './globals.css';
import LayoutClient from './layout-client';
import BaiduAnalytics from '@/components/BaiduAnalytics';
import { buildBookTree, getAllBookMetas } from '@/lib/books';

const BASE_URL = 'https://reading.cearl.cc';

export const metadata: Metadata = {
  title: 'AI 阅读 - AI 驱动的书籍解读与知识分享平台',
  description: '用 AI 精读好书，提炼知识精华。收录了投资、心理学、个人成长、商业管理等领域的优质书籍。',
  keywords: ['AI', '读书', '书籍解读', '知识分享', '投资', '心理学', '个人成长', '商业管理'],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    title: 'AI 阅读',
    statusBarStyle: 'default',
  },
  alternates: {
    canonical: BASE_URL + '/',
  },
  openGraph: {
    title: 'AI 阅读 - AI 驱动的书籍解读与知识分享平台',
    description: '用 AI 精读好书，提炼知识精华。收录了投资、心理学、个人成长、商业管理等领域的优质书籍。',
    url: BASE_URL + '/',
    siteName: 'AI 阅读',
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: BASE_URL + '/icon.png',
        width: 512,
        height: 512,
        alt: 'AI 阅读',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'AI 阅读 - AI 驱动的书籍解读与知识分享平台',
    description: '用 AI 精读好书，提炼知识精华。收录了投资、心理学、个人成长、商业管理等领域的优质书籍。',
    images: [BASE_URL + '/icon.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#667eea',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'AI 阅读',
      url: BASE_URL,
      description: '用 AI 精读好书，提炼知识精华。收录投资、心理学、个人成长、商业管理等领域优质书籍。',
      inLanguage: 'zh-CN',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/search/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      name: 'AI 阅读',
      url: BASE_URL,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bookTree = buildBookTree();
  const allBooks = getAllBookMetas();

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <BaiduAnalytics />
        <LayoutClient bookTree={bookTree} allBooks={allBooks}>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: TypeScript 类型检查**

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site
npx tsc --noEmit 2>&1
```

Expected: 无错误输出。

- [ ] **Step 4: 构建验证**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -10
```

Expected: 无 error。

- [ ] **Step 5: Commit**

```bash
cd /Users/zcs/Notes/ai-reading
git add .nextjs-site/app/layout.tsx
git commit -m "feat: add canonical, OG, Twitter Card, WebSite JSON-LD to root layout"
```

---

## Task 5: 补全书籍页 SEO — canonical、OG type:article、Book JSON-LD

**Files:**
- Modify: `.nextjs-site/app/books/[slug]/page.tsx`

当前书籍页缺少：canonical URL、OG `url` 字段、OG `type: article`、Book 结构化数据。

- [ ] **Step 1: 修改 `generateMetadata` 函数**

在 `.nextjs-site/app/books/[slug]/page.tsx` 中，将 `generateMetadata` 函数替换为：

```typescript
const BASE_URL = 'https://reading.cearl.cc';

export async function generateMetadata({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookDetailBySlug(slug);

  if (!book) {
    return {
      title: '书籍未找到 - AI 阅读',
    };
  }

  const pageUrl = `${BASE_URL}/books/${slug}/`;
  const description = `《${book.title}》作者 ${book.author}，AI 提炼的核心知识与洞见。分类：${book.category}。`;

  return {
    title: `${book.title} - ${book.author} | AI 阅读`,
    description,
    keywords: [book.title, book.author, book.category, ...book.tags],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${book.title} - ${book.author}`,
      description,
      url: pageUrl,
      type: 'article',
      locale: 'zh_CN',
      siteName: 'AI 阅读',
      images: [
        {
          url: `${BASE_URL}/icon.png`,
          width: 512,
          height: 512,
          alt: book.title,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${book.title} - ${book.author}`,
      description,
      images: [`${BASE_URL}/icon.png`],
    },
  };
}
```

注意：在文件顶部 `import` 语句之后、`generateMetadata` 函数之前添加 `const BASE_URL = 'https://reading.cearl.cc';`。

- [ ] **Step 2: 在书籍页注入 Book JSON-LD**

在 `BookPage` 组件的 `return` 语句中，在 `<article>` 标签内最前面添加结构化数据脚本。将 `export default async function BookPage` 替换为：

```typescript
export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookDetailBySlug(slug);

  if (!book) {
    notFound();
  }

  const pageUrl = `${BASE_URL}/books/${slug}/`;
  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    url: pageUrl,
    inLanguage: 'zh-CN',
    genre: book.category,
    keywords: book.tags.join(', '),
  };

  return (
    <article className="container mx-auto px-4 py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-10 pb-6 border-b border-slate-200">
          <h1 className="heading-gradient text-3xl md:text-4xl font-bold mb-5">
            {book.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">作者：</span>
              <span>{book.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">分类：</span>
              <span className="chip-brand">
                {book.category}
              </span>
            </div>
          </div>
          {book.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {book.tags.map(tag => (
                <span key={tag} className="chip-muted">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content with TOC */}
        <BookPageClient
          content={injectBookLinks(book.content, book.slug)}
          bookSlug={book.slug}
          bookTitle={book.title}
          bookAuthor={book.author}
        />
      </div>
    </article>
  );
}
```

- [ ] **Step 3: TypeScript 类型检查**

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site
npx tsc --noEmit 2>&1
```

Expected: 无错误。

- [ ] **Step 4: 构建并抽查一本书的生成 HTML**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -10
```

```bash
# 抽查一本书，检查 canonical 和 JSON-LD 是否出现在 HTML 中
grep -l "canonical" out/books/*/index.html | head -1 | xargs grep -c "canonical"
grep -l "application/ld+json" out/books/*/index.html | head -1 | xargs grep "ld+json" -A 5 | head -15
```

Expected: canonical 和 JSON-LD 出现在书籍页 HTML 中。

- [ ] **Step 5: Commit**

```bash
cd /Users/zcs/Notes/ai-reading
git add .nextjs-site/app/books/[slug]/page.tsx
git commit -m "feat: add canonical, OG article type, Book JSON-LD to book pages"
```

---

## Task 6: 性能诊断 — PageSpeed Insights 基线测量

在优化前先测量真实数据，仅修复实际存在的问题。

- [ ] **Step 1: 测量移动端 PageSpeed（首页）**

```bash
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://reading.cearl.cc/&strategy=mobile" > /tmp/psi-mobile-home.json
cat /tmp/psi-mobile-home.json | python3 -m json.tool | grep -E '"id"|"score"|"displayValue"' | head -40
```

记录：
- Performance score (0-100)
- LCP displayValue
- CLS displayValue
- INP displayValue (或 TBT)
- TTFB

- [ ] **Step 2: 测量桌面端 PageSpeed（首页）**

```bash
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://reading.cearl.cc/&strategy=desktop" > /tmp/psi-desktop-home.json
cat /tmp/psi-desktop-home.json | python3 -m json.tool | grep -E '"id"|"score"|"displayValue"' | head -40
```

- [ ] **Step 3: 测量一本书页面（书籍页更重要，有 highlight.js）**

```bash
# 替换为实际存在的书籍 slug（从 sitemap 取一个）
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://reading.cearl.cc/books/e-shang-pian-ju/&strategy=mobile" > /tmp/psi-mobile-book.json
cat /tmp/psi-mobile-book.json | python3 -m json.tool | grep -E '"id"|"score"|"displayValue"' | head -40
```

- [ ] **Step 4: 根据诊断结果决定是否需要 Task 7**

判断标准：
- Performance score < 90 → 执行 Task 7
- Performance score ≥ 90 → Task 7 可跳过，直接进入 Task 8

---

## Task 7: 性能优化（按需执行，基于 Task 6 诊断结果）

**Files:**
- Modify: `.nextjs-site/components/BaiduAnalytics.tsx`（若 TBT/LCP 有问题）
- Modify: `.nextjs-site/app/layout.tsx`（若需要 preconnect/DNS prefetch）

**前提：仅在 Task 6 诊断出具体问题时执行对应子步骤。**

### 7a: 如果 TBT > 200ms 或 LCP > 2s — 推迟百度统计加载

当前 `BaiduAnalytics.tsx` 使用 `useEffect` 注入脚本，但没有延迟到用户首次交互后。

- [ ] **Step 7a-1: 读取当前 BaiduAnalytics.tsx**

```bash
cat /Users/zcs/Notes/ai-reading/.nextjs-site/components/BaiduAnalytics.tsx
```

- [ ] **Step 7a-2: 修改为交互触发加载**

将 `BaiduAnalytics.tsx` 内容替换为：

```typescript
'use client';

import { useEffect } from 'react';
import { getAnalyticsId, isAnalyticsEnabled } from '@/lib/analytics-config';

export default function BaiduAnalytics() {
  useEffect(() => {
    if (!isAnalyticsEnabled()) return;

    const analyticsId = getAnalyticsId();
    if (!analyticsId) return;

    function loadScript() {
      if (document.getElementById('baidu-analytics')) return;
      const hm = document.createElement('script');
      hm.src = `https://hm.baidu.com/hm.js?${analyticsId}`;
      hm.id = 'baidu-analytics';
      hm.async = true;
      const s = document.getElementsByTagName('script')[0];
      s.parentNode!.insertBefore(hm, s);
    }

    const events = ['click', 'scroll', 'keydown', 'touchstart'] as const;
    const handler = () => {
      loadScript();
      events.forEach(e => window.removeEventListener(e, handler));
    };

    events.forEach(e =>
      window.addEventListener(e, handler, { once: true, passive: true })
    );

    // 备用：30 秒后无论如何都加载（避免漏统计长时间无交互用户）
    const fallback = setTimeout(loadScript, 30000);

    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      clearTimeout(fallback);
    };
  }, []);

  return null;
}
```

- [ ] **Step 7a-3: TypeScript 检查**

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site
npx tsc --noEmit 2>&1
```

Expected: 无错误。

- [ ] **Step 7a-4: Commit**

```bash
cd /Users/zcs/Notes/ai-reading
git add .nextjs-site/components/BaiduAnalytics.tsx
git commit -m "perf: defer Baidu Analytics to first user interaction to reduce TBT"
```

### 7b: 如果 CLS > 0.1 — 检查无尺寸图片

```bash
# 扫描所有图片标签是否缺少 width/height
grep -r "<img " /Users/zcs/Notes/ai-reading/.nextjs-site/components/ /Users/zcs/Notes/ai-reading/.nextjs-site/app/ | grep -v "width"
```

若有无 `width` 的 `<img>`，为其补充 `width` 和 `height` 属性。

### 7c: 验证优化效果

- [ ] 等待 deploy 完成后重新运行 Task 6 的 PageSpeed 测量
- [ ] 比对优化前后 LCP / TBT / CLS 数值

---

## Task 8: 触发部署并最终验证

- [ ] **Step 1: 推送所有已提交的更改**

```bash
cd /Users/zcs/Notes/ai-reading
git push origin main
```

等待 GitHub Actions deploy 完成（约 2-3 分钟）。

- [ ] **Step 2: 验证 sitemap.xml 可访问**

```bash
curl -sI https://reading.cearl.cc/sitemap.xml | grep -i content-type
curl -s https://reading.cearl.cc/sitemap.xml | head -20
```

Expected: `content-type: application/xml`，包含书籍 URL。

- [ ] **Step 3: 验证 robots.txt**

```bash
curl -sI https://reading.cearl.cc/robots.txt | grep -i content-type
curl -s https://reading.cearl.cc/robots.txt
```

Expected: `content-type: text/plain`，包含 AI bot 条目和 Sitemap 指向。

- [ ] **Step 4: 验证 llms.txt**

```bash
curl -sI https://reading.cearl.cc/llms.txt | grep -i content-type
curl -s https://reading.cearl.cc/llms.txt | head -5
```

Expected: `content-type: text/plain`。

- [ ] **Step 5: 验证书籍页 canonical 和 JSON-LD**

```bash
curl -s https://reading.cearl.cc/books/e-shang-pian-ju/ | grep -E 'canonical|ld\+json' | head -5
```

Expected: canonical link 和 JSON-LD script 出现在页面 HTML 中。

- [ ] **Step 6: 向搜索引擎提交 sitemap（手动操作，提示用户）**

以下步骤需要在浏览器中手动操作：

1. **Google Search Console**：[search.google.com/search-console](https://search.google.com/search-console) → 添加资源 `https://reading.cearl.cc` → 提交 sitemap：`sitemap.xml`
2. **百度站长**：[ziyuan.baidu.com](https://ziyuan.baidu.com) → 添加站点 → 主动推送 API（获取 Token 后运行）：
   ```bash
   curl -s https://reading.cearl.cc/sitemap.xml | grep -oP '(?<=<loc>)[^<]+' > /tmp/baidu-urls.txt
   curl -s -H 'Content-Type:text/plain' \
     --data-binary @/tmp/baidu-urls.txt \
     "https://data.zz.baidu.com/urls?site=https://reading.cearl.cc&token=YOUR_TOKEN"
   ```
3. **Bing Webmaster Tools**：[bing.com/webmasters](https://www.bing.com/webmasters/) → 提交 `https://reading.cearl.cc/sitemap.xml`

---

## 自查清单（完成后过一遍）

- [ ] `out/sitemap.xml` 存在，包含首页 + 169 本书 URL
- [ ] `out/robots.txt` 存在，Content-Type 正确，包含 AI bot 规则和 Sitemap 链接
- [ ] `out/llms.txt` 存在，Content-Type 正确
- [ ] 首页 `<head>` 包含 canonical, OG url, og:type=website, twitter:card
- [ ] 根布局 `<head>` 包含 WebSite JSON-LD
- [ ] 每本书页 `<head>` 包含 canonical（`/books/slug/`）
- [ ] 每本书页包含 og:type=article, og:url, Book JSON-LD
- [ ] TypeScript 无类型错误
- [ ] 构建无报错
- [ ] 线上文件可通过 curl 验证
