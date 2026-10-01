import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { generateFeeds, markdownToFeedHtml, slugifyFeedName } from '../scripts/generate-feeds.mjs';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function countItems(xml) {
  return (xml.match(/<item>/g) || []).length;
}

test('markdownToFeedHtml removes duplicated H1 and keeps full readable HTML', () => {
  const html = markdownToFeedHtml([
    '# 测试书',
    '',
    '第一段正文。',
    '',
    '[站内链接](/about/)',
    '',
    '| 方法 | 作用 |',
    '| --- | --- |',
    '| A | B |',
  ].join('\n'));

  assert.doesNotMatch(html, /<h1>/);
  assert.match(html, /第一段正文/);
  assert.match(html, /href="https:\/\/read\.cearl\.cc\/about\/"/);
  assert.match(html, /<table>/);
});

test('generateFeeds creates full-text RSS, category archives and OPML', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-reading-feeds-'));
  const booksDir = path.join(root, 'books');
  const topicsDir = path.join(root, 'topics');
  const outputDir = path.join(root, 'public');

  write(path.join(booksDir, '科技媒介', 'AI变革', '作者甲-测试新书.md'), `---
slug: ce-shi-xin-shu
title: 测试新书
author: 作者甲
tags: [AI, 测试]
date: '2026-09-30'
---
# 测试新书

这是新书的完整正文。

[关于本站](/about/)
`);
  write(path.join(booksDir, '科技媒介', 'AI变革', '作者乙-测试旧书.md'), `---
slug: ce-shi-jiu-shu
title: 测试旧书
author: 作者乙
tags: [测试]
date: '2026-01-01'
---
# 测试旧书

这是旧书正文。
`);
  write(path.join(booksDir, '科技媒介', 'AI变革', '作者丙-测试更旧书.md'), `---
slug: ce-shi-geng-jiu-shu
title: 测试更旧书
author: 作者丙
tags: [测试]
date: '2025-01-01'
---
# 测试更旧书

这是更旧书正文。
`);
  write(path.join(topicsDir, 'ce-shi-zhu-ti.md'), `---
slug: ce-shi-zhu-ti
title: 测试主题
description: 一个用于验证主题 Feed 的主题。
tags: [测试]
date: '2026-09-29'
---
# 测试主题

这是主题正文。
`);

  const result = generateFeeds({ booksDir, topicsDir, outputDir, recentLimit: 2 });
  assert.deepEqual(result.categories, ['科技媒介']);

  const mainFeed = fs.readFileSync(path.join(outputDir, 'feed.xml'), 'utf8');
  const booksFeed = fs.readFileSync(path.join(outputDir, 'feeds', 'books.xml'), 'utf8');
  const topicsFeed = fs.readFileSync(path.join(outputDir, 'feeds', 'topics.xml'), 'utf8');
  const categoryFeed = fs.readFileSync(path.join(outputDir, 'feeds', 'categories', `${slugifyFeedName('科技媒介')}.xml`), 'utf8');
  const opml = fs.readFileSync(path.join(outputDir, 'feeds', 'ai-reading.opml'), 'utf8');

  assert.equal(countItems(mainFeed), 2, 'main feed should be capped to recent items');
  assert.equal(countItems(booksFeed), 2, 'books feed should be capped to recent items');
  assert.equal(countItems(topicsFeed), 1);
  assert.equal(countItems(categoryFeed), 3, 'category feed should retain the full archive');

  assert.match(mainFeed, /xmlns:content="http:\/\/purl\.org\/rss\/1\.0\/modules\/content\/"/);
  assert.match(mainFeed, /<content:encoded><!\[CDATA\[/);
  assert.match(mainFeed, /这是新书的完整正文/);
  assert.match(mainFeed, /https:\/\/read\.cearl\.cc\/about\//);
  assert.doesNotMatch(mainFeed, /<enclosure\b/);
  assert.match(mainFeed, /<atom:link href="https:\/\/read\.cearl\.cc\/feed\.xml" rel="self" type="application\/rss\+xml"/);

  assert.match(opml, /feeds\/categories\/ke-ji-mei-jie\.xml/);
  assert.match(opml, /feeds\/topics\.xml/);
});

test('site build wires feed generation, discovery and the subscription page', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(siteRoot, 'package.json'), 'utf8'));
  const layout = fs.readFileSync(path.join(siteRoot, 'app', 'layout.tsx'), 'utf8');
  const settings = fs.readFileSync(path.join(siteRoot, 'components', 'SettingsContent.tsx'), 'utf8');
  const listenPage = fs.readFileSync(path.join(siteRoot, 'app', 'listen', 'page.tsx'), 'utf8');

  assert.match(packageJson.scripts.build, /generate-feeds\.mjs/);
  assert.match(packageJson.scripts.dev, /generate-feeds\.mjs/);
  assert.match(layout, /application\/rss\+xml/);
  assert.match(layout, /\/feed\.xml/);
  assert.match(settings, /href="\/listen"/);
  assert.match(listenPage, /Speech Central/);
  assert.match(listenPage, /ai-reading\.opml/);
});
