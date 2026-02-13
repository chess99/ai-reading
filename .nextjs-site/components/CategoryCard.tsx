'use client';

import Link from 'next/link';
import { Book } from '@/lib/books';

interface CategoryCardProps {
  category: string;
  books: Book[];
}

export default function CategoryCard({ category, books }: CategoryCardProps) {
  return (
    <div className="surface-card surface-card-hover p-5 md:p-6 group">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-2xl md:text-3xl">📚</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-semibold mb-1 truncate text-slate-900">
            {category}
          </h3>
          <p className="text-slate-500 text-xs md:text-sm">
            {books.length} 本书籍
          </p>
        </div>
      </div>
      <div className="space-y-1.5 md:space-y-2">
        {books.slice(0, 3).map(book => (
          <Link
            key={book.slug}
            href={`/books/${book.slug}`}
            className="block text-xs md:text-sm text-slate-700 truncate transition-colors hover:text-brand"
          >
            • {book.title}
          </Link>
        ))}
        {books.length > 3 && (
          <div className="text-xs md:text-sm text-slate-400 pt-1">
            还有 {books.length - 3} 本...
          </div>
        )}
      </div>
    </div>
  );
}
