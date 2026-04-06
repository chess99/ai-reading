'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
import { saveReadingState } from '@/lib/reading-state';

interface BookPageClientProps {
  content: string;
  bookSlug: string;
  bookTitle: string;
  bookAuthor: string;
}

export default function BookPageClient({ content, bookSlug, bookTitle, bookAuthor }: BookPageClientProps) {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const pathname = usePathname();

  // 保存阅读状态
  useEffect(() => {
    saveReadingState({
      bookSlug,
      bookTitle,
      bookAuthor,
      timestamp: Date.now(),
    });
  }, [bookSlug, bookTitle, bookAuthor]);

  return (
    <BookLayout onTocToggle={() => setIsTocOpen(true)} shareTitle={`${bookTitle} - ${bookAuthor}`}>
      <div className="flex gap-0 lg:gap-8 xl:gap-12 relative">
        {/* 主内容区 */}
        <div className="flex-1 min-w-0 max-w-4xl">
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex, rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* 桌面端大纲区域 - 固定在右侧 */}
        <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
          <div className="sticky top-20">
            <TableOfContents isOpen={true} onClose={() => {}} />
          </div>
        </div>

        {/* 移动端大纲 */}
        <div className="lg:hidden">
          <TableOfContents isOpen={isTocOpen} onClose={() => setIsTocOpen(false)} />
        </div>
      </div>
    </BookLayout>
  );
}
