import Link from 'next/link';
import { BookMeta } from '@/lib/books';

interface BookCardProps {
  book: BookMeta;
  showNew?: boolean;
  analyticsPosition?: number;
}

const NEW_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 天

export default function BookCard({ book, showNew = false, analyticsPosition }: BookCardProps) {
  const isNew = showNew && Date.now() - book.addedAt < NEW_THRESHOLD_MS;

  return (
    <Link
      href={`/books/${book.slug}`}
      prefetch={false}
      data-home-item-slug={analyticsPosition ? book.slug : undefined}
      data-home-position={analyticsPosition}
      className="group flex-shrink-0 w-40 md:w-48 surface-card surface-card-hover p-4 flex flex-col gap-2.5 relative min-h-[168px]"
    >
      {isNew && (
        <span className="absolute top-3 right-3 text-[10px] font-black px-1.5 py-0.5 rounded bg-stone-900 text-[#fffdf8] leading-none tracking-wide">
          NEW
        </span>
      )}
      {/* 书脊色块 */}
      <div className="w-9 h-1 rounded-full bg-brand mb-1 opacity-75" />
      <h3 className="text-sm md:text-[15px] font-bold text-stone-950 group-hover:text-brand transition-colors line-clamp-2 leading-snug min-h-[2.625rem]">
        {book.title}
      </h3>
      <p className="text-xs text-stone-500 truncate">{book.author}</p>
      {book.categoryPath.length > 0 && (
        <span className="chip-muted self-start text-[11px] truncate max-w-full mt-auto">
          {book.categoryPath[book.categoryPath.length - 1]}
        </span>
      )}
    </Link>
  );
}
