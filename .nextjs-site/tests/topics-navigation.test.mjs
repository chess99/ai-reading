import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('topic reading is exposed as a first-level navigation entry', () => {
  const headerSource = readFileSync(new URL('../components/Header.tsx', import.meta.url), 'utf8');
  const bottomNavSource = readFileSync(new URL('../components/BottomNav.tsx', import.meta.url), 'utf8');

  assert.match(headerSource, /href:\s*'\/topics'/, 'Desktop header should link to /topics.');
  assert.match(headerSource, /label:\s*'主题'/, 'Desktop header should label the topics entry as 主题.');
  assert.match(bottomNavSource, /href:\s*'\/topics'/, 'Mobile bottom nav should link to /topics.');
  assert.match(bottomNavSource, /label:\s*'主题'/, 'Mobile bottom nav should label the topics entry as 主题.');
});
