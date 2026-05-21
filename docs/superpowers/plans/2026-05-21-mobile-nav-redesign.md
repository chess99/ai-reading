# Mobile Nav Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bottom Tab Bar to the mobile UI (🏠首页 / 📚书库 / 🔍搜索 / ⚙️设置) so users can navigate from any page — solving the "no clear back-to-home" problem — while leaving the desktop sidebar completely unchanged.

**Architecture:** New `BottomNav` component is `md:hidden` and fixed to viewport bottom. Existing `Sidebar` stays for desktop. Two new routes (`/library`, `/settings`) get their own pages. `/search` is upgraded with a 书名|正文 tab switcher. `Header` gains a `mode` prop — in `'book'` mode on mobile it shows `← 返回 | 书名 | 分享` instead of the hamburger.

**Tech Stack:** Next.js 15 App Router (static export), React, Tailwind CSS v4, TypeScript. No test framework in the project — each task is verified by running the dev server and visually checking the feature.

---

## File Structure

### Create
- `components/BottomNav.tsx` — fixed bottom nav, 4 tabs, `md:hidden`
- `components/BookTree.tsx` — extracted file tree; used by Sidebar (文件 tab) and LibraryPage
- `components/SettingsContent.tsx` — extracted settings form; used by SettingsDialog (desktop) and SettingsPage (mobile)
- `app/library/page.tsx` — server component; passes bookTree + allBooks to LibraryClient
- `app/library/library-client.tsx` — client page; renders BookTree full-height
- `app/settings/page.tsx` — client page; renders SettingsContent

### Modify
- `components/Header.tsx` — add `mode: 'home' | 'book'`, `bookTitle?: string` props; book mode renders `← 返回 | title | share` on mobile
- `components/Sidebar.tsx` — replace inline file tree section with `<BookTree>`
- `components/SettingsDialog.tsx` — replace inline content with `<SettingsContent>`
- `components/BookLayout.tsx` — remove share FAB (moved to Header); adjust FAB `bottom` for mobile to clear bottom nav (`bottom-20 md:bottom-6`)
- `app/books/[slug]/page-client.tsx` — pass `bookTitle` + `bookAuthor` to Header; add clickable tag chips; remove `shareTitle` prop usage
- `app/search/search-client.tsx` — add 书名|正文 tab switcher; read `?q=` and `?tab=` URL params on mount
- `app/layout-client.tsx` — detect book page via pathname; pass mode+title to Header; wrap Sidebar in `hidden md:block`; add `<BottomNav>`; add `pb-16 md:pb-0` to `<main>`
- `app/sitemap.ts` — add `/library` and `/settings` entries

---

## Task 1: BottomNav Component

**Files:**
- Create: `.nextjs-site/components/BottomNav.tsx`

- [ ] **Step 1: Create the file**

```tsx
// .nextjs-site/components/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    href: '/',
    label: '首页',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? 'text-brand' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/library',
    label: '书库',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? 'text-brand' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: '/search',
    label: '搜索',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? 'text-brand' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    href: '/settings',
    label: '设置',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? 'text-brand' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="flex items-stretch">
        {tabs.map(tab => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors ${
                active ? '' : 'hover:bg-slate-50 active:bg-slate-100'
              }`}
            >
              {tab.icon(active)}
              <span className={`text-[10px] font-medium leading-none ${active ? 'text-brand' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Start dev server and visually verify**

```bash
cd .nextjs-site && npm run dev
```

Open `http://localhost:3000` on a mobile viewport (DevTools → Toggle device toolbar, set to iPhone SE 375px). Confirm: bottom nav appears with 4 tabs; 🏠 is active on `/`. Navigate to `/search` — 🔍 becomes active. On desktop (1024px+) the nav is invisible.

- [ ] **Step 3: Commit**

```bash
git add .nextjs-site/components/BottomNav.tsx
git commit -m "feat: add BottomNav component with 4 tabs (mobile only)"
```

---

## Task 2: Extract BookTree Component

**Files:**
- Create: `.nextjs-site/components/BookTree.tsx`
- Modify: `.nextjs-site/components/Sidebar.tsx`

- [ ] **Step 1: Create BookTree.tsx**

This is the file tree extracted from Sidebar's "文件" tab (lines ~152–360 in Sidebar.tsx). It includes expand/collapse state, auto-reveal, toolbar, and optional quick-filter input.

```tsx
// .nextjs-site/components/BookTree.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookTreeNode, BookMeta } from '@/lib/books';

interface BookTreeProps {
  bookTree: BookTreeNode[];
  allBooks: BookMeta[];
  onBookClick?: () => void;
  showFilterInput?: boolean; // shows a quick-filter input above tree (for Library page)
}

export default function BookTree({ bookTree, allBooks, onBookClick, showFilterInput = false }: BookTreeProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [filterKeyword, setFilterKeyword] = useState('');
  const [autoReveal, setAutoReveal] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-auto-reveal');
    if (saved !== null) setAutoReveal(saved === 'true');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-auto-reveal', String(autoReveal));
    }
  }, [autoReveal]);

  // Filter tree when filterKeyword is set
  const filteredTree = useMemo(() => {
    if (!filterKeyword.trim()) return bookTree;
    const kw = filterKeyword.toLowerCase();

    function filterNodes(nodes: BookTreeNode[]): BookTreeNode[] {
      return nodes
        .map(node => {
          if (node.type === 'book') {
            const matches =
              node.book!.title.toLowerCase().includes(kw) ||
              node.book!.author.toLowerCase().includes(kw);
            return matches ? node : null;
          }
          // category: recurse
          const filteredChildren = filterNodes(node.children ?? []);
          if (filteredChildren.length === 0) return null;
          return { ...node, children: filteredChildren };
        })
        .filter((n): n is BookTreeNode => n !== null);
    }

    return filterNodes(bookTree);
  }, [bookTree, filterKeyword]);

  // Expand all categories visible in filteredTree when filtering
  useEffect(() => {
    if (!filterKeyword.trim()) return;
    const paths: string[] = [];
    function collectPaths(nodes: BookTreeNode[], prefix = '') {
      nodes.forEach(n => {
        if (n.type === 'category') {
          const p = prefix ? `${prefix}/${n.name}` : n.name;
          paths.push(p);
          collectPaths(n.children ?? [], p);
        }
      });
    }
    collectPaths(filteredTree);
    setExpandedCategories(new Set(paths));
  }, [filteredTree, filterKeyword]);

  const getAllCategoryPaths = (nodes: BookTreeNode[], prefix = ''): string[] => {
    const paths: string[] = [];
    nodes.forEach(node => {
      if (node.type === 'category') {
        const p = prefix ? `${prefix}/${node.name}` : node.name;
        paths.push(p);
        if (node.children) paths.push(...getAllCategoryPaths(node.children, p));
      }
    });
    return paths;
  };

  const expandAll = () => setExpandedCategories(new Set(getAllCategoryPaths(bookTree)));
  const collapseAll = () => setExpandedCategories(new Set());

  const findCurrentBook = () => {
    if (!pathname.startsWith('/books/')) return null;
    const slug = pathname.replace('/books/', '').replace(/\/$/, '');
    const book = allBooks.find(b => b.slug === slug);
    if (!book) return null;
    const categoryPaths: string[] = [];
    let pathSoFar = '';
    for (const cat of book.categoryPath) {
      pathSoFar = pathSoFar ? `${pathSoFar}/${cat}` : cat;
      categoryPaths.push(pathSoFar);
    }
    return { book, categoryPaths };
  };

  const revealActiveFile = () => {
    const current = findCurrentBook();
    if (!current) return;
    setExpandedCategories(new Set(current.categoryPaths));
    setTimeout(() => {
      const activeLink = document.querySelector('.sidebar-link-active');
      if (activeLink) activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  useEffect(() => {
    if (autoReveal && pathname.startsWith('/books/')) revealActiveFile();
  }, [pathname, autoReveal]);

  const toggleCategory = (categoryPath: string) => {
    const next = new Set(expandedCategories);
    if (next.has(categoryPath)) next.delete(categoryPath);
    else next.add(categoryPath);
    setExpandedCategories(next);
  };

  const renderNode = (node: BookTreeNode, parentPath: string, level = 0): React.ReactNode => {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isExpanded = expandedCategories.has(currentPath);
    const indent = level * 12;

    if (node.type === 'category') {
      return (
        <div key={currentPath}>
          <button
            onClick={() => toggleCategory(currentPath)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-slate-100 rounded transition-colors"
            style={{ paddingLeft: `${8 + indent}px` }}
          >
            <span className="text-slate-500 text-xs">{isExpanded ? '▼' : '▶'}</span>
            <span className="font-medium text-slate-900">{node.name}</span>
            <span className="ml-auto text-xs text-slate-400">{node.children?.length ?? 0}</span>
          </button>
          {isExpanded && node.children && (
            <div className="space-y-0.5">
              {node.children.map(child => renderNode(child, currentPath, level + 1))}
            </div>
          )}
        </div>
      );
    }

    const isActive = pathname === node.path || pathname === node.path + '/';
    return (
      <Link
        key={node.path}
        href={node.path}
        onClick={onBookClick}
        className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
        style={{ paddingLeft: `${8 + indent + 16}px` }}
      >
        <div className="flex items-start gap-2">
          <span className="text-xs text-slate-400 mt-0.5">📖</span>
          <span className="flex-1 line-clamp-2">{node.name}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Quick filter input (Library page only) */}
      {showFilterInput && (
        <div className="px-3 py-2 border-b border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={filterKeyword}
              onChange={e => setFilterKeyword(e.target.value)}
              placeholder="搜索书名、作者..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-slate-50"
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {filterKeyword && (
              <button onClick={() => setFilterKeyword('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100">
        <button onClick={expandAll} className="text-xs text-slate-600 hover:text-brand">展开全部</button>
        <span className="text-gray-300">|</span>
        <button onClick={collapseAll} className="text-xs text-slate-600 hover:text-brand">折叠全部</button>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setAutoReveal(!autoReveal)}
            className={`p-1.5 rounded hover:bg-slate-100 transition-colors cursor-pointer ${autoReveal ? 'text-brand' : 'text-slate-400'}`}
            title="自动定位当前文件"
            aria-label="自动定位当前文件"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
              <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2" />
              <line x1="3" y1="15" x2="21" y2="15" strokeWidth="2" />
            </svg>
          </button>
          <button
            onClick={revealActiveFile}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-brand transition-colors cursor-pointer"
            title="定位到当前文件"
            aria-label="定位到当前文件"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {filteredTree.length > 0
          ? filteredTree.map(node => renderNode(node, ''))
          : <p className="text-sm text-slate-400 text-center py-8">没有匹配的书籍</p>
        }
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace Sidebar's 文件 tab section with `<BookTree>`**

In `Sidebar.tsx`, replace the entire `文件` tab content section (the `{activeTab === 'files' && (...)}` block, approximately lines 292–360) with:

```tsx
{activeTab === 'files' && (
  <BookTree
    bookTree={bookTree}
    allBooks={allBooks}
    onBookClick={onClose}
  />
)}
```

Add the import at the top of Sidebar.tsx:
```tsx
import BookTree from '@/components/BookTree';
```

Remove the now-unused state and functions from Sidebar.tsx (they moved into BookTree):
- `expandedCategories` state
- `autoReveal` state and its two `useEffect`s
- `toggleCategory`, `getAllCategoryPaths`, `expandAll`, `collapseAll`, `findCurrentBook`, `revealActiveFile`, `renderTreeNode` functions
- The `useEffect` that called `revealActiveFile` on pathname change

Keep in Sidebar.tsx: `activeTab` state, `searchKeyword`/`searchResults`, `selectedTag`/`booksByTag`, `tags`, the two other tabs (搜索, 标签) — those stay unchanged.

- [ ] **Step 3: Verify Sidebar still works**

Run `npm run dev`. Open desktop view, click hamburger → sidebar opens, File tab shows the tree, expand/collapse works, clicking a book navigates and closes drawer.

- [ ] **Step 4: Commit**

```bash
git add .nextjs-site/components/BookTree.tsx .nextjs-site/components/Sidebar.tsx
git commit -m "refactor: extract BookTree component from Sidebar"
```

---

## Task 3: Library Page

**Files:**
- Create: `.nextjs-site/app/library/page.tsx`
- Create: `.nextjs-site/app/library/library-client.tsx`

- [ ] **Step 1: Create library-client.tsx**

```tsx
// .nextjs-site/app/library/library-client.tsx
'use client';

import BookTree from '@/components/BookTree';
import { BookTreeNode, BookMeta } from '@/lib/books';

interface LibraryClientProps {
  bookTree: BookTreeNode[];
  allBooks: BookMeta[];
}

export default function LibraryClient({ bookTree, allBooks }: LibraryClientProps) {
  return (
    <div className="h-full flex flex-col">
      <BookTree
        bookTree={bookTree}
        allBooks={allBooks}
        showFilterInput
      />
    </div>
  );
}
```

- [ ] **Step 2: Create page.tsx**

```tsx
// .nextjs-site/app/library/page.tsx
import { buildBookTree, getAllBookMetas } from '@/lib/books';
import LibraryClient from './library-client';

export default function LibraryPage() {
  const bookTree = buildBookTree();
  const allBooks = getAllBookMetas();
  return <LibraryClient bookTree={bookTree} allBooks={allBooks} />;
}
```

- [ ] **Step 3: Verify**

Navigate to `http://localhost:3000/library`. Confirm: full-height file tree with filter input at top, expand/collapse toolbar, tree renders all categories. Type a keyword in filter — tree narrows in real time.

- [ ] **Step 4: Commit**

```bash
git add .nextjs-site/app/library/
git commit -m "feat: add /library page with full-height BookTree"
```

---

## Task 4: SettingsContent Component and Settings Page

**Files:**
- Create: `.nextjs-site/components/SettingsContent.tsx`
- Create: `.nextjs-site/app/settings/page.tsx`
- Modify: `.nextjs-site/components/SettingsDialog.tsx`

- [ ] **Step 1: Create SettingsContent.tsx**

Extract the inner content from `SettingsDialog.tsx` (everything inside `<div className="p-6 space-y-6">`) into its own component:

```tsx
// .nextjs-site/components/SettingsContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { ReadingEvents } from '@/lib/analytics';

interface SettingsContentProps {
  allBooks: { slug: string; title: string; author: string }[];
}

export default function SettingsContent({ allBooks }: SettingsContentProps) {
  const [offlineMode, setOfflineMode] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [cachedCount, setCachedCount] = useState(0);
  const [prefetchProgress, setPrefetchProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('offline-mode');
    setOfflineMode(saved === 'true');
    checkCachedBooks();
  }, []);

  const checkCachedBooks = async () => {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open('reading-v1');
      const requests = await cache.keys();
      setCachedCount(requests.filter(r => r.url.includes('/books/') && !r.url.includes('__next')).length);
    } catch {}
  };

  const handleOfflineModeToggle = async () => {
    const newValue = !offlineMode;
    setOfflineMode(newValue);
    localStorage.setItem('offline-mode', String(newValue));
    ReadingEvents.trackOfflineMode(newValue);
    if (newValue) await prefetchAllBooks();
  };

  const prefetchAllBooks = async () => {
    if (!navigator.serviceWorker.controller) {
      alert('Service Worker 未就绪，请刷新页面后重试');
      return;
    }
    setIsPrefetching(true);
    setPrefetchProgress(0);
    const bookUrls = allBooks.map(book => `/books/${book.slug}/`);
    const batchSize = 5;
    for (let i = 0; i < bookUrls.length; i += batchSize) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PREFETCH_BOOKS',
        data: { urls: bookUrls.slice(i, i + batchSize) },
      });
      setPrefetchProgress(Math.floor(Math.min(((i + batchSize) / bookUrls.length) * 100, 100)));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsPrefetching(false);
    setPrefetchProgress(100);
    setTimeout(checkCachedBooks, 1000);
  };

  const handleClearCache = async () => {
    if (!confirm('确定要清除所有缓存吗？这将删除所有已下载的书籍。')) return;
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      setCachedCount(0);
      alert('缓存已清除');
    } catch {
      alert('清除缓存失败');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 离线模式 */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1">离线模式</h3>
            <p className="text-sm text-slate-600">开启后将下载所有书籍供离线阅读（约 10MB）</p>
          </div>
          <button
            onClick={handleOfflineModeToggle}
            disabled={isPrefetching}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
              offlineMode ? 'bg-brand' : 'bg-slate-300'
            } ${isPrefetching ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${offlineMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        {isPrefetching && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>下载中...</span><span>{prefetchProgress}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand to-brand-dark transition-all duration-300" style={{ width: `${prefetchProgress}%` }} />
            </div>
          </div>
        )}
        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">已缓存书籍</span>
            <span className="font-medium text-slate-900">{cachedCount} / {allBooks.length}</span>
          </div>
        </div>
      </div>

      {/* 存储管理 */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">存储管理</h3>
        <button
          onClick={handleClearCache}
          className="w-full px-4 py-2.5 border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          清除所有缓存
        </button>
      </div>

      {/* 关于 */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">关于</h3>
        <div className="space-y-2 text-sm text-slate-600">
          <p>AI 阅读 - AI 驱动的书籍解读平台</p>
          <p>当前收录：{allBooks.length} 本书籍</p>
          <p>
            <a href="https://github.com/chess99/ai-reading" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              GitHub 仓库
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update SettingsDialog.tsx to use SettingsContent**

Replace the `<div className="p-6 space-y-6">...</div>` block (and all its contents) in SettingsDialog.tsx with:

```tsx
<SettingsContent allBooks={allBooks} />
```

Add import at top:
```tsx
import SettingsContent from '@/components/SettingsContent';
```

Remove from SettingsDialog.tsx: the `offlineMode`, `isPrefetching`, `cachedCount`, `prefetchProgress` state variables, `checkCachedBooks`, `handleOfflineModeToggle`, `prefetchAllBooks`, `handleClearCache` functions, and the `useEffect` that initialised them — all of those are now in SettingsContent.

- [ ] **Step 3: Create settings page**

```tsx
// .nextjs-site/app/settings/page.tsx
import { getAllBookMetas } from '@/lib/books';
import SettingsContent from '@/components/SettingsContent';

export default function SettingsPage() {
  const allBooks = getAllBookMetas();
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <SettingsContent allBooks={allBooks} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Navigate to `http://localhost:3000/settings`. Confirm: settings content renders (offline toggle, cache count, about). Click the settings icon in header — dialog still opens on desktop.

- [ ] **Step 5: Commit**

```bash
git add .nextjs-site/components/SettingsContent.tsx .nextjs-site/components/SettingsDialog.tsx .nextjs-site/app/settings/
git commit -m "feat: extract SettingsContent, add /settings page"
```

---

## Task 5: Upgrade Search Page

**Files:**
- Modify: `.nextjs-site/app/search/search-client.tsx`

The upgraded search page has two tabs — **书名** (client-side instant title/author search, same logic as SearchBar) and **正文** (existing Pagefind full-text search). It also reads `?q=` and `?tab=` URL params on mount so tag chips on book pages can deep-link here.

- [ ] **Step 1: Replace search-client.tsx entirely**

```tsx
// .nextjs-site/app/search/search-client.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAllBookMetas, BookMeta } from '@/lib/books';
import { ReadingEvents } from '@/lib/analytics';

type SearchTab = 'books' | 'fulltext';

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta?: { title?: string };
}
interface SearchResultItem {
  url: string;
  title: string;
  excerptHtml: string;
}
interface PagefindModule {
  search: (term: string) => Promise<{ results: Array<{ data: () => Promise<PagefindResultData> }> }>;
}

function normalizeResultUrl(url: string): string {
  if (!url) return '/';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  return `/${url}`;
}

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(() => searchParams.get('q') ?? '');
  const [activeTab, setActiveTab] = useState<SearchTab>(
    () => (searchParams.get('tab') === 'fulltext' ? 'fulltext' : 'books')
  );

  // ── Books tab (instant title/author/category/tags search) ──────────────
  const allBooks = useMemo(() => getAllBookMetas(), []);
  const bookResults = useMemo((): BookMeta[] => {
    if (!keyword.trim()) return [];
    const kw = keyword.toLowerCase();
    return allBooks
      .filter(b =>
        b.title.toLowerCase().includes(kw) ||
        b.author.toLowerCase().includes(kw) ||
        b.category.toLowerCase().includes(kw) ||
        b.tags.some(t => t.toLowerCase().includes(kw))
      )
      .slice(0, 30);
  }, [keyword, allBooks]);

  // ── Fulltext tab (Pagefind) ────────────────────────────────────────────
  const [fulltextResults, setFulltextResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isIndexReady, setIsIndexReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const pagefindRef = useRef<PagefindModule | null>(null);

  const trimmedKeyword = useMemo(() => keyword.trim(), [keyword]);

  useEffect(() => {
    if (activeTab !== 'fulltext') return;
    let cancelled = false;
    const run = async () => {
      if (!trimmedKeyword) { setFulltextResults([]); setErrorMessage(''); return; }
      setIsSearching(true);
      setErrorMessage('');
      try {
        if (!pagefindRef.current) {
          const imported = await import(/* webpackIgnore: true */ `/pagefind/pagefind.js`);
          pagefindRef.current = (imported.default || imported) as PagefindModule;
          if (!cancelled) setIsIndexReady(true);
        }
        const res = await pagefindRef.current.search(trimmedKeyword);
        const details = await Promise.all(res.results.slice(0, 50).map(r => r.data()));
        if (cancelled) return;
        const items = details.map(item => ({
          url: normalizeResultUrl(item.url),
          title: item.meta?.title ?? '未命名书籍',
          excerptHtml: item.excerpt ?? '',
        }));
        setFulltextResults(items);
        if (items.length > 0) ReadingEvents.trackSearch(trimmedKeyword);
      } catch {
        if (!cancelled) {
          setFulltextResults([]);
          setErrorMessage(
            process.env.NODE_ENV === 'development'
              ? '开发模式下请先执行 npm run build 生成 pagefind 索引，再使用 npm run preview 验证全文搜索。'
              : '搜索索引加载失败，请稍后刷新页面重试。'
          );
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [trimmedKeyword, activeTab]);

  return (
    <div className="page-container">
      <div className="page-content-4xl">
        {/* Search input */}
        <div className="mb-4 relative">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="搜索书名、作者、内容..."
            className="input-brand"
            autoFocus
          />
          <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-xl pointer-events-none">🔍</span>
          {keyword && (
            <button onClick={() => setKeyword('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">✕</button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          {(['books', 'fulltext'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-brand border-b-2 border-brand'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'books' ? '书名' : '正文'}
            </button>
          ))}
        </div>

        {/* Books tab results */}
        {activeTab === 'books' && (
          <>
            {!keyword.trim() ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-slate-500 text-lg">输入关键词搜索书名、作者、分类</p>
              </div>
            ) : bookResults.length > 0 ? (
              <>
                <p className="text-sm text-slate-500 mb-4">找到 {bookResults.length} 个结果</p>
                <div className="space-y-3">
                  {bookResults.map(book => (
                    <Link key={book.slug} href={`/books/${book.slug}`} className="surface-card surface-card-hover block p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">📖</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 mb-1 truncate">{book.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">{book.author}</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="chip-brand px-2 py-0.5 text-xs">{book.category}</span>
                            {book.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="chip-muted px-2 py-0.5 text-xs">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-slate-500 text-lg">未找到匹配的书籍</p>
              </div>
            )}
          </>
        )}

        {/* Fulltext tab results */}
        {activeTab === 'fulltext' && (
          <>
            {isSearching && (
              <p className="text-sm text-slate-500 mb-3">{isIndexReady ? '正在检索...' : '正在加载搜索索引...'}</p>
            )}
            {errorMessage && <p className="text-sm text-rose-600 mb-3">{errorMessage}</p>}
            {!trimmedKeyword ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-slate-500 text-lg">输入关键词搜索书摘内容</p>
                <p className="text-slate-400 text-sm mt-2">全文检索基于静态索引，按需加载。</p>
              </div>
            ) : fulltextResults.length > 0 ? (
              <>
                <p className="text-sm text-slate-500 mb-4">找到 {fulltextResults.length} 个结果</p>
                <div className="space-y-6">
                  {fulltextResults.map(result => (
                    <a key={result.url} href={result.url} className="surface-card surface-card-hover block p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">📖</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold mb-2 text-slate-900">{result.title}</h3>
                          {result.excerptHtml && (
                            <p className="text-sm text-slate-700 line-clamp-3" dangerouslySetInnerHTML={{ __html: result.excerptHtml }} />
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            ) : !isSearching ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-slate-500 text-lg">未找到匹配的书籍</p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
```

> **Note:** `getAllBookMetas()` is a server-only function (reads filesystem). Using it in a client component requires that Next.js static export has serialized the data. Since this is a client component, pass `allBooks` as a prop from the server page instead.

- [ ] **Step 2: Update search/page.tsx to pass allBooks**

```tsx
// .nextjs-site/app/search/page.tsx
import { getAllBookMetas } from '@/lib/books';
import SearchPageClient from './search-client';

export default function SearchPage() {
  const allBooks = getAllBookMetas();
  return <SearchPageClient allBooks={allBooks} />;
}
```

- [ ] **Step 3: Fix search-client.tsx to accept allBooks as prop**

In search-client.tsx, change:
```tsx
// Remove this line:
const allBooks = useMemo(() => getAllBookMetas(), []);
```

Add `allBooks` to the component props:
```tsx
interface SearchPageClientProps {
  allBooks: BookMeta[];
}

export default function SearchPageClient({ allBooks }: SearchPageClientProps) {
```

Remove the `getAllBookMetas` import since it's no longer called client-side.

- [ ] **Step 4: Verify**

Navigate to `http://localhost:3000/search`. Confirm: two tabs render; typing in "投资" on the 书名 tab shows matching books instantly; 正文 tab shows Pagefind notice in dev mode. Navigate to `http://localhost:3000/search?q=心理&tab=books` — confirms the URL param pre-fills the query and selects the 书名 tab.

- [ ] **Step 5: Commit**

```bash
git add .nextjs-site/app/search/
git commit -m "feat: upgrade search page with 书名/正文 tabs and URL param support"
```

---

## Task 6: Refactor Header

**Files:**
- Modify: `.nextjs-site/components/Header.tsx`

The Header gains a `mode` prop. In `'book'` mode on mobile (`md:hidden`), it renders `← 返回 | bookTitle | 📤 share`. On desktop (`hidden md:flex`) it keeps the existing layout regardless of mode.

- [ ] **Step 1: Replace Header.tsx entirely**

```tsx
// .nextjs-site/components/Header.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  mode?: 'home' | 'book';
  bookTitle?: string;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

export default function Header({ mode = 'home', bookTitle, onMenuClick, onSettingsClick }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: bookTitle, url: window.location.href });
    } catch {
      // user cancelled
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_0_rgba(148,163,184,0.14)]">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* ── Mobile book mode: ← 返回 ── */}
          {mode === 'book' && (
            <button
              onClick={handleBack}
              className="md:hidden flex items-center gap-1 text-brand font-medium text-sm -ml-1 p-1"
              aria-label="返回"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>返回</span>
            </button>
          )}

          {/* ── Desktop: hamburger (home mode only) ── */}
          {mode === 'home' && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* ── Desktop hamburger (always shown on desktop for sidebar) ── */}
          <button
            onClick={onMenuClick}
            className="hidden md:block p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* ── Logo / Book title ── */}
          {mode === 'book' ? (
            <>
              {/* Mobile: show book title centered */}
              <span className="md:hidden flex-1 text-center text-sm font-semibold text-slate-900 truncate px-2">
                {bookTitle}
              </span>
              {/* Desktop: show logo */}
              <Link href="/" className="hidden md:block text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity heading-gradient">
                AI 阅读
              </Link>
            </>
          ) : (
            <Link href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity heading-gradient">
              AI 阅读
            </Link>
          )}

          {/* ── Right actions ── */}
          <nav className="flex items-center gap-2 md:gap-3">
            {/* Share button: mobile book mode only */}
            {mode === 'book' && (
              <button
                onClick={handleShare}
                className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors group"
                aria-label="分享"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}

            {/* Settings: desktop always, mobile home mode only */}
            <button
              onClick={onSettingsClick}
              className={`p-2 hover:bg-slate-100 rounded-lg transition-colors group ${
                mode === 'book' ? 'hidden md:block' : ''
              }`}
              aria-label="设置"
              title="设置"
            >
              <svg className="w-5 h-5 text-slate-600 group-hover:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify Header on desktop**

On desktop at `http://localhost:3000`, hamburger + logo + settings icon should all still appear and work.

- [ ] **Step 3: Commit**

```bash
git add .nextjs-site/components/Header.tsx
git commit -m "refactor: Header gains mode prop for mobile book page layout"
```

---

## Task 7: Book Page — Tag Chips and FAB Adjustment

**Files:**
- Modify: `.nextjs-site/app/books/[slug]/page-client.tsx`
- Modify: `.nextjs-site/components/BookLayout.tsx`

- [ ] **Step 1: Update BookLayout.tsx**

Remove the share FAB (it's now in Header). Adjust `bottom` to clear the bottom nav on mobile:

```tsx
// .nextjs-site/components/BookLayout.tsx
'use client';

interface BookLayoutProps {
  children: React.ReactNode;
  onTocToggle: () => void;
}

export default function BookLayout({ children, onTocToggle }: BookLayoutProps) {
  return (
    <>
      {/* TOC toggle FAB — bottom adjusted to clear mobile bottom nav */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 lg:hidden z-40">
        <button
          onClick={onTocToggle}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-brand/50 flex items-center justify-center group"
          aria-label="打开目录"
        >
          <svg className="w-5 h-5 text-slate-700 group-hover:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </button>
      </div>
      {children}
    </>
  );
}
```

- [ ] **Step 2: Update page-client.tsx**

Add tag chips at the bottom of the markdown content. The `saveTitle` prop passes book title up through context — but since we're using layout-client.tsx to derive the title from pathname + allBooks, we only need to keep `saveToHistory` as it already runs.

```tsx
// .nextjs-site/app/books/[slug]/page-client.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import TableOfContents from '@/components/TableOfContents';
import BookLayout from '@/components/BookLayout';
import { saveToHistory } from '@/lib/reading-state';

interface BookPageClientProps {
  content: string;
  bookSlug: string;
  bookTitle: string;
  bookAuthor: string;
  bookTags: string[];
}

export default function BookPageClient({ content, bookSlug, bookTitle, bookAuthor, bookTags }: BookPageClientProps) {
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    saveToHistory({ bookSlug, bookTitle, bookAuthor, timestamp: Date.now() });
  }, [bookSlug, bookTitle, bookAuthor]);

  return (
    <BookLayout onTocToggle={() => setIsTocOpen(true)}>
      <div className="flex gap-0 lg:gap-8 xl:gap-12 relative">
        {/* Main content */}
        <div className="flex-1 min-w-0 max-w-4xl">
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex, rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Tag chips */}
          {bookTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
              {bookTags.map(tag => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}&tab=books`}
                  className="chip-brand hover:bg-brand hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Desktop TOC sidebar */}
        <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
          <div className="sticky top-20">
            <TableOfContents isOpen={true} onClose={() => {}} />
          </div>
        </div>

        {/* Mobile TOC */}
        <div className="lg:hidden">
          <TableOfContents isOpen={isTocOpen} onClose={() => setIsTocOpen(false)} />
        </div>
      </div>
    </BookLayout>
  );
}
```

- [ ] **Step 3: Pass bookTags from page.tsx to BookPageClient**

In `.nextjs-site/app/books/[slug]/page.tsx`, add `bookTags` to the BookPageClient call:

```tsx
// Find the line that renders BookPageClient and add bookTags:
<BookPageClient
  content={book.content}
  bookSlug={book.slug}
  bookTitle={book.title}
  bookAuthor={book.author}
  bookTags={book.tags}       // add this line
/>
```

- [ ] **Step 4: Verify**

Open a book on mobile viewport. Confirm: TOC FAB is above the bottom nav (not overlapping). Tags appear at the bottom of the content as clickable chips. Clicking a tag navigates to `/search?q=<tag>&tab=books`.

- [ ] **Step 5: Commit**

```bash
git add .nextjs-site/app/books/ .nextjs-site/components/BookLayout.tsx
git commit -m "feat: book page tag chips, FAB clears bottom nav"
```

---

## Task 8: Wire Layout-Client — Sidebar Mobile-Off, BottomNav On

**Files:**
- Modify: `.nextjs-site/app/layout-client.tsx`

This is the final wiring step. layout-client.tsx gains:
1. pathname detection to set `mode='book'` on Header when on a book page
2. `bookTitle` derived from `allBooks` by slug
3. Sidebar wrapped in `hidden md:block` so it doesn't render on mobile
4. `<BottomNav />` added
5. `<main>` gets `pb-16 md:pb-0` to prevent content hiding behind bottom nav

- [ ] **Step 1: Replace layout-client.tsx entirely**

```tsx
// .nextjs-site/app/layout-client.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import UpdateNotification from '@/components/UpdateNotification';
import SettingsDialog from '@/components/SettingsDialog';
import { BookTreeNode, BookMeta } from '@/lib/books';

interface LayoutClientProps {
  bookTree: BookTreeNode[];
  allBooks: BookMeta[];
  children: React.ReactNode;
}

export default function LayoutClient({ bookTree, allBooks, children }: LayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();

  // Derive book title for Header when on a book page
  const bookSlug = pathname.startsWith('/books/')
    ? pathname.replace('/books/', '').replace(/\/$/, '')
    : null;
  const currentBook = bookSlug ? allBooks.find(b => b.slug === bookSlug) ?? null : null;
  const isBookPage = currentBook !== null;

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        mode={isBookPage ? 'book' : 'home'}
        bookTitle={currentBook?.title}
        onMenuClick={() => setSidebarOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: desktop only */}
        <div className="hidden md:block">
          <Sidebar
            bookTree={bookTree}
            allBooks={allBooks}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main content — pb-16 on mobile to clear fixed BottomNav */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      <BottomNav />
      <UpdateNotification />
      <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        allBooks={allBooks}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify the full flow on mobile viewport (375px)**

Run `npm run dev`. Check each scenario:

1. **Home page `/`**: No hamburger, logo centered, bottom nav shows 🏠 highlighted. Settings icon visible.
2. **Navigate to `/library`**: BookTree fills the page, 📚 tab highlighted.
3. **Navigate to `/search`**: Two tabs visible (书名/正文), 🔍 highlighted.
4. **Navigate to `/settings`**: Settings content shown, ⚙️ highlighted.
5. **Click a book from home**: Book page shows `← 返回 | 书名 | 📤`, bottom nav shows no highlight. Press `← 返回` → navigates back.
6. **Click a book from library**: Press `← 返回` → returns to library page. ✓
7. **Bottom nav 🏠 tap from book page**: Navigates to home. ✓

- [ ] **Step 3: Verify desktop is unchanged (1024px+)**

On desktop: left sidebar visible, hamburger works, settings icon works, `← 返回` is hidden (desktop book page looks same as before). Bottom nav is invisible.

- [ ] **Step 4: Commit**

```bash
git add .nextjs-site/app/layout-client.tsx
git commit -m "feat: wire BottomNav + mobile sidebar-off + book Header mode"
```

---

## Task 9: Update Sitemap

**Files:**
- Modify: `.nextjs-site/app/sitemap.ts`

- [ ] **Step 1: Add /library and /settings to sitemap**

Open `.nextjs-site/app/sitemap.ts`. Find the return array and add:

```ts
{
  url: `${BASE_URL}/library/`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.5,
},
{
  url: `${BASE_URL}/settings/`,
  lastModified: new Date(),
  changeFrequency: 'monthly' as const,
  priority: 0.3,
},
```

- [ ] **Step 2: Commit**

```bash
git add .nextjs-site/app/sitemap.ts
git commit -m "chore: add /library and /settings to sitemap"
```

---

## Self-Review Checklist

Spec requirement → plan coverage:

| Spec requirement | Task |
|---|---|
| BottomNav 4 tabs mobile only | Task 1 |
| Desktop sidebar unchanged | Task 8 (hidden md:block) |
| /library page with file tree | Task 3 |
| BookTree extracted, Sidebar updated | Task 2 |
| /settings page | Task 4 |
| Search: 书名/正文 tabs + URL params | Task 5 |
| Header: ← 返回 + bookTitle + share in book mode | Task 6 |
| Share moved from FAB to Header | Task 6 + 7 |
| FAB bottom adjusted for nav | Task 7 |
| Tag chips → `/search?q=&tab=books` | Task 7 |
| layout-client wires everything | Task 8 |
| Sitemap updated | Task 9 |
| SettingsContent extracted for reuse | Task 4 |
