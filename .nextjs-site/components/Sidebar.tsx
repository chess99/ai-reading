'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookTreeNode, BookMeta } from '@/lib/books';
import BookTree from '@/components/BookTree';
import { CloseIcon } from '@/components/Icons';

interface SidebarProps {
  bookTree: BookTreeNode[];
  allBooks: BookMeta[];
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'files' | 'tags';

export default function Sidebar({ bookTree, allBooks, isOpen, onClose }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('files');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all tags with counts
  const tags = useMemo(() => {
    const tagCount = new Map<string, number>();
    allBooks.forEach(book => {
      book.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [allBooks]);

  // Filter books by tag
  const booksByTag = useMemo(() => {
    if (!selectedTag) return [];
    return allBooks.filter(book => book.tags.includes(selectedTag));
  }, [selectedTag, allBooks]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-80 bg-[#fffdf8] border-r border-stone-200/90
          transform transition-transform duration-300 ease-in-out
          flex flex-col h-full
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <Link
            href="/"
            prefetch={false}
            onClick={onClose}
            className="min-w-0 hover:opacity-80 transition-opacity"
          >
            <span className="block text-xs font-black tracking-[0.16em] text-brand">LIBRARY</span>
            <span className="block text-lg font-black text-stone-950">书库索引</span>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="关闭侧边栏"
          >
            <CloseIcon className="w-5 h-5 text-stone-600" />
          </button>
        </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 gap-1 border-b border-stone-200 bg-[#fffdf8] p-2">
        <button
          onClick={() => setActiveTab('files')}
          aria-pressed={activeTab === 'files'}
          className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === 'files'
              ? 'bg-brand/10 text-brand'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          目录
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          aria-pressed={activeTab === 'tags'}
          className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === 'tags'
              ? 'bg-brand/10 text-brand'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          标签
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'files' && (
          <BookTree
            bookTree={bookTree}
            allBooks={allBooks}
          />
        )}

        {activeTab === 'tags' && (
          <div className="flex-1 overflow-auto p-4">
            {selectedTag ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-stone-950">
                    标签：{selectedTag}
                  </h3>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="text-xs text-brand hover:text-brand-dark"
                  >
                    返回
                  </button>
                </div>
                <div className="space-y-2">
                  {booksByTag.map(book => (
                    <Link
                      key={book.slug}
                      href={`/books/${book.slug}`}
                      prefetch={false}
                      className="block p-2 hover:bg-stone-50 rounded transition-colors"
                    >
                      <div className="text-sm font-semibold text-stone-950 mb-1 line-clamp-1">
                        {book.title}
                      </div>
                      <div className="text-xs text-stone-600 line-clamp-1">
                        {book.author}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <>
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(({ tag, count }) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="sidebar-tag-button"
                      >
                        {tag} ({count})
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-stone-500 text-center py-8">
                    暂无标签
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
