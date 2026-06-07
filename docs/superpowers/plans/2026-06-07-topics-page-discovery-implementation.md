# Topics Page Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved clean search-first `/topics` index with a domain-only filter and no public topic-level hierarchy.

**Architecture:** Keep `/topics` as a server page that loads topic metadata, then pass that data into a focused client component for search and domain filtering. Extend topic metadata with optional `domain`, `group`, and non-rendered `searchText`; keep card rendering in `TopicCard` so the visual language remains consistent across topic surfaces.

**Tech Stack:** Next.js App Router, React client component, TypeScript, Tailwind CSS utility classes, Node test runner source-level tests.

---

## File Structure

- Modify `.nextjs-site/lib/topics.ts`
  - Add optional `domain`, `group`, and `searchText` to `TopicMeta`.
  - Parse optional `domain` and `group` frontmatter.
  - Build `searchText` from title, description, tags, domain, group, and book titles/authors.
- Create `.nextjs-site/components/TopicsDiscovery.tsx`
  - Client component for search input, domain buttons, empty state, and filtered `TopicCard` grid.
  - No level filters, no sorting controls, no total-count stat cards.
- Modify `.nextjs-site/components/TopicCard.tsx`
  - Prefer domain/group chips when available.
  - Keep book count chip.
  - Do not add level badges.
- Modify `.nextjs-site/app/topics/page.tsx`
  - Preserve existing metadata and original subtitle.
  - Replace direct grid rendering with `TopicsDiscovery`.
- Create `.nextjs-site/tests/topics-discovery-ui.test.mjs`
  - Source-level assertions for the approved UI contract.
- Modify selected `topics/*.md`
  - Add `domain` and `group` to the currently published topics so the domain filter works with real data.
  - Do not migrate the 80-topic roadmap in this plan.

## Task 1: Lock The UI Contract With Tests

**Files:**

- Create: `.nextjs-site/tests/topics-discovery-ui.test.mjs`

- [ ] **Step 1: Add source-level UI contract tests**

Create `.nextjs-site/tests/topics-discovery-ui.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const topicsPageSource = readFileSync(new URL('../app/topics/page.tsx', import.meta.url), 'utf8');
const discoverySourcePath = new URL('../components/TopicsDiscovery.tsx', import.meta.url);
const topicCardSource = readFileSync(new URL('../components/TopicCard.tsx', import.meta.url), 'utf8');
const topicsLibSource = readFileSync(new URL('../lib/topics.ts', import.meta.url), 'utf8');

function readDiscoverySource() {
  return readFileSync(discoverySourcePath, 'utf8');
}

test('topics page keeps the approved reading-oriented subtitle', () => {
  assert.match(
    topicsPageSource,
    /带着一个具体问题开始阅读：先建立判断框架，再沿着几本关键书逐层深入。/,
    'Topics page should keep the approved subtitle copy.'
  );
});

test('topics page delegates discovery behavior to a client component', () => {
  assert.match(topicsPageSource, /TopicsDiscovery/, 'Topics page should render the discovery component.');
  assert.doesNotMatch(
    topicsPageSource,
    /topics\.map\(topic =>\s*\(\s*<TopicCard/,
    'Topics page should not directly render an unfiltered card wall.'
  );
});

test('topics discovery uses search and domain-only filtering', () => {
  const discoverySource = readDiscoverySource();

  assert.match(discoverySource, /'use client'/, 'TopicsDiscovery should be a client component.');
  assert.match(discoverySource, /搜索主题、标签、领域、书名/, 'Search placeholder should match the approved scope.');
  assert.match(discoverySource, /aria-pressed=\{selectedDomain === domain\}/, 'Domain buttons should expose pressed state.');
  assert.match(discoverySource, /全部/, 'Domain filter should include 全部.');
  assert.doesNotMatch(discoverySource, /入门|框架|系统/, 'Discovery UI should not expose level labels.');
  assert.doesNotMatch(discoverySource, /排序|最新|书数/, 'Discovery UI should not expose sorting controls.');
  assert.doesNotMatch(discoverySource, /总数|80|候选主题|领域数/, 'Discovery UI should not show global stat cards.');
});

test('topic metadata supports explicit domain and group without public level', () => {
  assert.match(topicsLibSource, /domain\?: string/, 'TopicMeta should include optional domain.');
  assert.match(topicsLibSource, /group\?: string/, 'TopicMeta should include optional group.');
  assert.match(topicsLibSource, /searchText: string/, 'TopicMeta should include searchText for client-side filtering.');
  assert.doesNotMatch(topicsLibSource, /level\?: string/, 'Topic metadata should not add a public level field.');
});

test('topic cards do not render level badges', () => {
  assert.doesNotMatch(topicCardSource, /入门|框架|系统/, 'Topic cards should not show level badges.');
  assert.match(topicCardSource, /topic\.bookCount/, 'Topic cards should keep the book count chip.');
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && node --test tests/topics-discovery-ui.test.mjs
```

Expected:

- FAIL because `.nextjs-site/components/TopicsDiscovery.tsx` does not exist yet, or because the source assertions do not match current code.

## Task 2: Extend Topic Metadata

**Files:**

- Modify: `.nextjs-site/lib/topics.ts`
- Test: `.nextjs-site/tests/topics-discovery-ui.test.mjs`

- [ ] **Step 1: Update topic types and parsing**

Modify `.nextjs-site/lib/topics.ts` so the relevant type definitions and helpers include these fields:

```ts
export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  bookCount: number;
  domain?: string;
  group?: string;
  searchText: string;
}

interface TopicFrontmatter {
  slug?: string;
  title?: string;
  description?: string;
  tags?: string[];
  date?: string;
  domain?: string;
  group?: string;
  books?: TopicBookRecommendation[];
}
```

Add a helper near `toTopicMeta`:

```ts
function buildTopicSearchText(topic: Pick<TopicDetail, 'title' | 'description' | 'tags' | 'domain' | 'group' | 'books'>): string {
  return [
    topic.title,
    topic.description,
    topic.domain,
    topic.group,
    ...topic.tags,
    ...topic.books.flatMap(book => [book.title, book.author, book.role, book.reason]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
```

Update `toTopicMeta`:

```ts
function toTopicMeta(topic: TopicDetail): TopicMeta {
  return {
    slug: topic.slug,
    title: topic.title,
    description: topic.description,
    tags: topic.tags,
    date: topic.date,
    bookCount: topic.bookCount,
    domain: topic.domain,
    group: topic.group,
    searchText: buildTopicSearchText(topic),
  };
}
```

Update `TopicDetail`:

```ts
export interface TopicDetail extends TopicMeta {
  content: string;
  books: TopicBookRecommendation[];
  filePath: string;
}
```

When pushing topic details in `loadTopicDetails()`, include:

```ts
domain: frontmatter.domain,
group: frontmatter.group,
searchText: '',
```

The temporary `searchText: ''` is acceptable because `toTopicMeta()` rebuilds search text from the full detail. If detail pages later need `searchText`, set it after constructing the topic object instead of using an empty string.

- [ ] **Step 2: Run the UI contract test**

Run:

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && node --test tests/topics-discovery-ui.test.mjs
```

Expected:

- Still FAIL because `TopicsDiscovery` and page wiring are not implemented.

## Task 3: Add The Topics Discovery Client Component

**Files:**

- Create: `.nextjs-site/components/TopicsDiscovery.tsx`
- Test: `.nextjs-site/tests/topics-discovery-ui.test.mjs`

- [ ] **Step 1: Create the client component**

Create `.nextjs-site/components/TopicsDiscovery.tsx`:

```tsx
'use client';

import { useMemo, useState } from 'react';
import TopicCard from '@/components/TopicCard';
import { SearchIcon } from '@/components/Icons';
import type { TopicMeta } from '@/lib/topics';

interface TopicsDiscoveryProps {
  topics: TopicMeta[];
}

const ALL_DOMAINS_LABEL = '全部';

function getTopicDomain(topic: TopicMeta): string {
  return topic.domain || topic.tags[0] || '未分类';
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

export default function TopicsDiscovery({ topics }: TopicsDiscoveryProps) {
  const [keyword, setKeyword] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(ALL_DOMAINS_LABEL);

  const domains = useMemo(() => {
    const domainSet = new Set<string>();
    for (const topic of topics) {
      domainSet.add(getTopicDomain(topic));
    }
    return [ALL_DOMAINS_LABEL, ...Array.from(domainSet)];
  }, [topics]);

  const filteredTopics = useMemo(() => {
    const normalizedKeyword = normalizeSearchValue(keyword);

    return topics.filter(topic => {
      const domain = getTopicDomain(topic);
      const matchesDomain = selectedDomain === ALL_DOMAINS_LABEL || domain === selectedDomain;
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        topic.searchText.includes(normalizedKeyword) ||
        topic.title.toLowerCase().includes(normalizedKeyword) ||
        topic.description.toLowerCase().includes(normalizedKeyword);

      return matchesDomain && matchesKeyword;
    });
  }, [keyword, selectedDomain, topics]);

  return (
    <section aria-label="主题筛选" className="space-y-6">
      <div className="surface-card p-4 md:p-5">
        <label htmlFor="topic-search" className="sr-only">
          搜索主题
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500" />
          <input
            id="topic-search"
            type="search"
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder="搜索主题、标签、领域、书名，例如：决策、亲密关系、产品"
            className="input-brand"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 md:gap-3">
          <span className="mr-1 text-sm font-black text-stone-700">领域</span>
          {domains.map(domain => (
            <button
              key={domain}
              type="button"
              aria-pressed={selectedDomain === domain}
              onClick={() => setSelectedDomain(domain)}
              className={`min-h-11 rounded-lg border px-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 ${
                selectedDomain === domain
                  ? 'border-brand/40 bg-brand/15 text-brand'
                  : 'border-stone-300/80 bg-[#fffdf8] text-stone-700 hover:border-brand/30 hover:text-brand'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {filteredTopics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTopics.map(topic => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="surface-card p-8 text-center">
          <h2 className="text-lg font-black text-stone-950">没有找到匹配的主题</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">试试换一个关键词，或切回全部领域。</p>
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              setSelectedDomain(ALL_DOMAINS_LABEL);
            }}
            className="btn-outline-brand mt-5"
          >
            清空筛选
          </button>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Run the UI contract test**

Run:

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && node --test tests/topics-discovery-ui.test.mjs
```

Expected:

- Still FAIL until the `/topics` page renders `TopicsDiscovery`.

## Task 4: Wire The Topics Page And Card Metadata

**Files:**

- Modify: `.nextjs-site/app/topics/page.tsx`
- Modify: `.nextjs-site/components/TopicCard.tsx`
- Test: `.nextjs-site/tests/topics-discovery-ui.test.mjs`

- [ ] **Step 1: Replace direct card rendering on the topics page**

Modify `.nextjs-site/app/topics/page.tsx` imports:

```tsx
import type { Metadata } from 'next';
import TopicsDiscovery from '@/components/TopicsDiscovery';
import { BRAND_NAME } from '@/lib/brand';
import { BASE_URL } from '@/lib/config';
import { getAllTopicMetas } from '@/lib/topics';
```

Replace the grid block:

```tsx
<TopicsDiscovery topics={topics} />
```

Keep the existing subtitle exactly:

```tsx
<p className="mt-3 max-w-2xl text-sm md:text-base leading-7 text-stone-600">
  带着一个具体问题开始阅读：先建立判断框架，再沿着几本关键书逐层深入。
</p>
```

- [ ] **Step 2: Update card metadata without adding levels**

Modify `.nextjs-site/components/TopicCard.tsx` to use domain and group when present:

```tsx
import Link from 'next/link';
import { TopicMeta } from '@/lib/topics';

interface TopicCardProps {
  topic: TopicMeta;
  compact?: boolean;
}

export default function TopicCard({ topic, compact = false }: TopicCardProps) {
  const primaryLabel = topic.domain || 'TOPIC';
  const visibleTags = [topic.group, ...topic.tags].filter((tag): tag is string => Boolean(tag)).slice(0, 3);

  return (
    <Link
      href={`/topics/${topic.slug}`}
      className={`group surface-card surface-card-hover block ${compact ? 'p-5 min-w-[280px] md:min-w-[340px]' : 'p-5 md:p-6'}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[11px] font-black tracking-[0.16em] text-brand">{primaryLabel}</span>
        <span className="chip-muted text-[11px] flex-shrink-0">{topic.bookCount} 本书</span>
      </div>
      <h3 className="text-lg md:text-xl font-black tracking-tight text-stone-950 group-hover:text-brand transition-colors">
        {topic.title}
      </h3>
      <p className={`mt-3 text-sm leading-6 text-stone-600 ${compact ? 'line-clamp-2' : ''}`}>
        {topic.description}
      </p>
      {visibleTags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {visibleTags.map(tag => (
            <span key={tag} className="chip-brand text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
```

- [ ] **Step 3: Run the UI contract test**

Run:

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && node --test tests/topics-discovery-ui.test.mjs
```

Expected:

- PASS.

## Task 5: Add Domain And Group To Published Topics

**Files:**

- Modify: `topics/zhong-da-jue-ce.md`
- Modify: `topics/xi-tong-yu-fu-za-xing.md`
- Modify: `topics/ke-chi-xu-xi-guan.md`
- Modify: `topics/ti-gao-shen-du-gong-zuo-neng-li.md`
- Modify: `topics/pian-jian-yu-qun-ti-ying-xiang.md`
- Modify: `topics/cong-0-dao-1-zuo-chan-pin.md`
- Modify: `topics/li-jie-qin-mi-guan-xi.md`
- Modify: `topics/chuang-shang-yu-zi-wo-xiu-fu.md`

- [ ] **Step 1: Add explicit domain and group frontmatter**

Add these fields below `tags` in each file:

```yaml
domain: 思维
group: 决策与防错
```

Use this mapping:

| File | domain | group |
|---|---|---|
| `topics/zhong-da-jue-ce.md` | `思维` | `决策与防错` |
| `topics/xi-tong-yu-fu-za-xing.md` | `思维` | `系统与复杂性` |
| `topics/pian-jian-yu-qun-ti-ying-xiang.md` | `思维` | `群体影响` |
| `topics/ke-chi-xu-xi-guan.md` | `学习` | `习惯与行动` |
| `topics/ti-gao-shen-du-gong-zuo-neng-li.md` | `学习` | `注意力与深度工作` |
| `topics/cong-0-dao-1-zuo-chan-pin.md` | `商业` | `产品机会` |
| `topics/li-jie-qin-mi-guan-xi.md` | `关系` | `亲密关系` |
| `topics/chuang-shang-yu-zi-wo-xiu-fu.md` | `心理` | `创伤与修复` |

- [ ] **Step 2: Run topic content tests**

Run:

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && node --test tests/topics-content.test.mjs
```

Expected:

- PASS, because the new optional frontmatter should not break existing topic validation.

## Task 6: Full Verification

**Files:**

- Read: `.nextjs-site/app/topics/page.tsx`
- Read: `.nextjs-site/components/TopicsDiscovery.tsx`
- Read: `.nextjs-site/components/TopicCard.tsx`

- [ ] **Step 1: Run all tests**

Run:

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && npm test
```

Expected:

- PASS.

- [ ] **Step 2: Build the static site**

Run:

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && npm run build
```

Expected:

- PASS.
- No TypeScript errors from `TopicMeta`, `TopicDetail`, `TopicsDiscovery`, or `TopicCard`.

- [ ] **Step 3: Browser-check `/topics`**

Start the dev server:

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && npm run dev
```

Open `/topics/` and verify:

- Subtitle is exactly `带着一个具体问题开始阅读：先建立判断框架，再沿着几本关键书逐层深入。`
- No global total-count stat cards appear.
- No `入门` / `框架` / `系统` level labels appear.
- Search filters visible cards by title, description, tags, domain, group, and included book title text.
- Domain buttons filter cards.
- Empty state appears when no topic matches.
- Mobile width has no horizontal page overflow.

- [ ] **Step 4: Stop the dev server**

Stop the running dev server with `Ctrl-C` in the terminal session that started it.

## Task 7: Commit Implementation

**Files:**

- Stage only files changed by this implementation batch.

- [ ] **Step 1: Review status**

Run:

```bash
cd /Users/zcs/Notes/ai-reading && git status --short
```

Expected:

- Only the files from this plan should be modified or added.
- `.superpowers/` files should not appear because they are ignored.

- [ ] **Step 2: Stage implementation files**

Run:

```bash
cd /Users/zcs/Notes/ai-reading
git add \
  .nextjs-site/lib/topics.ts \
  .nextjs-site/components/TopicsDiscovery.tsx \
  .nextjs-site/components/TopicCard.tsx \
  .nextjs-site/app/topics/page.tsx \
  .nextjs-site/tests/topics-discovery-ui.test.mjs \
  topics/zhong-da-jue-ce.md \
  topics/xi-tong-yu-fu-za-xing.md \
  topics/pian-jian-yu-qun-ti-ying-xiang.md \
  topics/ke-chi-xu-xi-guan.md \
  topics/ti-gao-shen-du-gong-zuo-neng-li.md \
  topics/cong-0-dao-1-zuo-chan-pin.md \
  topics/li-jie-qin-mi-guan-xi.md \
  topics/chuang-shang-yu-zi-wo-xiu-fu.md
```

- [ ] **Step 3: Commit**

Run:

```bash
git commit -m "feat: add topics discovery filters"
```

Expected:

- Commit succeeds.
