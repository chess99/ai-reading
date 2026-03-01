'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getReadingState, type ReadingState } from '@/lib/reading-state';

export default function ContinueReading() {
  const [readingState, setReadingState] = useState<ReadingState | null>(null);

  useEffect(() => {
    const state = getReadingState();
    setReadingState(state);
  }, []);

  if (!readingState) {
    return null;
  }

  const timeAgo = getTimeAgo(readingState.timestamp);

  return (
    <div className="mb-10 md:mb-14">
      <Link
        href={`/books/${readingState.bookSlug}`}
        className="block group"
      >
        <div className="surface-card p-5 md:p-6 border-2 border-transparent hover:border-brand/30 transition-all duration-300">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white shadow-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  继续阅读
                </h3>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">{timeAgo}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 group-hover:text-brand transition-colors">
                {readingState.bookTitle}
              </h2>
              <p className="text-sm md:text-base text-slate-600">
                {readingState.bookAuthor}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 text-slate-400 group-hover:text-brand group-hover:translate-x-1 transition-all">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes} 分钟前`;
  } else if (hours < 24) {
    return `${hours} 小时前`;
  } else if (days < 7) {
    return `${days} 天前`;
  } else {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
    });
  }
}
