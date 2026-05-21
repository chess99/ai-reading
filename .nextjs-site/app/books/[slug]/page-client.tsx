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
    saveToHistory({
      bookSlug,
      bookTitle,
      bookAuthor,
      timestamp: Date.now(),
    });
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
                  className="chip-brand hover:bg-brand hover:text-white transition-colors cursor-pointer text-sm"
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
