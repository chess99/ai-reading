import Link from 'next/link';
import { BookMeta } from '@/lib/books';
import BookCard from './BookCard';
import { ChevronRightIcon } from '@/components/Icons';

interface NewBooksProps {
  books: BookMeta[];
}

export default function NewBooks({ books }: NewBooksProps) {
  if (books.length === 0) return null;

  return (
    <section className="mb-10 md:mb-14" aria-labelledby="latest-books-title">
      <div className="flex items-center justify-between mb-4">
        <h2 id="latest-books-title" className="section-title">
          最新上架
        </h2>
        <Link
          href="/library"
          prefetch={false}
          data-home-item-slug="library"
          className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-stone-600 transition-colors hover:text-brand focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
        >
          浏览书库
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
        {books.map((book, index) => (
          <BookCard
            key={book.slug}
            book={book}
            showNew
            layout="latest"
            analyticsPosition={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
