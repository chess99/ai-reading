'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { BookTreeNode, BookMeta } from '@/lib/books';
import BookTree from '@/components/BookTree';
import { CloseIcon } from '@/components/Icons';
import ModalPanel from '@/components/ModalPanel';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  docked: boolean;
}

type TabType = 'files' | 'tags';

export default function Sidebar({ isOpen, onClose, docked }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('files');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [bookTree, setBookTree] = useState<BookTreeNode[] | null>(null);
  const [allBooks, setAllBooks] = useState<BookMeta[] | null>(null);
  const books = allBooks ?? [];

  useEffect(() => {
    if (!isOpen || bookTree) return;
    let cancelled = false;

    fetch('/library-tree.json')
      .then(response => (response.ok ? response.json() : null))
      .then((data: BookTreeNode[] | null) => {
        if (!cancelled && data) setBookTree(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isOpen, bookTree]);

  useEffect(() => {
    if (!isOpen || allBooks) return;
    let cancelled = false;

    fetch('/library-books.json')
      .then(response => (response.ok ? response.json() : null))
      .then((data: BookMeta[] | null) => {
        if (!cancelled && data) setAllBooks(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isOpen, allBooks]);

  // Get all tags with counts
  const tags = useMemo(() => {
    const tagCount = new Map<string, number>();
    books.forEach(book => {
      book.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [books]);

  // Filter books by tag
  const booksByTag = useMemo(() => {
    if (!selectedTag) return [];
    return books.filter(book => book.tags.includes(selectedTag));
  }, [selectedTag, books]);

  const content = <>
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 gap-1 border-b border-stone-200 bg-[#fffdf8] p-2">
        <button
          onClick={() => setActiveTab('files')}
          aria-pressed={activeTab === 'files'}
          className={`min-h-11 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
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
          className={`min-h-11 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === 'tags'
              ? 'bg-brand/10 text-brand'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          标签
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        {activeTab === 'files' && (
          bookTree ? (
            <BookTree
              bookTree={bookTree}
              allBooks={books}
              showFilterInput
              onBookClick={docked ? undefined : onClose}
            />
          ) : (
            <div className="p-4 text-sm text-stone-400">正在加载目录...</div>
          )
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
                    className="min-h-11 px-2 text-xs text-brand hover:text-brand-dark"
                  >
                    返回
                  </button>
                </div>
                <div className="space-y-2">
                  {booksByTag.map(book => (
                    <Link
                      key={book.slug}
                      href={`/books/${book.slug}`}
                      onClick={() => { if (!docked) onClose(); }}
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
                {!allBooks ? (
                  <div className="text-sm text-stone-500 text-center py-8">
                    正在加载标签...
                  </div>
                ) : tags.length > 0 ? (
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
    </>;

  if (docked) return isOpen ? (
    <aside id="library-sidebar" aria-label="书库索引" className="flex h-full w-72 flex-col border-r border-stone-200/90 bg-[#fffdf8]">
      <header className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
        <h2 className="text-lg font-black text-stone-950">书库索引</h2>
        <button onClick={onClose} className="touch-icon hover:bg-stone-100" aria-label="收起书库">
          <CloseIcon className="h-5 w-5" />
        </button>
      </header>
      {content}
    </aside>
  ) : null;

  return <ModalPanel id="library-drawer" title="书库索引" placement="left" isOpen={isOpen} onClose={onClose}>
    {content}
  </ModalPanel>;
}
