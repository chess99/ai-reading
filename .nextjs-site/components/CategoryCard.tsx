'use client';

import { BookMeta } from '@/lib/books';
import BookCard from './BookCard';

interface CategoryCardProps {
  category: string;
  books: BookMeta[];
}

export default function CategoryCard({ category, books }: CategoryCardProps) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">📚</span>
        <h3 className="text-base md:text-lg font-semibold text-slate-900">{category}</h3>
        <span className="text-xs text-slate-400 mt-0.5">{books.length} 本</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-none">
        {books.map(book => (
          <div key={book.slug} className="snap-start">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}
