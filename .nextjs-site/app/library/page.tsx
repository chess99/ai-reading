import type { Metadata } from 'next';
import { buildBookTree, getAllBookMetas } from '@/lib/books';
import { BRAND_NAME } from '@/lib/brand';
import { BASE_URL } from '@/lib/config';
import LibraryClient from './library-client';

export const metadata: Metadata = {
  title: `书库 | ${BRAND_NAME}`,
  description: `按分类目录与标签浏览${BRAND_NAME}收录的全部书籍解读与读书笔记。`,
  alternates: {
    canonical: `${BASE_URL}/library/`,
  },
  openGraph: {
    title: `书库 | ${BRAND_NAME}`,
    description: `按分类目录与标签浏览${BRAND_NAME}收录的全部书籍解读与读书笔记。`,
    url: `${BASE_URL}/library/`,
    siteName: BRAND_NAME,
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function LibraryPage() {
  const bookTree = buildBookTree();
  const allBooks = getAllBookMetas();
  return <LibraryClient bookTree={bookTree} allBooks={allBooks} />;
}
