'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SearchHighlights() {
  const pathname = usePathname();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('highlight')?.trim();
    if (!query) return;
    const content = document.querySelector('[data-search-content]');
    if (!content) return;

    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode: node => node.parentElement?.closest('script, style')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    let text = '';
    let previousBlock: Element | null = null;
    const positions = nodes.map(node => {
      const block = node.parentElement?.closest('p, li, h1, h2, h3, h4, h5, h6, td, th, pre') ?? null;
      if (previousBlock && previousBlock !== block) text += '\n';
      previousBlock = block;
      const start = text.length;
      text += node.data;
      return { node, start, end: text.length };
    });
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let matches = [...text.matchAll(new RegExp(escaped, 'giu'))];
    if (!matches.length) {
      const terms = typeof Intl.Segmenter === 'function'
        ? [...new Intl.Segmenter('zh-CN', { granularity: 'word' }).segment(query)]
          .filter(part => part.isWordLike).map(part => part.segment)
        : query.split(/\s+/);
      const pattern = [...new Set(terms)].sort((a, b) => b.length - a.length)
        .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      if (pattern) matches = [...text.matchAll(new RegExp(pattern, 'giu'))];
    }

    const ranges: Range[] = [];
    for (const match of matches) {
      const end = match.index + match[0].length;
      const from = positions.find(position => position.end > match.index);
      const to = positions.find(position => position.end >= end);
      if (!from || !to) continue;
      const range = document.createRange();
      range.setStart(from.node, match.index - from.start);
      range.setEnd(to.node, end - to.start);
      ranges.push(range);
    }
    // CSS ranges preserve the server-rendered markup, including matches split
    // across emphasis and links, without mutating React's text nodes.
    if (CSS.highlights && typeof Highlight !== 'undefined') {
      CSS.highlights.set('search-match', new Highlight(...ranges));
    }

    let anchor: HTMLElement | null = null;
    try { anchor = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); } catch { /* Invalid URL fragment. */ }
    const first = ranges.find(range => !anchor || anchor.contains(range.startContainer) ||
      Boolean(anchor.compareDocumentPosition(range.startContainer) & Node.DOCUMENT_POSITION_FOLLOWING));
    const frame = requestAnimationFrame(() => {
      if (!first) return;
      const main = document.querySelector<HTMLElement>('main.overflow-auto');
      // 主动更新后的阅读进度优先于最初的搜索命中位置，仍保留高亮。
      if (main?.dataset.readingPositionRestored === 'true') return;
      const top = first.getBoundingClientRect().top;
      if (main) main.scrollTo({ top: main.scrollTop + top - main.getBoundingClientRect().top - main.clientHeight / 3 });
      else window.scrollTo({ top: window.scrollY + top - window.innerHeight / 3 });
    });
    return () => {
      cancelAnimationFrame(frame);
      CSS.highlights?.delete('search-match');
    };
  }, [pathname]);

  return <style>{'::highlight(search-match) { background-color: #fde68a; color: #292524; }'}</style>;
}
