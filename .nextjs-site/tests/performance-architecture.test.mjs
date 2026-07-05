import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const layoutSource = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
const layoutClientSource = readFileSync(new URL('../app/layout-client.tsx', import.meta.url), 'utf8');
const settingsContentSource = readFileSync(new URL('../components/SettingsContent.tsx', import.meta.url), 'utf8');
const sidebarSource = readFileSync(new URL('../components/Sidebar.tsx', import.meta.url), 'utf8');
const bookPageClientSource = readFileSync(new URL('../app/books/[slug]/page-client.tsx', import.meta.url), 'utf8');
const bookPageSource = readFileSync(new URL('../app/books/[slug]/page.tsx', import.meta.url), 'utf8');

test('root app shell does not serialize the whole library into every page', () => {
  assert.doesNotMatch(layoutSource, /buildBookTree|getAllBookMetas|getAllTopicMetas/);
  assert.doesNotMatch(layoutSource, /<LayoutClient[^>]*(bookTree|allBooks|allTopics)=/s);
  assert.doesNotMatch(layoutClientSource, /bookTree|allBooks|allTopics/);
});

test('offline settings loads the book list from the static build manifest on demand', () => {
  assert.match(settingsContentSource, /fetch\(['"]\/build-manifest\.json['"]\)/);
  assert.doesNotMatch(settingsContentSource, /allBooks\s*:/);
  assert.doesNotMatch(settingsContentSource, /allBooks\.map/);
});

test('desktop sidebar retries library tree loading after media query state resolves', () => {
  assert.match(sidebarSource, /window\.matchMedia\('\(min-width:\s*768px\)'\)/);
  assert.match(sidebarSource, /fetch\(['"]\/library-tree\.json['"]\)/);
  assert.match(sidebarSource, /\},\s*\[isOpen,\s*isDesktop,\s*bookTree\]\)/);
});

test('book page keeps markdown rendering out of the client bundle', () => {
  assert.doesNotMatch(bookPageClientSource, /react-markdown|remark-gfm|remark-math|rehype-/);
  assert.match(bookPageClientSource, /children:\s*React\.ReactNode/);
  assert.match(bookPageSource, /ReactMarkdown/);
  assert.match(bookPageSource, /<BookPageClient[\s\S]*<ReactMarkdown/);
});
