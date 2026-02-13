'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/books';

interface SearchBarProps {
  books: Book[];
  onRandomBook?: () => void;
  showFullSearch?: boolean;
}

export default function SearchBar({ books, onRandomBook, showFullSearch = true }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Filter books based on keyword
  const filteredBooks = useMemo(() => {
    if (!keyword.trim()) return [];

    const lowerKeyword = keyword.toLowerCase();
    return books.filter(book => {
      return (
        book.title.toLowerCase().includes(lowerKeyword) ||
        book.author.toLowerCase().includes(lowerKeyword) ||
        book.category.toLowerCase().includes(lowerKeyword) ||
        book.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
      );
    }).slice(0, 10); // Limit to 10 results
  }, [keyword, books]);

  // Show results when there's a keyword
  useEffect(() => {
    setShowResults(keyword.trim().length > 0);
  }, [keyword]);

  const handleClear = () => {
    setKeyword('');
    setShowResults(false);
  };

  const handleRandomBook = () => {
    if (books.length === 0) return;
    const randomBook = books[Math.floor(Math.random() * books.length)];
    window.location.href = `/books/${randomBook.slug}`;
  };

  return (
    <div className="relative">
      <div className="flex gap-3 md:gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="搜索书籍标题、作者..."
            className="w-full h-12 md:h-14 pl-12 pr-4 border-2 border-brand rounded-xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
            🔍
          </span>
          {keyword && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Full Search Button */}
        {showFullSearch && (
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-2 px-4 md:px-6 h-12 md:h-14 text-white font-medium rounded-xl transition-colors whitespace-nowrap"
            style={{ backgroundColor: '#667eea' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#764ba2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
            title="全文搜索"
          >
            <span>🔍</span>
            <span>全文搜索</span>
          </Link>
        )}

        {/* Random Button */}
        <button
          onClick={onRandomBook || handleRandomBook}
          className="flex items-center gap-2 px-4 md:px-6 h-12 md:h-14 text-white font-medium rounded-xl transition-opacity hover:opacity-90 whitespace-nowrap"
          style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
          title="随机一本书"
        >
          <span>🎲</span>
          <span className="hidden sm:inline">随机一本</span>
        </button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          {filteredBooks.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-600">
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
                {filteredBooks.map(book => (
                  <Link
                    key={book.slug}
                    href={`/books/${book.slug}`}
                    onClick={() => setShowResults(false)}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📖</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {book.author}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-0.5 bg-brand/10 text-brand text-xs rounded">
                            {book.category}
                          </span>
                          {book.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
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
            <div className="p-8 text-center text-gray-500">
              <p>未找到匹配的书籍</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
