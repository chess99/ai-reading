'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import TableOfContents from '@/components/TableOfContents';
import BookLayout from '@/components/BookLayout';

interface BookPageClientProps {
  content: string;
}

export default function BookPageClient({ content }: BookPageClientProps) {
  const [isTocOpen, setIsTocOpen] = useState(false);

  return (
    <BookLayout onTocToggle={() => setIsTocOpen(true)}>
      <div className="flex gap-0 lg:gap-8 xl:gap-12 relative">
        {/* 主内容区 */}
        <div className="flex-1 min-w-0 max-w-4xl">
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
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
