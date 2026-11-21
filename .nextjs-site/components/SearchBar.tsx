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
        className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg bg-stone-100 px-3 text-left text-stone-600 hover:bg-stone-200"
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
        className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
        title="随机一本书"
      >
        <ShuffleIcon className="w-5 h-5" />
        <span>随机一本</span>
      </button>
    </div>
  );
}
