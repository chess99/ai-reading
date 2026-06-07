import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const topicsPageSource = readFileSync(new URL('../app/topics/page.tsx', import.meta.url), 'utf8');
const discoverySourcePath = new URL('../components/TopicsDiscovery.tsx', import.meta.url);
const topicCardSource = readFileSync(new URL('../components/TopicCard.tsx', import.meta.url), 'utf8');
const topicsLibSource = readFileSync(new URL('../lib/topics.ts', import.meta.url), 'utf8');

function readDiscoverySource() {
  return readFileSync(discoverySourcePath, 'utf8');
}

test('topics page keeps the approved reading-oriented subtitle', () => {
  assert.match(
    topicsPageSource,
    /带着一个具体问题开始阅读：先建立判断框架，再沿着几本关键书逐层深入。/,
    'Topics page should keep the approved subtitle copy.'
  );
});

test('topics page delegates discovery behavior to a client component', () => {
  assert.match(topicsPageSource, /TopicsDiscovery/, 'Topics page should render the discovery component.');
  assert.doesNotMatch(
    topicsPageSource,
    /topics\.map\(topic =>\s*\(\s*<TopicCard/,
    'Topics page should not directly render an unfiltered card wall.'
  );
});

test('topics discovery uses search and domain-only filtering', () => {
  const discoverySource = readDiscoverySource();

  assert.match(discoverySource, /'use client'/, 'TopicsDiscovery should be a client component.');
  assert.match(discoverySource, /搜索主题、标签、领域、书名/, 'Search placeholder should match the approved scope.');
  assert.match(discoverySource, /aria-pressed=\{selectedDomain === domain\}/, 'Domain buttons should expose pressed state.');
  assert.match(discoverySource, /全部/, 'Domain filter should include 全部.');
  assert.doesNotMatch(discoverySource, /入门|框架|系统/, 'Discovery UI should not expose level labels.');
  assert.doesNotMatch(discoverySource, /排序|最新|书数/, 'Discovery UI should not expose sorting controls.');
  assert.doesNotMatch(discoverySource, /总数|候选主题|领域数|80\s*个|80\s*条/, 'Discovery UI should not show global stat cards.');
});

test('topic metadata supports explicit domain and group without public level', () => {
  assert.match(topicsLibSource, /domain\?: string/, 'TopicMeta should include optional domain.');
  assert.match(topicsLibSource, /group\?: string/, 'TopicMeta should include optional group.');
  assert.match(topicsLibSource, /searchText: string/, 'TopicMeta should include searchText for client-side filtering.');
  assert.doesNotMatch(topicsLibSource, /level\?: string/, 'Topic metadata should not add a public level field.');
});

test('topic cards do not render level badges', () => {
  assert.doesNotMatch(topicCardSource, /入门|框架|系统/, 'Topic cards should not show level badges.');
  assert.match(topicCardSource, /topic\.bookCount/, 'Topic cards should keep the book count chip.');
});
