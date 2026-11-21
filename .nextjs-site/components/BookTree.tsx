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
  const metadataBySlug = useMemo(() => new Map(allBooks.map(book => [book.slug, book])), [allBooks]);

  const filteredTree = useMemo(() => {
    if (!filterKeyword.trim()) return bookTree;
    const kw = filterKeyword.trim().toLowerCase();

    function filterNodes(nodes: BookTreeNode[]): BookTreeNode[] {
      return nodes
        .map(node => {
          if (node.type === 'book') {
            const metadata = node.book ?? metadataBySlug.get(node.path?.replace(/^\/books\//, '').replace(/\/$/, '') ?? '');
            const matches =
              node.name.toLowerCase().includes(kw) ||
              metadata?.title.toLowerCase().includes(kw) ||
              metadata?.author.toLowerCase().includes(kw);
            return matches ? node : null;
          }
          const filteredChildren = filterNodes(node.children ?? []);
          if (filteredChildren.length === 0) return null;
          return { ...node, children: filteredChildren };
        })
        .filter((n): n is BookTreeNode => n !== null);
    }

    return filterNodes(bookTree);
  }, [bookTree, filterKeyword, metadataBySlug]);

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

  // Metadata can arrive after the tree mounts, without a route change.
  useEffect(() => {
    if (!pathname.startsWith('/books/') || filterKeyword.trim()) return;
    const slug = pathname.replace('/books/', '').replace(/\/$/, '');
    const book = allBooks.find(b => b.slug === slug);
    if (!book) return;

    const categoryPaths: string[] = [];
    let pathSoFar = '';
    for (const cat of book.categoryPath) {
      pathSoFar = pathSoFar ? `${pathSoFar}/${cat}` : cat;
      categoryPaths.push(pathSoFar);
    }
    setExpandedCategories(new Set(categoryPaths));
    const scrollTimer = window.setTimeout(() => {
      const activeLink = document.querySelector('.sidebar-link-active');
      if (activeLink) activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    return () => window.clearTimeout(scrollTimer);
  }, [pathname, allBooks, filterKeyword]);

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
            aria-expanded={isExpanded}
            className="book-tree-category w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-stone-100 rounded-md transition-colors"
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
        prefetch={false}
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
        <div className="book-tree-filter px-3 py-2">
          <div className="relative">
            <input
              type="text"
              value={filterKeyword}
              onChange={e => setFilterKeyword(e.target.value)}
              aria-label="筛选书库"
              placeholder="搜索书名或作者"
              className="input-brand pe-11"
            />
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            {filterKeyword && (
              <button onClick={() => setFilterKeyword('')} className="touch-icon absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600" aria-label="清除筛选">
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="book-tree-tools flex items-center gap-2 px-3 py-1 border-b border-stone-200">
        <button onClick={expandAll} className="min-h-11 px-1 text-xs font-medium text-stone-600 hover:text-brand">展开全部</button>
        <span className="text-stone-300">/</span>
        <button onClick={collapseAll} className="min-h-11 px-1 text-xs font-medium text-stone-600 hover:text-brand">折叠全部</button>
      </div>

      <div className="book-tree-list flex-1 overflow-auto p-2 space-y-1">
        {filteredTree.length > 0
          ? filteredTree.map(node => renderNode(node, ''))
          : <p className="text-sm text-stone-400 text-center py-8">没有匹配的书籍</p>
        }
      </div>
    </div>
  );
}
