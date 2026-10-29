interface DatedBook {
  slug: string;
  addedAt: number;
}

export const RECENT_BOOK_DAYS: number;
export const RECENT_BOOK_FALLBACK_COUNT: number;

export function selectRecentBooks<T extends DatedBook>(books: readonly T[], now?: number): T[];
export function getNextBeijingMidnight(now: number): number;
