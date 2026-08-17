import Link from 'next/link';
import { BookMeta } from '@/lib/books';
import { ChevronRightIcon } from '@/components/Icons';

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
        ? 'group surface-card surface-card-hover relative grid min-h-[116px] w-full grid-cols-[4px_minmax(0,1fr)_auto] grid-rows-[auto_auto_1fr] gap-x-3 gap-y-1.5 p-4 md:flex md:min-h-[168px] md:flex-col md:gap-2.5'
        : 'group surface-card surface-card-hover relative flex min-h-[168px] w-40 flex-shrink-0 flex-col gap-2.5 p-4 md:w-48'}
    >
      {isNew && (
        <span className={isLatestLayout
          ? 'col-start-3 row-start-1 rounded bg-stone-900 px-1.5 py-0.5 text-[10px] font-black leading-none tracking-wide text-[#fffdf8] md:absolute md:right-3 md:top-3'
          : 'absolute right-3 top-3 rounded bg-stone-900 px-1.5 py-0.5 text-[10px] font-black leading-none tracking-wide text-[#fffdf8]'}
        >
          NEW
        </span>
      )}
      <div className={isLatestLayout
        ? 'row-span-3 h-full w-1 self-stretch rounded-full bg-brand opacity-75 md:mb-1 md:h-1 md:w-9 md:flex-none md:self-auto'
        : 'mb-1 h-1 w-9 rounded-full bg-brand opacity-75'}
      />
      <h3 className={isLatestLayout
        ? 'col-start-2 row-start-1 min-w-0 line-clamp-2 pr-2 text-[15px] font-bold leading-snug text-stone-950 transition-colors group-hover:text-brand md:min-h-[2.625rem] md:pr-9'
        : 'min-h-[2.625rem] line-clamp-2 text-sm font-bold leading-snug text-stone-950 transition-colors group-hover:text-brand md:text-[15px]'}
      >
        {book.title}
      </h3>
      <p className={isLatestLayout
        ? 'col-start-2 row-start-2 min-w-0 truncate text-xs text-stone-500'
        : 'truncate text-xs text-stone-500'}
      >
        {book.author}
      </p>
      {book.categoryPath.length > 0 && (
        <span className={isLatestLayout
          ? 'chip-muted col-start-2 row-start-3 mt-1 max-w-full self-end justify-self-start truncate text-[11px] md:mt-auto md:self-start'
          : 'chip-muted mt-auto max-w-full self-start truncate text-[11px]'}
        >
          {book.categoryPath[book.categoryPath.length - 1]}
        </span>
      )}
      {isLatestLayout && (
        <ChevronRightIcon className="col-start-3 row-start-3 h-4 w-4 self-end text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand md:hidden" />
      )}
    </Link>
  );
}
