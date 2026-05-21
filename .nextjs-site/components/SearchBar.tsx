"use client";

import Link from "next/link";
import { BookMeta } from "@/lib/books";
import { SearchIcon, ShuffleIcon } from "@/components/Icons";

interface SearchBarProps {
  books: BookMeta[];
  onRandomBook?: () => void;
}

export default function SearchBar({ books, onRandomBook }: SearchBarProps) {
  const handleRandomBook = () => {
    if (books.length === 0) return;
    const randomBook = books[Math.floor(Math.random() * books.length)];
    window.location.href = `/books/${randomBook.slug}`;
  };

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
      <Link
        href="/search"
        className="input-brand surface-card-hover relative flex items-center gap-3 text-left no-underline"
        aria-label="打开搜索"
      >
        <span className="absolute left-[17px] top-1/2 -translate-y-1/2 flex items-center text-stone-500">
          <SearchIcon className="w-5 h-5" />
        </span>
        <span className="min-w-0 flex-1 truncate text-base font-medium text-stone-400">
          搜索书名、作者、内容...
        </span>
      </Link>

      <button
        onClick={onRandomBook || handleRandomBook}
        className="btn-outline-brand flex w-full items-center justify-center gap-3 md:w-auto"
        title="随机一本书"
      >
        <ShuffleIcon className="w-5 h-5" />
        <span>随机一本</span>
      </button>
    </div>
  );
}
