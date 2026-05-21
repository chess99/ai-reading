"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BookMeta } from "@/lib/books";
import { BookIcon, CloseIcon, SearchIcon, ShuffleIcon } from "@/components/Icons";

interface SearchBarProps {
  books: BookMeta[];
  onRandomBook?: () => void;
  showFullSearch?: boolean;
}

export default function SearchBar({
  books,
  onRandomBook,
  showFullSearch = true,
}: SearchBarProps) {
  const [keyword, setKeyword] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Filter books based on keyword
  const filteredBooks = useMemo(() => {
    if (!keyword.trim()) return [];

    const lowerKeyword = keyword.toLowerCase();
    return books
      .filter((book) => {
        return (
          book.title.toLowerCase().includes(lowerKeyword) ||
          book.author.toLowerCase().includes(lowerKeyword) ||
          book.category.toLowerCase().includes(lowerKeyword) ||
          book.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
        );
      })
      .slice(0, 10); // Limit to 10 results
  }, [keyword, books]);

  // Show results when there's a keyword
  useEffect(() => {
    setShowResults(keyword.trim().length > 0);
  }, [keyword]);

  const handleClear = () => {
    setKeyword("");
    setShowResults(false);
  };

  const handleRandomBook = () => {
    if (books.length === 0) return;
    const randomBook = books[Math.floor(Math.random() * books.length)];
    window.location.href = `/books/${randomBook.slug}`;
  };

  const actionsLayoutClass = showFullSearch ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1";

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索书籍标题、作者..."
            className="input-brand"
          />
          <span className="absolute left-[17px] top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-stone-500">
            <SearchIcon className="w-5 h-5" />
          </span>
          {keyword && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100"
              aria-label="清除搜索"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1 surface-card surface-floating max-h-96 overflow-y-auto z-50">
              {filteredBooks.length > 0 ? (
                <>
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      找到 {filteredBooks.length} 个结果
                    </span>
                    <button
                      onClick={handleClear}
                      className="text-sm text-brand hover:text-brand-dark"
                    >
                      清除搜索
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {filteredBooks.map((book) => (
                      <Link
                        key={book.slug}
                        href={`/books/${book.slug}`}
                        onClick={() => setShowResults(false)}
                      className="block p-4 hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                          <span className="icon-tile w-10 h-10 flex-shrink-0">
                            <BookIcon className="w-5 h-5" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 mb-1 truncate">
                              {book.title}
                            </h3>
                            <p className="text-sm text-slate-600 mb-2">
                              {book.author}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              <span className="chip-brand px-2 py-0.5 text-xs">
                                {book.category}
                              </span>
                              {book.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="chip-muted px-2 py-0.5 text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <p>未找到匹配的书籍</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons Row */}
        <div
          className={`w-full sm:w-auto grid ${actionsLayoutClass} sm:flex gap-4`}
        >
          {/* Full Search Button */}
          {showFullSearch && (
            <Link
              href="/search"
              className="btn-outline-brand w-full sm:w-auto flex items-center justify-center gap-3"
              title="全文搜索"
            >
              <SearchIcon className="w-5 h-5" />
              <span>全文搜索</span>
            </Link>
          )}

          {/* Random Button */}
          <button
            onClick={onRandomBook || handleRandomBook}
            className="btn-outline-brand w-full sm:w-auto flex items-center justify-center gap-3"
            title="随机一本书"
          >
            <ShuffleIcon className="w-5 h-5" />
            <span>随机一本</span>
          </button>
        </div>
      </div>
    </div>
  );
}
