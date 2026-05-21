'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookTreeNode, BookMeta } from '@/lib/books';

interface BookTreeProps {
  bookTree: BookTreeNode[];
  allBooks: BookMeta[];
  onBookClick?: () => void;
  showFilterInput?: boolean;
}

export default function BookTree({ bookTree, allBooks, onBookClick, showFilterInput = false }: BookTreeProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [filterKeyword, setFilterKeyword] = useState('');
  const [autoReveal, setAutoReveal] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-auto-reveal');
    if (saved !== null) setAutoReveal(saved === 'true');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-auto-reveal', String(autoReveal));
    }
  }, [autoReveal]);

  const filteredTree = useMemo(() => {
    if (!filterKeyword.trim()) return bookTree;
    const kw = filterKeyword.toLowerCase();

    function filterNodes(nodes: BookTreeNode[]): BookTreeNode[] {
      return nodes
        .map(node => {
          if (node.type === 'book') {
            const matches =
              node.book!.title.toLowerCase().includes(kw) ||
              node.book!.author.toLowerCase().includes(kw);
            return matches ? node : null;
          }
          const filteredChildren = filterNodes(node.children ?? []);
          if (filteredChildren.length === 0) return null;
          return { ...node, children: filteredChildren };
        })
        .filter((n): n is BookTreeNode => n !== null);
    }

    return filterNodes(bookTree);
  }, [bookTree, filterKeyword]);

  useEffect(() => {
    if (!filterKeyword.trim()) return;
    const paths: string[] = [];
    function collectPaths(nodes: BookTreeNode[], prefix = '') {
      nodes.forEach(n => {
        if (n.type === 'category') {
          const p = prefix ? `${prefix}/${n.name}` : n.name;
          paths.push(p);
          collectPaths(n.children ?? [], p);
        }
      });
    }
    collectPaths(filteredTree);
    setExpandedCategories(new Set(paths));
  }, [filteredTree, filterKeyword]);

  const getAllCategoryPaths = (nodes: BookTreeNode[], prefix = ''): string[] => {
    const paths: string[] = [];
    nodes.forEach(node => {
      if (node.type === 'category') {
        const p = prefix ? `${prefix}/${node.name}` : node.name;
        paths.push(p);
        if (node.children) paths.push(...getAllCategoryPaths(node.children, p));
      }
    });
    return paths;
  };

  const expandAll = () => setExpandedCategories(new Set(getAllCategoryPaths(bookTree)));
  const collapseAll = () => setExpandedCategories(new Set());

  const findCurrentBook = () => {
    if (!pathname.startsWith('/books/')) return null;
    const slug = pathname.replace('/books/', '').replace(/\/$/, '');
    const book = allBooks.find(b => b.slug === slug);
    if (!book) return null;
    const categoryPaths: string[] = [];
    let pathSoFar = '';
    for (const cat of book.categoryPath) {
      pathSoFar = pathSoFar ? `${pathSoFar}/${cat}` : cat;
      categoryPaths.push(pathSoFar);
    }
    return { book, categoryPaths };
  };

  const revealActiveFile = () => {
    const current = findCurrentBook();
    if (!current) return;
    setExpandedCategories(new Set(current.categoryPaths));
    setTimeout(() => {
      const activeLink = document.querySelector('.sidebar-link-active');
      if (activeLink) activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  useEffect(() => {
    if (autoReveal && pathname.startsWith('/books/')) revealActiveFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, autoReveal]);

  const toggleCategory = (categoryPath: string) => {
    const next = new Set(expandedCategories);
    if (next.has(categoryPath)) next.delete(categoryPath);
    else next.add(categoryPath);
    setExpandedCategories(next);
  };

  const renderNode = (node: BookTreeNode, parentPath: string, level = 0): React.ReactNode => {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isExpanded = expandedCategories.has(currentPath);
    const indent = level * 12;

    if (node.type === 'category') {
      return (
        <div key={currentPath}>
          <button
            onClick={() => toggleCategory(currentPath)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-slate-100 rounded transition-colors"
            style={{ paddingLeft: `${8 + indent}px` }}
          >
            <span className="text-slate-500 text-xs">{isExpanded ? '▼' : '▶'}</span>
            <span className="font-medium text-slate-900">{node.name}</span>
            <span className="ml-auto text-xs text-slate-400">{node.children?.length ?? 0}</span>
          </button>
          {isExpanded && node.children && (
            <div className="space-y-0.5">
              {node.children.map(child => renderNode(child, currentPath, level + 1))}
            </div>
          )}
        </div>
      );
    }

    const isActive = pathname === node.path || pathname === node.path + '/';
    return (
      <Link
        key={node.path}
        href={node.path}
        onClick={onBookClick}
        className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
        style={{ paddingLeft: `${8 + indent + 16}px` }}
      >
        <div className="flex items-start gap-2">
          <span className="text-xs text-slate-400 mt-0.5">📖</span>
          <span className="flex-1 line-clamp-2">{node.name}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {showFilterInput && (
        <div className="px-3 py-2 border-b border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={filterKeyword}
              onChange={e => setFilterKeyword(e.target.value)}
              placeholder="搜索书名、作者..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-slate-50"
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {filterKeyword && (
              <button onClick={() => setFilterKeyword('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100">
        <button onClick={expandAll} className="text-xs text-slate-600 hover:text-brand">展开全部</button>
        <span className="text-gray-300">|</span>
        <button onClick={collapseAll} className="text-xs text-slate-600 hover:text-brand">折叠全部</button>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setAutoReveal(!autoReveal)}
            className={`p-1.5 rounded hover:bg-slate-100 transition-colors cursor-pointer ${autoReveal ? 'text-brand' : 'text-slate-400'}`}
            title="自动定位当前文件"
            aria-label="自动定位当前文件"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
              <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2" />
              <line x1="3" y1="15" x2="21" y2="15" strokeWidth="2" />
            </svg>
          </button>
          <button
            onClick={revealActiveFile}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-brand transition-colors cursor-pointer"
            title="定位到当前文件"
            aria-label="定位到当前文件"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-1">
        {filteredTree.length > 0
          ? filteredTree.map(node => renderNode(node, ''))
          : <p className="text-sm text-slate-400 text-center py-8">没有匹配的书籍</p>
        }
      </div>
    </div>
  );
}
