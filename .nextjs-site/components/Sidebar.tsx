'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookTreeNode, BookMeta } from '@/lib/books';

interface SidebarProps {
  bookTree: BookTreeNode[];
  allBooks: BookMeta[];
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'files' | 'search' | 'tags';

export default function Sidebar({ bookTree, allBooks, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<TabType>('files');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [autoReveal, setAutoReveal] = useState(true);

  // 从 localStorage 读取 auto-reveal 设置
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-auto-reveal');
    if (saved !== null) {
      setAutoReveal(saved === 'true');
    }
  }, []);

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

  // 查找当前打开的书籍及其路径
  const findCurrentBook = () => {
    if (!pathname.startsWith('/books/')) return null;

    const slug = pathname.replace('/books/', '').replace(/\/$/, '');
    const book = allBooks.find(b => b.slug === slug);
    if (!book) return null;

    // 构建该书籍的完整分类路径
    const categoryPaths: string[] = [];
    let pathSoFar = '';
    for (const categoryName of book.categoryPath) {
      pathSoFar = pathSoFar ? `${pathSoFar}/${categoryName}` : categoryName;
      categoryPaths.push(pathSoFar);
    }

    return { book, categoryPaths };
  };

  // Reveal active file: 展开到当前书籍
  const revealActiveFile = () => {
    const current = findCurrentBook();
    if (!current) return;

    // 展开所有父分类
    setExpandedCategories(new Set(current.categoryPaths));

    // 滚动到当前书籍（延迟一下等待 DOM 更新）
    setTimeout(() => {
      const activeLink = document.querySelector('.sidebar-link-active');
      if (activeLink) {
        activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Auto-reveal: 路径变化时自动展开
  useEffect(() => {
    if (autoReveal && pathname.startsWith('/books/')) {
      revealActiveFile();
    }
  }, [pathname, autoReveal]);

  // 保存 auto-reveal 设置到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-auto-reveal', String(autoReveal));
    }
  }, [autoReveal]);

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
      const isActive = pathname === node.path || pathname === node.path + '/';
      return (
        <Link
          key={node.path}
          href={node.path}
          onClick={onClose}
          className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
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
            <div className="flex items-center gap-2 mb-2 px-2">
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

              {/* Icon buttons */}
              <div className="ml-auto flex items-center gap-1">
                {/* Auto-reveal toggle */}
                <button
                  onClick={() => setAutoReveal(!autoReveal)}
                  className={`p-1.5 rounded hover:bg-slate-100 transition-colors cursor-pointer ${
                    autoReveal ? 'text-brand' : 'text-slate-400'
                  }`}
                  title="自动定位当前文件"
                  aria-label="自动定位当前文件"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                    <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2" />
                    <line x1="3" y1="15" x2="21" y2="15" strokeWidth="2" />
                  </svg>
                </button>

                {/* Reveal active file */}
                <button
                  onClick={revealActiveFile}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-brand transition-colors cursor-pointer"
                  title="定位到当前文件"
                  aria-label="定位到当前文件"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </button>
              </div>
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
