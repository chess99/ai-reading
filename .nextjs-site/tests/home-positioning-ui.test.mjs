import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const homeSource = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const introSource = readFileSync(new URL('../components/HomeIntro.tsx', import.meta.url), 'utf8');
const globalStylesSource = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const brandSource = readFileSync(new URL('../lib/brand.ts', import.meta.url), 'utf8');
const verificationSource = readFileSync(
  new URL('../public/baidu_verify_codeva-szqh50c7hX.html', import.meta.url),
  'utf8',
).trim();

test('home prioritizes return tasks and recent content before secondary discovery', () => {
  const continueIndex = homeSource.indexOf('<ContinueReading />');
  const introIndex = homeSource.indexOf('<HomeIntro />');
  const searchIndex = homeSource.indexOf('<SearchBar');
  const topicIndex = homeSource.indexOf('<TopicReading');
  const newBooksIndex = homeSource.indexOf('<NewBooks');
  const libraryIndex = homeSource.indexOf('module="library"');

  assert.notEqual(introIndex, -1, 'Home page should include the positioning intro.');
  assert.ok(continueIndex < introIndex, 'Continue reading should remain the first returning-reader task.');
  assert.ok(introIndex < searchIndex, 'The compact reader promise should introduce search for new readers.');
  assert.ok(searchIndex < newBooksIndex, 'Search should appear before discovery modules.');
  assert.ok(newBooksIndex < topicIndex, 'Recent additions should appear before the featured topic.');
  assert.ok(topicIndex < libraryIndex, 'The compact library entry should close the home discovery flow.');
});

test('home intro explains the three concrete reading use cases', () => {
  assert.match(introSource, /先看清一本书，再决定怎样读/);
  assert.match(introSource, /选书/);
  assert.match(introSource, /复盘/);
  assert.match(introSource, /主题学习/);
  assert.doesNotMatch(introSource, /href=/, 'The positioning panel should not duplicate navigation actions.');
  assert.match(globalStylesSource, /\.brand-soft-panel\s*\{[^}]*background:\s*#fbf7ef/s);
  assert.doesNotMatch(globalStylesSource, /\.brand-soft-panel\s*\{[^}]*linear-gradient/s);
});

test('public positioning describes reader value before the production method', () => {
  assert.match(brandSource, /用于选书、复盘与主题学习/);
  assert.doesNotMatch(brandSource, /BRAND_TAGLINE = 'AI 驱动/);
  assert.match(brandSource, /内容由 AI 辅助整理，并经过人工校审/);
});

test('baidu verification file is published from the static root', () => {
  assert.equal(verificationSource, 'd52c4a03c59c518d3b465e73df77f2f6');
});
