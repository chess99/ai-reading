const STORAGE_KEY = 'ai-reading:reload-position';
const BLOCK_SELECTOR = 'article h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6, .markdown-content p, .markdown-content li, .markdown-content pre, .markdown-content table';

export interface ReadingPosition {
  text: string;
  index: number;
  heading: string;
  ratio: number;
  viewportOffset: number;
  scrollTop: number;
}

function blocks(main: HTMLElement): HTMLElement[] {
  return Array.from(main.querySelectorAll<HTMLElement>(BLOCK_SELECTOR))
    .filter(element => element.getBoundingClientRect().height > 0 &&
      !(element.tagName === 'LI' && element.querySelector('p, li')));
}

function textOf(element: HTMLElement): string {
  return (element.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 200);
}

export function captureReadingPosition(main: HTMLElement): ReadingPosition {
  const candidates = blocks(main);
  const viewportOffset = Math.min(48, main.clientHeight / 5);
  const line = main.getBoundingClientRect().top + viewportOffset;
  let index = candidates.findIndex(element => element.getBoundingClientRect().bottom > line);
  if (index < 0) index = candidates.length - 1;
  const element = candidates[index];
  const rect = element?.getBoundingClientRect();
  const heading = candidates.slice(0, index + 1).reverse().find(item => /^H[1-6]$/.test(item.tagName));
  return {
    text: element ? textOf(element) : '',
    index,
    heading: heading ? textOf(heading) : '',
    ratio: rect ? Math.max(0, Math.min(1, (line - rect.top) / rect.height)) : 0,
    // 空白间距也保留，避免段落尚在下方时被拉到视口顶部。
    viewportOffset: rect && rect.top > line ? rect.top - main.getBoundingClientRect().top : viewportOffset,
    scrollTop: main.scrollTop,
  };
}

export function restoreReadingPosition(main: HTMLElement, position: ReadingPosition): void {
  const candidates = blocks(main);
  const matches = candidates.map((element, index) => ({ element, index }))
    .filter(({ element }) => textOf(element) === position.text);
  matches.sort((a, b) => Math.abs(a.index - position.index) - Math.abs(b.index - position.index));
  const exact = position.text ? matches[0]?.element : undefined;
  const headings = candidates.map((element, index) => ({ element, index }))
    .filter(({ element }) => /^H[1-6]$/.test(element.tagName) && textOf(element) === position.heading);
  headings.sort((a, b) => Math.abs(a.index - position.index) - Math.abs(b.index - position.index));
  const heading = position.heading ? headings[0]?.element : undefined;
  const target = exact ?? heading;
  if (!target) {
    main.scrollTo({ top: position.scrollTop, behavior: 'instant' });
    return;
  }
  const top = target.getBoundingClientRect().top - main.getBoundingClientRect().top;
  main.scrollTo({
    top: main.scrollTop + top + (exact ? position.ratio * target.getBoundingClientRect().height : 0)
      - Math.min(position.viewportOffset, main.clientHeight / 3),
    behavior: 'instant',
  });
}

export function savePositionForReload(): void {
  const main = document.querySelector<HTMLElement>('main.overflow-auto');
  if (!main) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      pathname: window.location.pathname.replace(/\/$/, '') || '/',
      savedAt: Date.now(),
      position: captureReadingPosition(main),
    }));
  } catch { /* 无法持久化时仍允许正常刷新。 */ }
}

export function takeReloadPosition(pathname: string): ReadingPosition | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    const data = JSON.parse(saved);
    if (data.pathname === (pathname.replace(/\/$/, '') || '/') && Date.now() - data.savedAt < 600_000 &&
      Number.isFinite(data.position?.scrollTop) && Number.isFinite(data.position?.ratio)) {
      return data.position;
    }
  } catch { /* 忽略不可用或损坏的会话存储。 */ }
  return null;
}
