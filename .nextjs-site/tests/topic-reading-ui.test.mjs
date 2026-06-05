import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('topic detail recommendations use whole-card book links without redundant action copy', () => {
  const topicPageSource = readFileSync(new URL('../app/topics/[slug]/page.tsx', import.meta.url), 'utf8');

  assert.doesNotMatch(topicPageSource, /阅读提炼/, 'Topic detail page should not use the awkward 阅读提炼 label.');
  assert.doesNotMatch(topicPageSource, /读书笔记/, 'Whole-card links do not need a repeated action label.');
  assert.match(
    topicPageSource,
    /<Link[\s\S]*?href=\{`\/books\/\$\{linkedBook\.slug\}`\}[\s\S]*?className=\{recommendationCardClass\}/,
    'Available topic recommendation cards should link the whole card to the book note.',
  );
  assert.match(topicPageSource, /ChevronRightIcon/, 'Clickable recommendation cards should use a chevron affordance.');
});

test('home topic carousel ends with a lightweight all-topics entry', () => {
  const topicReadingSource = readFileSync(new URL('../components/TopicReading.tsx', import.meta.url), 'utf8');

  assert.match(topicReadingSource, /全部主题/, 'Topic carousel should expose an end-of-row all-topics entry.');
  assert.match(topicReadingSource, /继续浏览/, 'The all-topics entry should read like a navigation action.');
  assert.match(topicReadingSource, /min-w-\[144px\]/, 'The all-topics entry should be a lighter end-cap, not a full content card.');
  assert.doesNotMatch(topicReadingSource, /更多主题阅读/, 'The all-topics entry should not masquerade as another topic card.');
  assert.doesNotMatch(topicReadingSource, /ALL TOPICS/, 'The all-topics entry should not introduce a separate visual language.');
});
