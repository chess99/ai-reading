# 继续阅读多条历史记录 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将"继续阅读"从单条记录扩展为最多 5 条历史记录，支持折叠展示、乐观更新和旧数据迁移。

**Architecture:** `reading-state.ts` 改为数组存储，提供 `saveToHistory()` / `getReadingHistory()` 接口；`ContinueReading.tsx` 重写为三层卡片（主行 + 触发条 + 历史面板）；`page-client.tsx` 更新调用。

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, localStorage

---

## 文件地图

| 文件 | 操作 | 职责 |
|------|------|------|
| `.nextjs-site/lib/reading-state.ts` | 修改 | 存储改为数组；新增 `saveToHistory`、`getReadingHistory`；旧 key 迁移 |
| `.nextjs-site/components/ContinueReading.tsx` | 重写 | 三层卡片 UI，折叠交互，乐观更新 |
| `.nextjs-site/app/books/[slug]/page-client.tsx` | 修改 | 调用改为 `saveToHistory` |

---

## Task 1: 重写 reading-state.ts

**Files:**
- Modify: `.nextjs-site/lib/reading-state.ts`

- [ ] **Step 1: 将 `reading-state.ts` 完整替换为以下内容**

```typescript
export interface ReadingState {
  bookSlug: string;
  bookTitle: string;
  bookAuthor: string;
  timestamp: number;
}

const HISTORY_KEY = 'reading-state-history';
const LEGACY_KEY = 'reading-state-last-book';
const MAX_HISTORY = 5;

/** 将当前书插入历史队首，去重，最多保留 MAX_HISTORY 条 */
export function saveToHistory(state: ReadingState): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getReadingHistory();
    const deduped = history.filter(s => s.bookSlug !== state.bookSlug);
    const next = [state, ...deduped].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Failed to save reading history:', error);
  }
}

/** 读取历史记录，index 0 为最近。首次调用时迁移旧格式数据。 */
export function getReadingHistory(): ReadingState[] {
  if (typeof window === 'undefined') return [];
  try {
    // 迁移旧 key
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const old = JSON.parse(legacy) as ReadingState;
      const existing = localStorage.getItem(HISTORY_KEY);
      if (!existing) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify([old]));
      }
      localStorage.removeItem(LEGACY_KEY);
    }

    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved) return [];
    return JSON.parse(saved) as ReadingState[];
  } catch (error) {
    console.error('Failed to load reading history:', error);
    return [];
  }
}

/** 清空历史（保留供将来 UI 使用） */
export function clearReadingHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear reading history:', error);
  }
}

// 保留旧导出以防其他地方引用
export const saveReadingState = saveToHistory;
export function getReadingState(): ReadingState | null {
  const h = getReadingHistory();
  return h[0] ?? null;
}
export const clearReadingState = clearReadingHistory;
```

- [ ] **Step 2: 确认编译无报错**

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && npx tsc --noEmit 2>&1 | head -30
```

期望输出：无错误（空输出）

- [ ] **Step 3: Commit**

```bash
cd /Users/zcs/Notes/ai-reading && git add .nextjs-site/lib/reading-state.ts
git commit -m "refactor: reading-state 改为数组存储，保留旧 key 迁移兼容"
```

---

## Task 2: 更新 page-client.tsx 调用

**Files:**
- Modify: `.nextjs-site/app/books/[slug]/page-client.tsx`

- [ ] **Step 1: 将 import 行从 `saveReadingState` 改为 `saveToHistory`**

找到文件第 15 行：
```typescript
import { saveReadingState } from '@/lib/reading-state';
```
改为：
```typescript
import { saveToHistory } from '@/lib/reading-state';
```

- [ ] **Step 2: 将 useEffect 内的调用改为 `saveToHistory`**

找到：
```typescript
    saveReadingState({
      bookSlug,
      bookTitle,
      bookAuthor,
      timestamp: Date.now(),
    });
```
改为：
```typescript
    saveToHistory({
      bookSlug,
      bookTitle,
      bookAuthor,
      timestamp: Date.now(),
    });
```

- [ ] **Step 3: 确认编译无报错**

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && npx tsc --noEmit 2>&1 | head -30
```

期望输出：无错误

- [ ] **Step 4: Commit**

```bash
cd /Users/zcs/Notes/ai-reading && git add .nextjs-site/app/books/[slug]/page-client.tsx
git commit -m "refactor: page-client 调用改为 saveToHistory"
```

---

## Task 3: 重写 ContinueReading.tsx

**Files:**
- Modify: `.nextjs-site/components/ContinueReading.tsx`

- [ ] **Step 1: 将 `ContinueReading.tsx` 完整替换为以下内容**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getReadingHistory, type ReadingState } from '@/lib/reading-state';
import { ReadingEvents } from '@/lib/analytics';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/ai-reading';

export default function ContinueReading() {
  const [history, setHistory] = useState<ReadingState[]>([]);
  const [current, setCurrent] = useState<ReadingState | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const h = getReadingHistory();
    if (h.length > 0) {
      setCurrent(h[0]);
      setHistory(h.slice(1));
    }
  }, []);

  if (!current) return null;

  const rest = history; // history[0..3]，最多 4 条

  function handleMainClick() {
    ReadingEvents.trackContinueReading(current!.bookSlug);
  }

  function handleHistoryClick(item: ReadingState) {
    // 乐观更新：立即切换主卡片
    setCurrent(item);
    setHistory([current!, ...rest.filter(r => r.bookSlug !== item.bookSlug)]);
    setIsOpen(false);

    // 同时跳转（不等动画）
    ReadingEvents.trackContinueReading(item.bookSlug);
    router.push(`${BASE_PATH}/books/${item.bookSlug}`);
  }

  return (
    <div className="mb-10 md:mb-14">
      <div className="surface-card border-2 border-transparent overflow-hidden">

        {/* 主行 */}
        <Link
          href={`${BASE_PATH}/books/${current.bookSlug}`}
          className="flex items-center gap-4 p-5 md:p-6 group transition-colors duration-150 hover:bg-violet-50"
          onClick={handleMainClick}
        >
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          {/* 文字 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">继续阅读</h3>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400">{getTimeAgo(current.timestamp)}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 group-hover:text-brand transition-colors">
              {current.bookTitle}
            </h2>
            <p className="text-sm md:text-base text-slate-600">{current.bookAuthor}</p>
          </div>

          {/* 箭头 */}
          <div className="flex-shrink-0 text-slate-400 group-hover:text-brand group-hover:translate-x-1 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* 触发条：只在有历史记录时渲染 */}
        {rest.length > 0 && (
          <>
            <button
              className="w-full flex items-center justify-between px-5 md:px-6 py-2 border-t border-slate-100 text-left hover:bg-slate-50 transition-colors"
              onClick={() => setIsOpen(v => !v)}
              aria-expanded={isOpen}
            >
              <span className="text-xs text-slate-400 flex items-center gap-2">
                最近读过
                <span className="bg-slate-100 text-slate-500 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  +{rest.length}
                </span>
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 历史面板 */}
            <div
              className="overflow-hidden transition-all duration-[280ms]"
              style={{
                maxHeight: isOpen ? `${rest.length * 44 + 16}px` : '0px',
                transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <div className="px-4 md:px-5 pb-3 pt-1.5 flex flex-col gap-1">
                {rest.map(item => (
                  <button
                    key={item.bookSlug}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-violet-50 transition-colors group/item w-full"
                    onClick={() => handleHistoryClick(item)}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                    <span className="flex-1 text-sm text-slate-500 truncate group-hover/item:text-brand transition-colors">
                      {item.bookTitle}
                    </span>
                    <span className="text-xs text-slate-400 flex-shrink-0">{getTimeAgo(item.timestamp)}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return new Date(timestamp).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
}
```

- [ ] **Step 2: 确认编译无报错**

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && npx tsc --noEmit 2>&1 | head -30
```

期望输出：无错误

- [ ] **Step 3: 启动 dev server 手动验证**

```bash
cd /Users/zcs/Notes/ai-reading && npm run dev
```

打开 http://localhost:3000/ai-reading，验证：
1. 首次进入首页：`继续阅读` 区域不显示（localStorage 为空）
2. 进入任意一本书，返回首页：显示主卡片，无触发条（只有 1 条）
3. 再进入另一本书，返回首页：主卡片更新，触发条显示 `+1`
4. 点击触发条：面板展开/折叠，动画流畅
5. 点击历史条目：主卡片内容切换，同时跳转

- [ ] **Step 4: Commit**

```bash
cd /Users/zcs/Notes/ai-reading && git add .nextjs-site/components/ContinueReading.tsx
git commit -m "feat: 继续阅读支持多条历史记录，折叠展示，乐观更新"
```
