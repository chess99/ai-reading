import { Suspense } from 'react';
import { getAllBookMetas } from '@/lib/books';
import SearchPageClient from './search-client';

export default function SearchPage() {
  const allBooks = getAllBookMetas();
  return (
    <Suspense fallback={<div className="page-container"><div className="page-content-4xl pt-8 text-slate-500">加载中...</div></div>}>
      <SearchPageClient allBooks={allBooks} />
    </Suspense>
  );
}
