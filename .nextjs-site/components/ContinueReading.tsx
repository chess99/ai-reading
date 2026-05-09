'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getReadingHistory, type ReadingState } from '@/lib/reading-state';
import { ReadingEvents } from '@/lib/analytics';

export default function ContinueReading() {
  const [current, setCurrent] = useState<ReadingState | null>(null);
  const [rest, setRest] = useState<ReadingState[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const h = getReadingHistory();
    if (h.length > 0) {
      setCurrent(h[0]);
      setRest(h.slice(1));
    }
  }, []);

  if (!current) return null;

  function handleMainClick() {
    ReadingEvents.trackContinueReading(current!.bookSlug);
  }

  function handleHistoryClick(item: ReadingState) {
    // 乐观更新：立即切换主卡片
    setCurrent(item);
    setRest([current!, ...rest.filter(r => r.bookSlug !== item.bookSlug)]);
    setIsOpen(false);

    // 同时跳转（不等动画）
    ReadingEvents.trackContinueReading(item.bookSlug);
    router.push(`/books/${item.bookSlug}`);
  }

  return (
    <div className="mb-10 md:mb-14">
      <div className="surface-card border-2 border-transparent overflow-hidden">

        {/* 主行 */}
        <Link
          href={`/books/${current.bookSlug}`}
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
