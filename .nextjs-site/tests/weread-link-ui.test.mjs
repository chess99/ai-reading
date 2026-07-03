import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const siteRoot = path.resolve(import.meta.dirname, '..');

test('book page renders a clean WeRead external-link action when URL exists', () => {
  const source = readFileSync(path.join(siteRoot, 'app/books/[slug]/page-client.tsx'), 'utf8');

  assert.match(source, /wereadUrl\?: string \| null/, 'BookPageClient should accept an optional wereadUrl prop');
  assert.match(source, /微信读书看原书/, 'button label should match the approved copy');
  assert.match(source, /target="_blank"/, 'WeRead link should open in a new tab');
  assert.match(source, /rel="noopener noreferrer"/, 'WeRead link should use safe external-link rel');
  assert.doesNotMatch(source, /跳转到正版阅读平台/, 'WeRead action should not include explanatory platform copy');
});
