'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getReadingHistory, type ReadingState } from '@/lib/reading-state';
import { ReadingEvents } from '@/lib/analytics';
import { BookIcon, ChevronRightIcon } from '@/components/Icons';

export default function ContinueReading() {
  const [current, setCurrent] = useState<ReadingState | null>(null);
  const [rest, setRest] = useState<ReadingState[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
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
    // 乐观更新：切换主卡片内容，触发淡入动画
    setCurrent(item);
    setRest([current!, ...rest.filter(r => r.bookSlug !== item.bookSlug)]);
    setFadeKey(k => k + 1);
    setIsOpen(false);

    // 同时跳转（不等动画）
    ReadingEvents.trackContinueReading(item.bookSlug);
    router.push(`/books/${item.bookSlug}`);
  }

  return (
    <div className="mb-10 md:mb-14">
      <div className="surface-card overflow-hidden">

        {/* 主行 */}
        <Link
          href={`/books/${current.bookSlug}`}
          prefetch={false}
          data-home-item-slug={current.bookSlug}
          data-home-position="1"
          className="flex items-center gap-4 p-5 md:p-6 group transition-colors duration-150 hover:bg-[#f8f3ea]"
          onClick={handleMainClick}
        >
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 icon-tile">
            <BookIcon className="w-6 h-6" />
          </div>

          {/* 文字：key 变化时触发 fadeIn 动画 */}
          <div
            key={fadeKey}
            className="flex-1 min-w-0"
            style={{ animation: fadeKey > 0 ? 'fadeIn 120ms ease-out' : undefined }}
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-stone-500 tracking-wide">继续阅读</h3>
              <span className="text-xs text-stone-300">/</span>
              <span className="text-xs text-stone-400">{getTimeAgo(current.timestamp)}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-stone-950 mb-1 group-hover:text-brand transition-colors">
              {current.bookTitle}
            </h2>
            <p className="text-sm md:text-base text-stone-600">{current.bookAuthor}</p>
          </div>

          {/* 箭头：右移 2px */}
          <div className="flex-shrink-0 text-stone-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all">
            <ChevronRightIcon className="w-6 h-6" />
          </div>
        </Link>

        {/* 触发条：只在有历史记录时渲染 */}
        {rest.length > 0 && (
          <>
            <button
              className="w-full flex items-center justify-between px-5 md:px-6 py-2 border-t border-stone-100 text-left hover:bg-stone-50 transition-colors"
              onClick={() => setIsOpen(v => !v)}
              aria-expanded={isOpen}
            >
              <span className="text-xs text-stone-400 flex items-center gap-2">
                最近读过
                <span className="bg-stone-100 text-stone-600 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  +{rest.length}
                </span>
              </span>
              <svg
                className={`w-3.5 h-3.5 text-stone-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 历史面板 */}
            <div
              className="overflow-hidden transition-all duration-[280ms]"
              style={{
                maxHeight: isOpen ? `${rest.length * 44 + 20}px` : '0px',
                transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <div className="px-4 md:px-5 pb-3 pt-1.5 flex flex-col gap-1">
                {rest.map((item, index) => (
                  <button
                    key={item.bookSlug}
                    data-home-item-slug={item.bookSlug}
                    data-home-position={index + 2}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-[#f8f3ea] hover:translate-x-0.5 transition-all group/item w-full"
                    onClick={() => handleHistoryClick(item)}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 flex-shrink-0" />
                    <span className="flex-1 text-sm text-stone-500 truncate group-hover/item:text-brand transition-colors">
                      {item.bookTitle}
                    </span>
                    <span className="text-xs text-stone-400 flex-shrink-0">{getTimeAgo(item.timestamp)}</span>
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
