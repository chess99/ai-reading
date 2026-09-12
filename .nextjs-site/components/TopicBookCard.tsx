import Link from 'next/link';
import { ChevronRightIcon } from '@/components/Icons';
import type { TopicBookRecommendation } from '@/lib/topics';
import { READING_LABELS } from '@/lib/topic-discovery';
export default function TopicBookCard({ book, index, entry = false }: { book: TopicBookRecommendation; index: number; entry?: boolean }) {
  const available = book.status === 'in_library' && book.book;
  const content = <>
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
      <span className="font-bold text-brand">{entry ? book.role : READING_LABELS[book.reading]}</span>
      {!available && <span className="rounded bg-stone-100 px-2 py-1 text-stone-600">解读待补</span>}
    </div>
    <h3 className="flex items-start justify-between gap-2 font-bold leading-6 text-stone-950">
      <span>《{book.title}》</span>{available && <ChevronRightIcon className="mt-1 h-4 w-4 flex-shrink-0 text-brand" />}
    </h3>
    <p className="mt-1 text-xs leading-5 text-stone-500">{book.author}</p>
    {!entry && book.originalTitle && book.originalTitle !== book.title && <p className="mt-1 break-words text-xs leading-5 text-stone-500">{book.originalTitle}</p>}
    <p className="mt-3 text-sm leading-6 text-stone-600">{book.reason}</p>
  </>;
  const className = 'block h-full rounded-lg border border-stone-200 bg-[#fffdf8] p-4';
  return <div id={entry ? undefined : `book-${index + 1}`} className="min-w-0 scroll-mt-24">
    {available ? <Link href={`/books/${book.slug}/`} prefetch={false} className={`${className} transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20`} aria-label={`打开《${book.title}》`}>{content}</Link>
      : <div className={className}>{content}</div>}
  </div>;
}
