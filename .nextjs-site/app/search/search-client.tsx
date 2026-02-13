'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/books';

interface SearchPageClientProps {
  books: Book[];
}

export default function SearchPageClient({ books }: SearchPageClientProps) {
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Full-text search in book content
  const searchResults = useMemo(() => {
    if (!keyword.trim()) return [];

    setIsSearching(true);
    const lowerKeyword = keyword.toLowerCase();
    const results = books
      .map(book => {
        // Search in title, author, category, tags, and content
        const titleMatch = book.title.toLowerCase().includes(lowerKeyword);
        const authorMatch = book.author.toLowerCase().includes(lowerKeyword);
        const categoryMatch = book.category.toLowerCase().includes(lowerKeyword);
        const tagMatch = book.tags.some(tag => tag.toLowerCase().includes(lowerKeyword));
        const contentMatch = book.content.toLowerCase().includes(lowerKeyword);

        if (!titleMatch && !authorMatch && !categoryMatch && !tagMatch && !contentMatch) {
          return null;
        }

        // Extract context around the keyword in content
        let excerpt = '';
        if (contentMatch) {
          const contentLower = book.content.toLowerCase();
          const index = contentLower.indexOf(lowerKeyword);
          const start = Math.max(0, index - 100);
          const end = Math.min(book.content.length, index + lowerKeyword.length + 100);
          excerpt = book.content.substring(start, end);
          if (start > 0) excerpt = '...' + excerpt;
          if (end < book.content.length) excerpt = excerpt + '...';
        }

        return {
          book,
          excerpt,
          matchType: titleMatch ? 'title' : authorMatch ? 'author' : contentMatch ? 'content' : 'other',
        };
      })
      .filter(Boolean);

    setIsSearching(false);
    return results;
  }, [keyword, books]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
          全文搜索
        </h1>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="搜索书籍标题、作者、内容..."
              className="w-full h-14 pl-12 pr-4 border-2 border-brand rounded-xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all"
              autoFocus
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔍
            </span>
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {keyword ? (
          <div>
            <div className="mb-4 text-gray-600">
              {isSearching ? (
                <span>搜索中...</span>
              ) : (
                <span>找到 {searchResults.length} 个结果</span>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map(result => {
                  if (!result) return null;
                  const { book, excerpt, matchType } = result;
                  return (
                    <Link
                      key={book.slug}
                      href={`/books/${book.slug}`}
                      className="block p-6 border border-gray-200 rounded-xl hover:border-brand hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">📖</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold mb-2 text-gray-900">
                            {book.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            作者：{book.author}
                          </p>
                          {excerpt && (
                            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                              {excerpt}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-brand/10 text-brand text-xs rounded">
                              {book.category}
                            </span>
                            {matchType === 'title' && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                标题匹配
                              </span>
                            )}
                            {matchType === 'content' && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                内容匹配
                              </span>
                            )}
                            {book.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg">未找到匹配的书籍</p>
                <p className="text-gray-400 text-sm mt-2">
                  试试其他关键词
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">输入关键词开始搜索</p>
            <p className="text-gray-400 text-sm mt-2">
              支持搜索书籍标题、作者、分类、标签和全文内容
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
