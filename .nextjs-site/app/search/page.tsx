import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllBookMetas } from '@/lib/books';
import SearchPageClient from './search-client';
import { BASE_URL } from '@/lib/config';
import { BRAND_NAME } from '@/lib/brand';

export const metadata: Metadata = {
  title: `全文搜索 | ${BRAND_NAME}`,
  description: `在${BRAND_NAME}的全部书籍解读和读书笔记中搜索关键词、作者、书名、分类与核心观点。`,
  alternates: {
    canonical: `${BASE_URL}/search/`,
  },
};

export default function SearchPage() {
  const allBooks = getAllBookMetas();
  return (
    <Suspense fallback={<div className="page-container"><div className="page-content-4xl pt-8 text-stone-500">加载中...</div></div>}>
      <SearchPageClient allBooks={allBooks} />
    </Suspense>
  );
}
