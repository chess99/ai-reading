export interface ReadingState {
  bookSlug: string;
  bookTitle: string;
  bookAuthor: string;
  timestamp: number;
}

const STORAGE_KEY = 'reading-state-last-book';

export function saveReadingState(state: ReadingState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save reading state:', error);
  }
}

export function getReadingState(): ReadingState | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as ReadingState;
  } catch (error) {
    console.error('Failed to load reading state:', error);
    return null;
  }
}

export function clearReadingState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear reading state:', error);
  }
}
