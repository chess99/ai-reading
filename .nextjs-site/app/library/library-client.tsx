'use client';

import PageHeading from '@/components/PageHeading';
import BookTree from '@/components/BookTree';
import { BookTreeNode, BookMeta } from '@/lib/books';

interface LibraryClientProps {
  bookTree: BookTreeNode[];
  allBooks: BookMeta[];
}

export default function LibraryClient({ bookTree, allBooks }: LibraryClientProps) {
  return (
    <div className="page-container">
      <div className="page-content-6xl">
        <PageHeading title="书库" description={`${allBooks.length} 本书籍解读，按分类浏览`} />
        <div className="library-shelves max-w-3xl">
          <BookTree bookTree={bookTree} allBooks={allBooks} showFilterInput />
        </div>
      </div>
    </div>
  );
}
