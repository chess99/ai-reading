'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookTreeNode, BookMeta } from '@/lib/books';
import { BookIcon, ChevronRightIcon, CloseIcon, SearchIcon } from '@/components/Icons';

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
    if (pathname.startsWith('/books/')) revealActiveFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-stone-100 rounded-md transition-colors"
            style={{ paddingLeft: `${8 + indent}px` }}
          >
            <ChevronRightIcon className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            <span className="font-semibold text-stone-900">{node.name}</span>
            <span className="ml-auto text-xs text-stone-400 tabular-nums">{node.children?.length ?? 0}</span>
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
          <BookIcon className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
          <span className="flex-1 line-clamp-2">{node.name}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {showFilterInput && (
        <div className="px-3 py-2 border-b border-stone-100">
          <div className="relative">
            <input
              type="text"
              value={filterKeyword}
              onChange={e => setFilterKeyword(e.target.value)}
              placeholder="搜索书名、作者..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-brand/15 focus:border-brand/50 bg-[#fffdf8]"
          />
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            {filterKeyword && (
              <button onClick={() => setFilterKeyword('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600" aria-label="清除筛选">
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 px-4 py-2 border-b border-stone-100">
        <button onClick={expandAll} className="text-xs font-medium text-stone-600 hover:text-brand">展开全部</button>
        <span className="text-stone-300">/</span>
        <button onClick={collapseAll} className="text-xs font-medium text-stone-600 hover:text-brand">折叠全部</button>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-1">
        {filteredTree.length > 0
          ? filteredTree.map(node => renderNode(node, ''))
          : <p className="text-sm text-stone-400 text-center py-8">没有匹配的书籍</p>
        }
      </div>
    </div>
  );
}
