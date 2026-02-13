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
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/ai-reading';
    window.location.href = `${basePath}/books/${randomBook.slug}`;
  };

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="搜索书籍标题、作者..."
            className="w-full h-14 pl-[50px] pr-4 border-2 rounded-xl text-base font-medium outline-none transition-all"
            style={{
              borderColor: '#667eea',
              boxShadow: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-xl flex items-center pointer-events-none">
            🔍
          </span>
          {keyword && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          )}
        </div>

        {/* Buttons Row */}
        <div className="flex gap-4">
          {/* Full Search Button */}
          {showFullSearch && (
            <Link
              href="/search"
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-7 h-14 border-2 rounded-xl font-semibold transition-all whitespace-nowrap"
              style={{
                borderColor: '#667eea',
                backgroundColor: 'white',
                color: '#2c3e50',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#2c3e50';
              }}
              title="全文搜索"
            >
              <span className="text-xl">🔍</span>
              <span>全文搜索</span>
            </Link>
          )}

          {/* Random Button */}
          <button
            onClick={onRandomBook || handleRandomBook}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-7 h-14 border-2 rounded-xl font-semibold transition-all whitespace-nowrap"
            style={{
              borderColor: '#667eea',
              backgroundColor: 'white',
              color: '#2c3e50',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#667eea';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#2c3e50';
            }}
            title="随机一本书"
          >
            <span className="text-xl">🎲</span>
            <span>随机一本</span>
          </button>
        </div>
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
