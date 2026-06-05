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
