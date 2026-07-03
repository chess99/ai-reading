import fs from 'fs';
import path from 'path';

const WEREAD_LINKS_PATH = path.join(process.cwd(), 'data', 'weread-links.json');

interface WereadLinkEntry {
  status: 'found' | 'not_found';
  url?: string;
  checkedAt?: string;
  note?: string;
}

let cachedWereadLinks: Record<string, WereadLinkEntry> | null = null;

function loadWereadLinks(): Record<string, WereadLinkEntry> {
  if (cachedWereadLinks) {
    return cachedWereadLinks;
  }

  if (!fs.existsSync(WEREAD_LINKS_PATH)) {
    cachedWereadLinks = {};
    return cachedWereadLinks;
  }

  const raw = fs.readFileSync(WEREAD_LINKS_PATH, 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  cachedWereadLinks =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, WereadLinkEntry>)
      : {};
  return cachedWereadLinks;
}

export function getWereadUrlForBook(slug: string): string | null {
  const entry = loadWereadLinks()[slug];
  if (!entry || entry.status !== 'found') {
    return null;
  }

  return typeof entry.url === 'string' && entry.url.trim() ? entry.url : null;
}
