'use client';

import BookTree from '@/components/BookTree';
import { BookTreeNode, BookMeta } from '@/lib/books';

interface LibraryClientProps {
  bookTree: BookTreeNode[];
  allBooks: BookMeta[];
}

export default function LibraryClient({ bookTree, allBooks }: LibraryClientProps) {
  return (
    <div className="h-full flex flex-col bg-[#fffdf8]/50">
      <div className="px-4 pt-5 pb-3 border-b border-stone-200/80">
        <p className="text-xs font-black tracking-[0.16em] text-brand mb-2">LIBRARY</p>
        <h1 className="text-2xl font-black tracking-tight text-stone-950">书库</h1>
        <p className="text-sm text-stone-500 mt-1">按原始目录浏览 {allBooks.length} 本书。</p>
      </div>
      <div className="flex-1 min-h-0">
        <BookTree
          bookTree={bookTree}
          allBooks={allBooks}
          showFilterInput
        />
      </div>
    </div>
  );
}
