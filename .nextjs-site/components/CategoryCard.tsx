'use client';

import { BookMeta } from '@/lib/books';
import BookCard from './BookCard';
import { LibraryIcon } from '@/components/Icons';

interface CategoryCardProps {
  category: string;
  books: BookMeta[];
}

export default function CategoryCard({ category, books }: CategoryCardProps) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="icon-tile w-8 h-8">
          <LibraryIcon className="w-4 h-4" />
        </span>
        <h3 className="text-base md:text-lg font-bold text-stone-950">{category}</h3>
        <span className="text-xs text-stone-500 mt-0.5">{books.length} 本</span>
      </div>
      <div className="flex overflow-x-auto pb-2 -mx-4 md:mx-0 scrollbar-none">
        <div className="flex-shrink-0 w-4 md:hidden" />
        <div className="flex gap-3">
          {books.map(book => (
            <div key={book.slug}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 w-4 md:hidden" />
      </div>
    </div>
  );
}
