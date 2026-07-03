'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ReadingEvents } from '@/lib/analytics';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TableOfContents({ isOpen, onClose }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    // 提取文章中的标题
    const content = document.querySelector('.markdown-content');
    if (!content) return;

    const headings = content.querySelectorAll('h1, h2, h3, h4');
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';

      // 为标题添加 id(如果没有的话)
      let id = heading.id;
      if (!id) {
        // 使用标题文本生成更有意义的 id
        id = text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\u4e00-\u9fa5-]/g, '')
          .substring(0, 50) || `heading-${index}`;
        heading.id = id;
      }

      items.push({ id, text, level });
    });

    setToc(items);
  }, []);

  useEffect(() => {
    if (toc.length === 0) return;

    // 监听滚动,高亮当前章节
    const handleScroll = () => {
      const headings = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4');
      const scrollTop = window.scrollY;
      const scrollPosition = scrollTop + 120; // 偏移量

      let currentId = '';

      // 找到当前滚动位置对应的标题
      headings.forEach((heading) => {
        const element = heading as HTMLElement;
        const elementRect = element.getBoundingClientRect();
        const elementTop = scrollTop + elementRect.top;

        // 如果标题在视口上方或刚好在视口内,就认为是当前章节
        if (elementTop <= scrollPosition) {
          currentId = element.id;
        }
      });

      // 如果没有找到(页面顶部),使用第一个标题
      if (!currentId && headings.length > 0) {
        currentId = (headings[0] as HTMLElement).id;
      }

      setActiveId(currentId);
    };

    // 使用 requestAnimationFrame 优化性能
    let rafId: number;
    const throttledScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    handleScroll(); // 初始化

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [toc]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80; // 头部高度
      const top = element.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });

      // 更新 URL hash(可选,便于分享)
      if (history.pushState) {
        history.pushState(null, '', `#${id}`);
      }

      // 追踪章节切换事件
      const bookSlug = pathname.split('/').pop() || '';
      const chapterTitle = element.textContent || id;
      ReadingEvents.trackChapterChange(bookSlug, chapterTitle);

      // 移动端点击后关闭抽屉
      if (window.innerWidth < 1024) {
        setTimeout(() => onClose(), 300); // 延迟关闭,让用户看到滚动效果
      }
    }
  };

  if (toc.length === 0) {
    return null;
  }

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* 大纲容器 */}
      <aside
        className={`
          fixed lg:relative top-0 lg:top-0 right-0 h-screen lg:h-auto
          w-80 lg:w-full
          bg-[#fffdf8] lg:bg-transparent
          border-l lg:border-l-0 border-stone-200
          transition-transform duration-300 ease-in-out
          z-50 lg:z-0
          ${isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
          lg:shadow-none
        `}
      >
        <div className="h-full overflow-y-auto p-6 lg:p-0 lg:max-h-[calc(100vh-8rem)]">
          {/* 移动端标题栏 */}
          <div className="flex items-center justify-between mb-6 lg:hidden pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-brand"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
              <h2 className="text-lg font-bold text-stone-950">目录</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="关闭目录"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 桌面端标题 */}
          <div className="hidden lg:flex items-center gap-2 mb-4 pb-3 border-b border-stone-200">
            <svg
              className="w-4 h-4 text-brand"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
            <h2 className="text-sm font-black text-stone-950 tracking-wide">
              目录
            </h2>
          </div>

          {/* 目录列表 */}
          <nav className="mb-6">
            <ul className="space-y-0.5">
              {toc.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleClick(item.id)}
                    className={`
                      w-full text-left px-3 py-2.5 rounded-md
                      transition-all duration-200
                      ${item.level === 1 ? 'text-sm font-semibold' : 'text-sm'}
                      ${item.level === 2 ? 'pl-3' : ''}
                      ${item.level === 3 ? 'pl-6 text-xs' : ''}
                      ${item.level === 4 ? 'pl-9 text-xs' : ''}
                      ${
                        activeId === item.id
                          ? 'bg-brand/10 text-brand font-semibold border-l-3 border-brand shadow-sm'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50/80 border-l-3 border-transparent'
                      }
                    `}
                  >
                    <span className="line-clamp-2 leading-snug">{item.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* 返回顶部按钮 */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              if (window.innerWidth < 1024) {
                onClose();
              }
            }}
            className="w-full px-4 py-2.5 text-sm font-medium text-stone-600 hover:text-brand hover:bg-stone-50 rounded-lg transition-all border border-stone-200 hover:border-brand/30 flex items-center justify-center gap-2 group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            返回顶部
          </button>
        </div>
      </aside>
    </>
  );
}
