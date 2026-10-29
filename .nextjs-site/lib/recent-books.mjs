const DAY_MS = 24 * 60 * 60 * 1000;
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

export const RECENT_BOOK_DAYS = 30;
export const RECENT_BOOK_FALLBACK_COUNT = 8;

function beijingDay(timestamp) {
  return Math.floor((timestamp + BEIJING_OFFSET_MS) / DAY_MS);
}

export function selectRecentBooks(books, now = Date.now()) {
  const today = beijingDay(now);
  const earliestDay = today - RECENT_BOOK_DAYS + 1;
  const availableBooks = books
    .filter(book => Number.isFinite(book.addedAt) && beijingDay(book.addedAt) <= today)
    .sort((a, b) => b.addedAt - a.addedAt || a.slug.localeCompare(b.slug));
  const recentBooks = availableBooks.filter(book => beijingDay(book.addedAt) >= earliestDay);

  return recentBooks.length > 0
    ? recentBooks
    : availableBooks.slice(0, RECENT_BOOK_FALLBACK_COUNT);
}

export function getNextBeijingMidnight(now) {
  return (beijingDay(now) + 1) * DAY_MS - BEIJING_OFFSET_MS;
}
