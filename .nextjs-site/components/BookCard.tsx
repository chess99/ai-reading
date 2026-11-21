import Link from 'next/link';
import { BookMeta } from '@/lib/books';

interface BookCardProps {
  book: BookMeta;
  showNew?: boolean;
  analyticsPosition?: number;
  layout?: 'rail' | 'latest';
}

const NEW_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 天

export default function BookCard({
  book,
  showNew = false,
  analyticsPosition,
  layout = 'rail',
}: BookCardProps) {
  const isNew = showNew && Date.now() - book.addedAt < NEW_THRESHOLD_MS;
  const isLatestLayout = layout === 'latest';

  return (
    <Link
      href={`/books/${book.slug}`}
      prefetch={false}
      data-home-item-slug={analyticsPosition ? book.slug : undefined}
      data-home-position={analyticsPosition}
      className={isLatestLayout
        ? 'group relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b border-[#e4dccf] py-3.5 md:flex md:min-h-[168px] md:flex-col md:items-start md:gap-2.5 md:rounded-lg md:border md:border-[rgba(79,58,35,0.14)] md:bg-(--color-surface) md:p-4 surface-card-hover'
        : 'group surface-card surface-card-hover relative flex min-h-[168px] w-40 flex-shrink-0 flex-col gap-2.5 p-4 md:w-48'}
    >
      {isNew && (
        <span className={isLatestLayout
          ? 'absolute right-2 top-0 rounded bg-stone-900 px-1.5 py-0.5 text-[10px] font-black leading-none tracking-wide text-[#fffdf8] md:right-3 md:top-3'
          : 'absolute right-3 top-3 rounded bg-stone-900 px-1.5 py-0.5 text-[10px] font-black leading-none tracking-wide text-[#fffdf8]'}
        >
          NEW
        </span>
      )}
      <div className={isLatestLayout
        ? 'hidden rounded-full bg-brand opacity-75 md:mb-1 md:block md:h-1 md:w-9 md:flex-none'
        : 'mb-1 h-1 w-9 rounded-full bg-brand opacity-75'}
      />
      <h3 className={isLatestLayout
        ? 'col-start-1 row-start-1 min-w-0 line-clamp-2 pr-2 text-[15px] font-bold leading-snug text-stone-950 transition-colors group-hover:text-brand md:min-h-[2.625rem] md:pr-9'
        : 'min-h-[2.625rem] line-clamp-2 text-sm font-bold leading-snug text-stone-950 transition-colors group-hover:text-brand md:text-[15px]'}
      >
        {book.title}
      </h3>
      <p className={isLatestLayout
        ? 'col-start-1 row-start-2 min-w-0 truncate text-xs text-stone-500'
        : 'truncate text-xs text-stone-500'}
      >
        {book.author}
      </p>
      {book.categoryPath.length > 0 && (
        <span className={isLatestLayout
          ? 'chip-muted col-start-2 row-span-2 row-start-1 max-w-28 truncate !px-2 !py-0.5 !text-[11px] md:mt-auto md:max-w-full md:self-start'
          : 'chip-muted mt-auto max-w-full self-start truncate text-[11px]'}
        >
          {book.categoryPath[book.categoryPath.length - 1]}
        </span>
      )}
    </Link>
  );
}
