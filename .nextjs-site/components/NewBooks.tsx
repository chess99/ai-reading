import { BookMeta } from '@/lib/books';
import BookCard from './BookCard';

interface NewBooksProps {
  books: BookMeta[];
}

export default function NewBooks({ books }: NewBooksProps) {
  if (books.length === 0) return null;

  return (
    <div className="mb-10 md:mb-14">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-brand to-brand-dark inline-block" />
          最新上架
        </h2>
      </div>
      <div className="flex overflow-x-auto pb-2 -mx-4 md:mx-0 scrollbar-none">
        <div className="flex-shrink-0 w-4 md:hidden" />
        <div className="flex gap-3">
          {books.map(book => (
            <div key={book.slug}>
              <BookCard book={book} showNew />
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 w-4 md:hidden" />
      </div>
    </div>
  );
}
