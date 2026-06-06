import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import matter from 'gray-matter';
import { pinyin } from 'pinyin-pro';

const repoRoot = path.resolve(new URL('../..', import.meta.url).pathname);
const topicsDir = path.join(repoRoot, 'topics');
const panoramaPath = path.join(repoRoot, 'docs/superpowers/plans/2026-06-01-topic-reading-panorama.md');
const topicLayers = new Set(['入门', '框架', '系统']);
const legacySlugByTitle = new Map([
  ['如何做重大决策', 'zhong-da-jue-ce'],
  ['什么是系统思维与复杂性', 'xi-tong-yu-fu-za-xing'],
  ['如何建立可持续习惯', 'ke-chi-xu-xi-guan'],
  ['如何识别偏见、从众与服从', 'pian-jian-yu-qun-ti-ying-xiang'],
  ['产品从 0 到 1', 'cong-0-dao-1-zuo-chan-pin'],
  ['亲密关系阅读路径', 'li-jie-qin-mi-guan-xi'],
  ['如何面对创伤与自我修复', 'chuang-shang-yu-zi-wo-xiu-fu'],
  ['如何提高深度工作能力', 'ti-gao-shen-du-gong-zuo-neng-li'],
]);
const bannedTemplatePhrases = [
  '难点，通常不在于缺少信息',
  '它让前面的入口判断继续向前推进',
  '从一个模糊感受整理成可以分析',
  '真正有用的阅读路径，需要先让问题变清楚',
];

function generateSlug(title) {
  return pinyin(title, {
    toneType: 'none',
    separator: '-',
    nonZh: 'consecutive',
  })
    .toLowerCase()
    .replace(/ü/g, 'v')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function scanMarkdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractBookTitles(readingPath) {
  return [...readingPath.matchAll(/《([^》]+)》/g)].map(match => match[1]);
}

function loadExpectedTopics() {
  const rows = [];
  const rawPlan = readFileSync(panoramaPath, 'utf8');

  for (const line of rawPlan.split(/\r?\n/)) {
    if (!line.startsWith('|') || !line.includes(' -> ')) continue;

    const columns = line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(column => column.trim());

    const [layer, title, readingPath, gradient] = columns;
    if (!topicLayers.has(layer)) continue;

    const slug = legacySlugByTitle.get(title) || generateSlug(title);
    rows.push({
      layer,
      title,
      slug,
      books: extractBookTitles(readingPath),
      gradient,
    });
  }

  return rows;
}

test('topic markdown files follow the panorama production model', () => {
  assert.equal(existsSync(topicsDir), true, 'topics/ directory should exist');

  const expectedTopics = loadExpectedTopics();
  assert.equal(expectedTopics.length, 73, 'panorama should define 73 topic candidates');

  const expectedBySlug = new Map(expectedTopics.map(topic => [topic.slug, topic]));
  const topicFiles = scanMarkdownFiles(topicsDir);
  assert.equal(topicFiles.length, expectedBySlug.size, 'topics/ should ship every panorama topic article');

  const slugs = new Set();

  for (const filePath of topicFiles) {
    const relativePath = path.relative(repoRoot, filePath);
    const { data, content } = matter(readFileSync(filePath, 'utf8'));

    assert.equal(typeof data.slug, 'string', `${relativePath} should have a slug`);
    assert.match(data.slug, /^[a-z0-9-]+$/, `${relativePath} slug should be URL-safe`);
    assert.equal(slugs.has(data.slug), false, `${relativePath} slug should be unique`);
    slugs.add(data.slug);

    const expected = expectedBySlug.get(data.slug);
    assert.ok(expected, `${relativePath} slug should match a panorama topic`);
    assert.equal(data.title, expected.title, `${relativePath} title should match the panorama`);
    assert.equal(typeof data.description, 'string', `${relativePath} should have a description`);
    assert.ok(Array.isArray(data.tags) && data.tags.length > 0, `${relativePath} should have tags`);
    assert.equal(typeof data.date, 'string', `${relativePath} should have a date`);
    assert.match(data.date, /^\d{4}-\d{2}-\d{2}$/, `${relativePath} date should use YYYY-MM-DD`);
    assert.ok(Array.isArray(data.books), `${relativePath} should have books`);
    assert.deepEqual(
      data.books.map(book => book.title),
      expected.books,
      `${relativePath} book order should match the panorama`
    );
    assert.ok(content.trim().length > 300, `${relativePath} should include a substantive guide body`);
    assert.match(content, /^#\s+/m, `${relativePath} should include a first-level title`);
    assert.match(content, /## 建议读法/, `${relativePath} should include reading advice`);
    for (const phrase of bannedTemplatePhrases) {
      assert.equal(content.includes(phrase), false, `${relativePath} should not contain template phrase: ${phrase}`);
    }

    for (const [index, book] of data.books.entries()) {
      const label = `${relativePath} books[${index}]`;
      assert.equal(typeof book.title, 'string', `${label} should have a title`);
      assert.equal(typeof book.author, 'string', `${label} should have an author`);
      assert.equal(typeof book.role, 'string', `${label} should have a role`);
      assert.equal(typeof book.reason, 'string', `${label} should have a reason`);
      assert.equal(book.status, 'planned', `${label} should stay in planned status during topic-only production`);
      assert.equal('slug' in book, false, `${label} should not invent a book slug during topic-only production`);
    }
  }

  assert.deepEqual(slugs, new Set(expectedBySlug.keys()), 'topics/ should include exactly the panorama slugs');
});
