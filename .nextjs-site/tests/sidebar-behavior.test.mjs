import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('sidebar book links do not close the desktop sidebar', () => {
  const sidebarSource = readFileSync(new URL('../components/Sidebar.tsx', import.meta.url), 'utf8');

  assert.doesNotMatch(
    sidebarSource,
    /<BookTree[\s\S]*?onBookClick=\{onClose\}[\s\S]*?\/>/,
    'The sidebar BookTree should not close the sidebar when a book link is clicked.',
  );

  const bookLinks = [...sidebarSource.matchAll(/<Link\b[\s\S]*?<\/Link>/g)].map(match => match[0]);
  const taggedLink = bookLinks.find(link => link.includes('book.slug'));
  assert.ok(taggedLink);
  assert.match(taggedLink, /if \(!docked\) onClose\(\)/, 'Only drawer navigation closes after selecting a tagged book.');
});
