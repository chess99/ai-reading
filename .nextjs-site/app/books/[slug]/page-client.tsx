'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import BookLayout from '@/components/BookLayout';
import SearchHighlights from '@/components/SearchHighlights';
import { saveToHistory } from '@/lib/reading-state';

interface BookPageClientProps {
  children: React.ReactNode;
  bookSlug: string;
  bookTitle: string;
  bookAuthor: string;
  bookTags: string[];
  wereadUrl?: string | null;
  relatedTopicCount?: number;
  relatedTopics?: React.ReactNode;
}

export default function BookPageClient({ children, bookSlug, bookTitle, bookAuthor, bookTags, wereadUrl, relatedTopicCount = 0, relatedTopics }: BookPageClientProps) {
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    saveToHistory({
      bookSlug,
      bookTitle,
      bookAuthor,
      timestamp: Date.now(),
    });
  }, [bookSlug, bookTitle, bookAuthor]);

  return (
    <BookLayout onTocToggle={() => setIsTocOpen(true)} isTocOpen={isTocOpen}>
      <SearchHighlights />
      <div className="reader-layout">
        {/* Main content */}
        <div className="reader-main min-w-0">
          <article data-pagefind-body className="reader-card surface-card">
            <div className="mb-8 border-b border-stone-200 pb-6">
              <h1 data-pagefind-meta="title" data-pagefind-weight="5" className="page-title break-words">{bookTitle}</h1>
              <p className="text-sm md:text-base text-stone-500 mt-3">{bookAuthor}</p>
              {(wereadUrl || relatedTopicCount > 0) && (
                <div data-pagefind-ignore className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {wereadUrl && (
                    <a
                      href={wereadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center rounded-md bg-stone-950 px-4 text-sm font-bold text-white transition-colors hover:bg-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
                    >
                      微信读书看原书 ↗
                    </a>
                  )}
                  {relatedTopicCount > 0 && (
                    <Link href="#book-related-topics" prefetch={false}
                      className="inline-flex min-h-11 items-center rounded text-sm font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                      主题阅读 · {relatedTopicCount} ↓
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div data-search-content className="markdown-content">
              {children}
            </div>

            <div data-pagefind-ignore>{relatedTopics}</div>

            {/* Tag chips */}
            {bookTags.length > 0 && (
              <div data-pagefind-ignore className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-stone-100">
                {bookTags.map(tag => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}&tab=books`}
                    prefetch={false}
                    className="chip-brand hover:bg-brand hover:text-white transition-colors cursor-pointer text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </article>
        </div>

        <TableOfContents contentKey={bookSlug} isOpen={isTocOpen} onClose={() => setIsTocOpen(false)} />
      </div>
    </BookLayout>
  );
}
