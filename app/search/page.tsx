import { getAllBooks } from '@/lib/books';
import SearchPageClient from './search-client';

export default function SearchPage() {
  const allBooks = getAllBooks();

  return <SearchPageClient books={allBooks} />;
}
