export interface ReadingState {
  bookSlug: string;
  bookTitle: string;
  bookAuthor: string;
  timestamp: number;
}

const HISTORY_KEY = 'reading-state-history';
const LEGACY_KEY = 'reading-state-last-book';
const MAX_HISTORY = 5;

/** 将当前书插入历史队首，去重，最多保留 MAX_HISTORY 条 */
export function saveToHistory(state: ReadingState): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getReadingHistory();
    const deduped = history.filter(s => s.bookSlug !== state.bookSlug);
    const next = [state, ...deduped].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Failed to save reading history:', error);
  }
}

/** 读取历史记录，index 0 为最近。首次调用时迁移旧格式数据。 */
export function getReadingHistory(): ReadingState[] {
  if (typeof window === 'undefined') return [];
  try {
    // 迁移旧 key
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const old = JSON.parse(legacy) as ReadingState;
      const existing = localStorage.getItem(HISTORY_KEY);
      if (!existing) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify([old]));
      }
      localStorage.removeItem(LEGACY_KEY);
    }

    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved) return [];
    return JSON.parse(saved) as ReadingState[];
  } catch (error) {
    console.error('Failed to load reading history:', error);
    return [];
  }
}

/** 清空历史（保留供将来 UI 使用） */
export function clearReadingHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear reading history:', error);
  }
}

// 保留旧导出以防其他地方引用
export const saveReadingState = saveToHistory;
export function getReadingState(): ReadingState | null {
  const h = getReadingHistory();
  return h[0] ?? null;
}
export const clearReadingState = clearReadingHistory;
