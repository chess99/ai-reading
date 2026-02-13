'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookTreeNode } from '@/lib/books';

interface SidebarProps {
  bookTree: BookTreeNode[];
}

type TabType = 'files' | 'search' | 'tags';

export default function Sidebar({ bookTree }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('files');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchKeyword, setSearchKeyword] = useState('');

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAll = () => {
    const allCategories = new Set(bookTree.map(node => node.name));
    setExpandedCategories(allCategories);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
          AI Reading
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'files'
              ? 'text-brand border-b-2 border-brand'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          文件
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'search'
              ? 'text-brand border-b-2 border-brand'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          搜索
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'tags'
              ? 'text-brand border-b-2 border-brand'
              : 'text-gray-600 hover:text-gray-900'
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
                className="text-xs text-gray-600 hover:text-brand"
                title="展开全部"
              >
                展开全部
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={collapseAll}
                className="text-xs text-gray-600 hover:text-brand"
                title="折叠全部"
              >
                折叠全部
              </button>
            </div>

            {/* File Tree */}
            <div className="space-y-1">
              {bookTree.map(category => (
                <div key={category.name}>
                  {/* Category */}
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 rounded transition-colors"
                  >
                    <span className="text-gray-500 text-xs">
                      {expandedCategories.has(category.name) ? '▼' : '▶'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {category.name}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">
                      {category.children?.length || 0}
                    </span>
                  </button>

                  {/* Books */}
                  {expandedCategories.has(category.name) && (
                    <div className="ml-4 space-y-0.5">
                      {category.children?.map(book => (
                        <Link
                          key={book.path}
                          href={book.path}
                          className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-brand/10 hover:text-brand rounded transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-gray-400 mt-0.5">
                              📖
                            </span>
                            <span className="flex-1 line-clamp-2">
                              {book.name}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            <div className="mt-4 text-sm text-gray-500">
              {searchKeyword
                ? `搜索功能将在下一步实现`
                : '输入关键词搜索书籍'}
            </div>
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="p-4">
            <div className="text-sm text-gray-500">标签功能将在下一步实现</div>
          </div>
        )}
      </div>
    </div>
  );
}
