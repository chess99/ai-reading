import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const miniprogramRoot = path.join(repoRoot, 'miniprogram');
const appJsonPath = path.join(miniprogramRoot, 'app.json');
const catalogPath = path.join(miniprogramRoot, 'data', 'catalog.json');

test('miniprogram app uses a fixed shell page set instead of one page per book', () => {
  assert.equal(existsSync(appJsonPath), true, 'miniprogram/app.json should exist');

  const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8'));
  assert.deepEqual(appJson.pages, [
    'pages/home/index',
    'pages/search/index',
    'pages/library/index',
    'pages/webview/index',
    'pages/settings/index',
  ]);

  assert.equal(
    appJson.pages.some(page => page.startsWith('pages/books/') || page.includes('[slug]')),
    false,
    'app.json should not enumerate individual book pages'
  );
});

test('miniprogram catalog build creates lightweight webview entries', () => {
  execFileSync(process.execPath, ['miniprogram/scripts/build-catalog.mjs'], {
    cwd: repoRoot,
    stdio: 'pipe',
  });

  assert.equal(existsSync(catalogPath), true, 'catalog builder should write miniprogram/data/catalog.json');

  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  assert.equal(Array.isArray(catalog.books), true, 'catalog.books should be an array');
  assert.equal(Array.isArray(catalog.topics), true, 'catalog.topics should be an array');
  assert.ok(catalog.books.length > 300, 'catalog should include the existing book library');
  assert.ok(catalog.topics.length > 50, 'catalog should include the existing topic library');

  const sampleBook = catalog.books[0];
  assert.deepEqual(Object.keys(sampleBook).sort(), ['author', 'category', 'slug', 'tags', 'title', 'url'].sort());
  assert.match(sampleBook.url, /^https:\/\/read\.cearl\.cc\/books\/[^/]+\/\?miniapp=1$/);
  assert.equal('content' in sampleBook, false, 'catalog entries should not include markdown body content');

  const sampleTopic = catalog.topics[0];
  assert.deepEqual(
    Object.keys(sampleTopic).sort(),
    ['bookCount', 'description', 'slug', 'tags', 'title', 'url'].sort()
  );
  assert.match(sampleTopic.url, /^https:\/\/read\.cearl\.cc\/topics\/[^/]+\/\?miniapp=1$/);
  assert.equal('content' in sampleTopic, false, 'catalog entries should not include topic body content');
});
