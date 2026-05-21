'use client';

import BookTree from '@/components/BookTree';
import { BookTreeNode, BookMeta } from '@/lib/books';

interface LibraryClientProps {
  bookTree: BookTreeNode[];
  allBooks: BookMeta[];
}

export default function LibraryClient({ bookTree, allBooks }: LibraryClientProps) {
  return (
    <div className="h-full flex flex-col">
      <BookTree
        bookTree={bookTree}
        allBooks={allBooks}
        showFilterInput
      />
    </div>
  );
}
