'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookTreeNode, BookMeta } from '@/lib/books';

interface SidebarProps {
  bookTree: BookTreeNode[];
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'files' | 'search' | 'tags';

export default function Sidebar({ bookTree, isOpen, onClose }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('files');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all books from tree
  const allBooks = useMemo(() => {
    const books: BookMeta[] = [];
    bookTree.forEach(category => {
      category.children?.forEach(node => {
        if (node.book) {
          books.push(node.book);
        }
      });
    });
    return books;
  }, [bookTree]);

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

  // Filter books by search keyword
  const searchResults = useMemo(() => {
    if (!searchKeyword.trim()) return [];
    const lowerKeyword = searchKeyword.toLowerCase();
    return allBooks.filter(book => {
      return (
        book.title.toLowerCase().includes(lowerKeyword) ||
        book.author.toLowerCase().includes(lowerKeyword) ||
        book.category.toLowerCase().includes(lowerKeyword) ||
        book.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
      );
    });
  }, [searchKeyword, allBooks]);

  // Filter books by tag
  const booksByTag = useMemo(() => {
    if (!selectedTag) return [];
    return allBooks.filter(book => book.tags.includes(selectedTag));
  }, [selectedTag, allBooks]);

  const toggleCategory = (categoryPath: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryPath)) {
      newExpanded.delete(categoryPath);
    } else {
      newExpanded.add(categoryPath);
    }
    setExpandedCategories(newExpanded);
  };

  const getAllCategoryPaths = (nodes: BookTreeNode[], prefix = ''): string[] => {
    const paths: string[] = [];
    nodes.forEach(node => {
      if (node.type === 'category') {
        const path = prefix ? `${prefix}/${node.name}` : node.name;
        paths.push(path);
        if (node.children) {
          paths.push(...getAllCategoryPaths(node.children, path));
        }
      }
    });
    return paths;
  };

  const expandAll = () => {
    const allPaths = getAllCategoryPaths(bookTree);
    setExpandedCategories(new Set(allPaths));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  // 递归渲染树节点
  const renderTreeNode = (node: BookTreeNode, parentPath: string, level: number = 0): React.ReactNode => {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isExpanded = expandedCategories.has(currentPath);
    const indent = level * 12; // 每级缩进 12px

    if (node.type === 'category') {
      return (
        <div key={currentPath}>
          {/* Category */}
          <button
            onClick={() => toggleCategory(currentPath)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-slate-100 rounded transition-colors"
            style={{ paddingLeft: `${8 + indent}px` }}
          >
            <span className="text-slate-500 text-xs">
              {isExpanded ? '▼' : '▶'}
            </span>
            <span className="font-medium text-slate-900">
              {node.name}
            </span>
            <span className="ml-auto text-xs text-slate-400">
              {node.children?.length || 0}
            </span>
          </button>

          {/* Children */}
          {isExpanded && node.children && (
            <div className="space-y-0.5">
              {node.children.map(child => renderTreeNode(child, currentPath, level + 1))}
            </div>
          )}
        </div>
      );
    } else {
      // Book node
      return (
        <Link
          key={node.path}
          href={node.path}
          onClick={onClose}
          className="sidebar-link"
          style={{ paddingLeft: `${8 + indent + 16}px` }}
        >
          <div className="flex items-start gap-2">
            <span className="text-xs text-slate-400 mt-0.5">
              📖
            </span>
            <span className="flex-1 line-clamp-2">
              {node.name}
            </span>
          </div>
        </Link>
      );
    }
  };

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
          w-64 bg-white border-r border-slate-200
          transform transition-transform duration-300 ease-in-out
          flex flex-col h-full
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header - Only show on mobile */}
        <div className="md:hidden p-4 border-b border-slate-200 flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="text-xl font-bold hover:opacity-80 transition-opacity heading-gradient"
          >
            AI 阅读
          </Link>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'files'
              ? 'text-brand border-b-2 border-brand'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          文件
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'search'
              ? 'text-brand border-b-2 border-brand'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          搜索
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'tags'
              ? 'text-brand border-b-2 border-brand'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          标签
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'files' && (
          <div className="p-2">
            {/* Toolbar */}
            <div className="flex gap-2 mb-2 px-2">
              <button
                onClick={expandAll}
                className="text-xs text-slate-600 hover:text-brand"
                title="展开全部"
              >
                展开全部
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={collapseAll}
                className="text-xs text-slate-600 hover:text-brand"
                title="折叠全部"
              >
                折叠全部
              </button>
            </div>

            {/* File Tree */}
            <div className="space-y-1">
              {bookTree.map(node => renderTreeNode(node, ''))}
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="p-4">
            <input
              type="text"
              placeholder="搜索书籍、作者、标签..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            {searchKeyword && (
              <div className="mt-4 space-y-2">
                {searchResults.length > 0 ? (
                  <>
                    <div className="text-xs text-slate-500 px-2">
                      找到 {searchResults.length} 个结果
                    </div>
                    {searchResults.map(book => (
                      <Link
                        key={book.slug}
                        href={`/books/${book.slug}`}
                        onClick={onClose}
                        className="block p-2 hover:bg-slate-50 rounded transition-colors"
                      >
                        <div className="text-sm font-medium text-slate-900 mb-1 line-clamp-1">
                          {book.title}
                        </div>
                        <div className="text-xs text-slate-600 line-clamp-1">
                          {book.author}
                        </div>
                        <div className="text-xs text-brand mt-1">
                          {book.category}
                        </div>
                      </Link>
                    ))}
                  </>
                ) : (
                  <div className="text-sm text-slate-500 text-center py-8">
                    未找到匹配的书籍
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="p-4">
            {selectedTag ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-slate-900">
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
                      onClick={onClose}
                      className="block p-2 hover:bg-slate-50 rounded transition-colors"
                    >
                      <div className="text-sm font-medium text-slate-900 mb-1 line-clamp-1">
                        {book.title}
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-1">
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
                  <div className="text-sm text-slate-500 text-center py-8">
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
