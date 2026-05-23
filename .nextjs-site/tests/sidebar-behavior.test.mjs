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

  assert.doesNotMatch(
    sidebarSource,
    /href=\{`\/books\/\$\{book\.slug\}`\}[\s\S]*?onClick=\{onClose\}/,
    'Tagged book links in the sidebar should not close the sidebar when clicked.',
  );
});
