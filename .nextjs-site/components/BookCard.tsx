import Link from 'next/link';
import { BookMeta } from '@/lib/books';

interface BookCardProps {
  book: BookMeta;
  showNew?: boolean;
}

const NEW_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 天

export default function BookCard({ book, showNew = false }: BookCardProps) {
  const isNew = showNew && Date.now() - book.addedAt < NEW_THRESHOLD_MS;

  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex-shrink-0 w-40 md:w-44 surface-card surface-card-hover p-4 flex flex-col gap-2 relative"
    >
      {isNew && (
        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand text-white leading-none">
          NEW
        </span>
      )}
      {/* 书脊色块 */}
      <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-brand to-brand-dark mb-1 opacity-70" />
      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand transition-colors line-clamp-2 leading-snug h-[2.625rem]">
        {book.title}
      </h3>
      <p className="text-xs text-slate-500 truncate">{book.author}</p>
      {book.categoryPath.length > 0 && (
        <span className="chip-muted self-start text-[11px] truncate max-w-full">
          {book.categoryPath[book.categoryPath.length - 1]}
        </span>
      )}
    </Link>
  );
}
