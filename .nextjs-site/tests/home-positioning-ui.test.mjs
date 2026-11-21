import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const homeSource = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const layoutSource = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
const librarySource = readFileSync(new URL('../app/library/page.tsx', import.meta.url), 'utf8');
const introSource = readFileSync(new URL('../components/HomeIntro.tsx', import.meta.url), 'utf8');
const brandSource = readFileSync(new URL('../lib/brand.ts', import.meta.url), 'utf8');
const verificationSource = readFileSync(
  new URL('../public/baidu_verify_codeva-szqh50c7hX.html', import.meta.url),
  'utf8',
).trim();

test('home prioritizes return tasks and recent content without duplicating discovery sections', () => {
  const continueIndex = homeSource.indexOf('<ContinueReading />');
  const introIndex = homeSource.indexOf('<HomeIntro />');
  const searchIndex = homeSource.indexOf('<SearchBar');
  const newBooksIndex = homeSource.indexOf('<NewBooks');

  assert.notEqual(introIndex, -1, 'Home page should include the positioning intro.');
  assert.ok(introIndex < continueIndex && continueIndex < searchIndex, 'Returning readers can resume directly below the masthead.');
  assert.ok(searchIndex < newBooksIndex, 'Search should appear before discovery modules.');
  assert.doesNotMatch(homeSource, /<TopicReading/, 'Topic cards should live on the dedicated topics page.');
  assert.doesNotMatch(homeSource, /按分类浏览全部书籍/, 'The home page should not duplicate the library entry.');
});

test('home masthead identifies the library and its reading formats', () => {
  assert.match(introSource, /<PageHeading title="晨笙阅读"/);
  assert.match(introSource, /书籍解读与主题阅读/);
  assert.match(introSource, /data-home-module="topics"/);
  assert.match(introSource, /data-home-module="library"/);
});

test('public positioning describes reader value before the production method', () => {
  assert.match(brandSource, /用于选书、复盘与主题学习/);
  assert.doesNotMatch(brandSource, /BRAND_TAGLINE = 'AI 驱动/);
  assert.match(brandSource, /内容由 AI 辅助整理，并经过人工校审/);
});

test('baidu verification file is published from the static root', () => {
  assert.equal(verificationSource, 'd52c4a03c59c518d3b465e73df77f2f6');
});

test('home intro exposes visible brand identity and links to about without hidden h1 text', () => {
  assert.match(introSource, /晨笙阅读/);
  assert.match(introSource, /href="\/about"/);
  assert.doesNotMatch(introSource, /<h1[^>]*>[\s\S]*sr-only[\s\S]*<\/h1>/);
});

test('root layout avoids hardcoding homepage canonical while home and library set distinct canonicals', () => {
  assert.doesNotMatch(layoutSource, /canonical:/);
  assert.match(homeSource, /canonical:\s*`\$\{BASE_URL\}\/`/);
  assert.match(librarySource, /canonical:\s*`\$\{BASE_URL\}\/library\/`/);
});
