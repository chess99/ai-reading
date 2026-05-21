import { buildBookTree, getAllBookMetas } from '@/lib/books';
import LibraryClient from './library-client';

export default function LibraryPage() {
  const bookTree = buildBookTree();
  const allBooks = getAllBookMetas();
  return <LibraryClient bookTree={bookTree} allBooks={allBooks} />;
}
