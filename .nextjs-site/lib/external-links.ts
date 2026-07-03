import fs from 'fs';
import path from 'path';

const WEREAD_LINKS_PATH = path.join(process.cwd(), 'data', 'weread-links.json');

let cachedWereadLinks: Record<string, string> | null = null;

function loadWereadLinks(): Record<string, string> {
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
      ? (parsed as Record<string, string>)
      : {};
  return cachedWereadLinks;
}

export function getWereadUrlForBook(slug: string): string | null {
  const url = loadWereadLinks()[slug];
  return typeof url === 'string' && url.trim() ? url : null;
}
