'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { BookMeta } from '@/lib/books';
import { getNextBeijingMidnight, selectRecentBooks } from '@/lib/recent-books.mjs';
import BookCard from './BookCard';
import { ChevronRightIcon } from '@/components/Icons';

interface NewBooksProps {
  books: BookMeta[];
  renderedAt: number;
}

export default function NewBooks({ books, renderedAt }: NewBooksProps) {
  const [now, setNow] = useState(renderedAt);
  const recentBooks = selectRecentBooks(books, now);

  useEffect(() => {
    let refreshTimer: number | undefined;
    const refresh = () => {
      const currentTime = Date.now();
      setNow(currentTime);
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(refresh, getNextBeijingMidnight(currentTime) - currentTime + 50);
    };
    const refreshWhenVisible = () => {
      if (!document.hidden) refresh();
    };

    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  if (recentBooks.length === 0) return null;

  return (
    <section className="mb-10 md:mb-14" aria-labelledby="latest-books-title">
      <div className="flex items-center justify-between mb-4">
        <h2 id="latest-books-title" className="section-title">
          最近更新
        </h2>
        <Link
          href="/library"
          prefetch={false}
          data-home-item-slug="library"
          className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-stone-600 transition-colors hover:text-brand focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
        >
          浏览书库
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
        {recentBooks.map((book, index) => (
          <BookCard
            key={book.slug}
            book={book}
            layout="latest"
            analyticsPosition={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
