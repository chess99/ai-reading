'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ReadingEvents } from '@/lib/analytics';
import ModalPanel from '@/components/ModalPanel';

interface TocItem { id: string; text: string; level: number; }
interface TableOfContentsProps { isOpen: boolean; onClose: () => void; contentKey: string; }

function getScrollContainer(): HTMLElement | Window {
  return document.querySelector<HTMLElement>('main.overflow-auto') ?? window;
}
function isWindow(container: HTMLElement | Window): container is Window { return container === window; }
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export default function TableOfContents({ isOpen, onClose, contentKey }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[] | null>(null);
  const [activeId, setActiveId] = useState('');
  const pathname = usePathname();
  const inlineRef = useRef<HTMLElement>(null);
  const inlineScrollRef = useRef<HTMLDivElement>(null);
  const drawerScrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const headings = [...document.querySelectorAll<HTMLElement>('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4')];
    const items = headings.map((heading, index) => {
      if (!heading.id) heading.id = `heading-${index}`;
      return { id: heading.id, text: heading.textContent ?? '', level: Number(heading.tagName[1]) };
    });
    setToc(items);
    const scrollContainer = getScrollContainer();
    const update = () => {
      const top = isWindow(scrollContainer) ? 0 : scrollContainer.getBoundingClientRect().top;
      let current = headings[0]?.id ?? '';
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > top + 32) break;
        current = heading.id;
      }
      setActiveId(current);
    };
    let frame = 0;
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      scrollContainer.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [contentKey]);

  useEffect(() => {
    for (const container of [inlineScrollRef.current, drawerScrollRef.current]) {
      if (!container || !container.clientHeight) continue;
      const button = [...container.querySelectorAll<HTMLElement>('[data-toc-id]')].find(item => item.dataset.tocId === activeId);
      if (!button) continue;
      const bounds = container.getBoundingClientRect();
      const item = button.getBoundingClientRect();
      if (item.top < bounds.top) container.scrollTop += item.top - bounds.top - 8;
      else if (item.bottom > bounds.bottom) container.scrollTop += item.bottom - bounds.bottom + 8;
    }
  }, [activeId, isOpen, toc]);

  useEffect(() => {
    if (!isOpen) return;
    const main = document.querySelector('main.overflow-auto');
    if (!main) return;
    const observer = new ResizeObserver(() => {
      if (inlineRef.current && getComputedStyle(inlineRef.current).display !== 'none') closeRef.current();
    });
    observer.observe(main);
    return () => observer.disconnect();
  }, [isOpen]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const scrollContainer = getScrollContainer();
    if (isWindow(scrollContainer)) {
      window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - 24, behavior: scrollBehavior() });
    } else {
      const targetScroll = scrollContainer.scrollTop + element.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top - 24;
      scrollContainer.scrollTo({ top: targetScroll, behavior: scrollBehavior() });
    }
    history.replaceState(history.state, '', `#${encodeURIComponent(id)}`);
    setActiveId(id);
    ReadingEvents.trackChapterChange(pathname.split('/').filter(Boolean).pop() ?? '', element.textContent ?? id);
    onClose();
  };

  const navigation = <nav aria-label="章节">
    {toc === null ? <p className="px-3 py-6 text-sm text-stone-500">正在加载目录...</p> : toc.length ? <ul className="space-y-1">
      {toc.map(item => <li key={item.id}>
        <button
          onClick={() => handleClick(item.id)}
          data-toc-id={item.id}
          aria-current={activeId === item.id ? 'location' : undefined}
          className={`toc-item ${activeId === item.id ? 'toc-item-active' : ''}`}
          style={{ paddingLeft: `${12 + Math.max(0, item.level - 2) * 14}px` }}
        >
          <span className={activeId === item.id ? '' : 'line-clamp-2'}>{item.text}</span>
        </button>
      </li>)}
    </ul> : <p className="px-3 py-6 text-sm text-stone-500">这篇内容没有分节标题。</p>}
  </nav>;
  const topButton = <button className="min-h-11 w-full rounded-md border border-stone-200 px-3 text-sm font-semibold text-stone-600 hover:bg-stone-100" onClick={() => {
    getScrollContainer().scrollTo({ top: 0, behavior: scrollBehavior() });
    history.replaceState(history.state, '', `${window.location.pathname}${window.location.search}`);
    onClose();
  }}>回到正文顶部 ↑</button>;

  return <>
    <aside ref={inlineRef} className="reader-toc-inline" aria-label="本书目录">
      <h2 className="mb-4 border-b border-stone-200 pb-3 text-sm font-black text-stone-950">目录</h2>
      <div ref={inlineScrollRef} className="toc-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2">{navigation}</div>
      <div className="mt-4">{topButton}</div>
    </aside>
    <ModalPanel id="book-toc-drawer" title="目录" isOpen={isOpen} onClose={onClose}>
      <div ref={drawerScrollRef} className="toc-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">{navigation}</div>
      <div className="border-t border-stone-200 p-4">{topButton}</div>
    </ModalPanel>
  </>;
}
