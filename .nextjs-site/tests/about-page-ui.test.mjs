import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('about page introduces the original-book boundary before usage guidance', () => {
  const aboutSource = readFileSync(new URL('../app/about/page.tsx', import.meta.url), 'utf8');
  const relationshipIndex = aboutSource.indexOf('与原书的关系');
  const useCaseIndex = aboutSource.indexOf('你可以这样用');

  assert.notEqual(relationshipIndex, -1, 'About page should explain its relationship to the original books.');
  assert.notEqual(useCaseIndex, -1, 'About page should include usage guidance.');
  assert.ok(
    relationshipIndex < useCaseIndex,
    'Original-book boundary should appear before usage guidance because it defines the page promise.',
  );
});

test('about page stays focused on content positioning instead of operations', () => {
  const aboutSource = readFileSync(new URL('../app/about/page.tsx', import.meta.url), 'utf8');

  assert.doesNotMatch(aboutSource, /反馈与申请书籍/, 'About should not duplicate operational feedback entry points.');
  assert.doesNotMatch(aboutSource, /申请加入书库/, 'Book requests belong in settings, not about.');
  assert.doesNotMatch(aboutSource, /搜索书库/, 'Search navigation belongs in product navigation, not about.');
});
