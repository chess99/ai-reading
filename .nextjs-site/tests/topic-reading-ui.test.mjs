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

test('topic detail pages expose specialty hierarchy and merged-topic migration routes', () => {
  const topicPageSource = readFileSync(new URL('../app/topics/[slug]/page.tsx', import.meta.url), 'utf8');
  const topicsLibSource = readFileSync(new URL('../lib/topics.ts', import.meta.url), 'utf8');

  assert.match(topicPageSource, /getTopicChildren/, 'Primary topic pages should surface their specialty children.');
  assert.match(topicPageSource, /主线：\{parentTopic\.title\}/, 'Specialty pages should link back to the primary reading path.');
  assert.match(topicPageSource, /TOPIC MERGED/, 'Legacy merged topic routes should render a migration notice.');
  assert.match(topicPageSource, /robots:\s*\{[\s\S]*?index:\s*false[\s\S]*?follow:\s*true/, 'Merged routes should be noindex/follow.');
  assert.match(topicsLibSource, /TOPIC_MERGES/, 'Merged legacy slugs should be maintained as explicit route mappings.');
  assert.match(topicsLibSource, /getAllTopicRouteSlugs/, 'Static export should generate routes for active and merged legacy slugs.');
});

test('home topic carousel ends with a lightweight all-topics entry', () => {
  const topicReadingSource = readFileSync(new URL('../components/TopicReading.tsx', import.meta.url), 'utf8');

  assert.match(topicReadingSource, /全部主题/, 'Topic carousel should expose an end-of-row all-topics entry.');
  assert.match(topicReadingSource, /继续浏览/, 'The all-topics entry should read like a navigation action.');
  assert.match(topicReadingSource, /min-w-\[144px\]/, 'The all-topics entry should be a lighter end-cap, not a full content card.');
  assert.doesNotMatch(topicReadingSource, /更多主题阅读/, 'The all-topics entry should not masquerade as another topic card.');
  assert.doesNotMatch(topicReadingSource, /ALL TOPICS/, 'The all-topics entry should not introduce a separate visual language.');
});

test('topic detail pages expose the shared topic share action', () => {
  const topicPageSource = readFileSync(new URL('../app/topics/[slug]/page.tsx', import.meta.url), 'utf8');
  const layoutClientSource = readFileSync(new URL('../app/layout-client.tsx', import.meta.url), 'utf8');
  const headerSource = readFileSync(new URL('../components/Header.tsx', import.meta.url), 'utf8');

  assert.match(topicPageSource, /ShareButton/, 'Topic detail page should show a desktop share action near the title.');
  assert.match(topicPageSource, /eventAction:\s*["']share_topic["']/, 'Topic detail page should track topic shares distinctly.');
  assert.match(layoutClientSource, /isTopicPage/, 'Mobile header should recognize topic detail pages.');
  assert.match(layoutClientSource, /detailDescription/, 'Topic header share should include the current page description text.');
  assert.match(headerSource, /shareConfig/, 'Header should use a generic share config rather than book-only sharing.');
});
