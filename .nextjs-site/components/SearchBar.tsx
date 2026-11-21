"use client";

import Link from "next/link";
import { BookMeta } from "@/lib/books";
import { SearchIcon, ShuffleIcon } from "@/components/Icons";
import { trackHomeModuleClick, useHomeModuleImpression } from "@/components/HomeModuleAnalytics";

interface SearchBarProps {
  books: BookMeta[];
  onRandomBook?: () => void;
}

export default function SearchBar({ books, onRandomBook }: SearchBarProps) {
  const randomButtonRef = useHomeModuleImpression<HTMLButtonElement>('random');

  const handleRandomBook = () => {
    if (onRandomBook) {
      trackHomeModuleClick('random');
      onRandomBook();
      return;
    }
    if (books.length === 0) return;
    const randomBook = books[Math.floor(Math.random() * books.length)];
    trackHomeModuleClick('random', { itemSlug: randomBook.slug });
    window.location.href = `/books/${randomBook.slug}`;
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      <Link
        href="/search"
        prefetch={false}
        className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg border border-[rgba(79,58,35,0.14)] bg-(--color-field) px-3.5 text-left text-stone-600 transition-colors hover:border-brand/35 hover:bg-[#efe8dc]"
        aria-label="打开搜索"
      >
        <span className="shrink-0">
          <SearchIcon className="w-5 h-5" />
        </span>
        <span className="truncate text-sm">
          搜索书名、作者或内容
        </span>
      </Link>

      <button
        ref={randomButtonRef}
        onClick={handleRandomBook}
        data-home-analytics-direct="true"
        data-home-module="random"
        className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[rgba(79,58,35,0.16)] bg-(--color-surface) px-3.5 text-sm font-semibold text-stone-800 transition-colors hover:border-brand/40 hover:bg-(--color-surface-muted) hover:text-brand"
        title="随机一本书"
      >
        <ShuffleIcon className="w-5 h-5" />
        <span>随机一本</span>
      </button>
    </div>
  );
}
