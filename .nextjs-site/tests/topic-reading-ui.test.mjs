import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('topic detail recommendations use whole-card book links and natural note copy', () => {
  const topicPageSource = readFileSync(new URL('../app/topics/[slug]/page.tsx', import.meta.url), 'utf8');

  assert.doesNotMatch(topicPageSource, /阅读提炼/, 'Topic detail page should not use the awkward 阅读提炼 label.');
  assert.match(topicPageSource, /读书笔记/, 'Topic detail page should label book entry links as 读书笔记.');
  assert.match(
    topicPageSource,
    /<Link[\s\S]*?href=\{`\/books\/\$\{book\.book\.slug\}`\}[\s\S]*?className=\{recommendationCardClass\}/,
    'Available topic recommendation cards should link the whole card to the book note.',
  );
});

test('home topic carousel ends with an all-topics entry', () => {
  const topicReadingSource = readFileSync(new URL('../components/TopicReading.tsx', import.meta.url), 'utf8');

  assert.match(topicReadingSource, /查看全部主题/, 'Topic carousel should expose an end-of-row all-topics entry.');
});
