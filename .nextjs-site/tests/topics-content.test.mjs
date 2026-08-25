import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const topicsDir = path.join(repoRoot, 'topics');
const booksDir = path.join(repoRoot, 'books');

const mergedTopics = new Map([
  ['qin-mi-chong-tu', 'qin-mi-guan-xi'],
  ['chan-pin-ji-hui', 'chan-pin-0-dao-1'],
  ['shu-zi-gong-gong-sheng-huo', 'mei-ti-gong-gong-tao-lun'],
]);

const splitTopics = new Map([
  ['jiao-yi-zhou-qi-feng-xian', ['jiao-yi-xi-tong-ji-lv', 'shi-chang-zhou-qi-hong-guan-feng-xian']],
  ['jing-zheng-zhan-lve-ping-tai', ['shang-ye-jing-zheng-zhan-lve', 'ping-tai-wang-luo-xiao-ying']],
  ['er-tong-an-quan-gan', ['er-tong-an-quan-gan-fa-zhan', 'jia-ting-xue-xi-jiao-yu-huan-jing']],
]);

const specialtyParents = new Map([
  ['jiao-lv-yi-yu', 'qing-xu'],
  ['chan-pin-fa-xian', 'chan-pin-0-dao-1'],
  ['ping-tai-suan-fa-zhu-yi-li', 'ji-shu-she-hui'],
  ['tong-ku-zi-you-yi-yi', 'ren-sheng-zhe-xue'],
  ['ya-li-hui-fu', 'jian-kang-sheng-huo'],
  ['jia-ting-xue-xi-jiao-yu-huan-jing', 'zu-gou-hao-de-fu-mu'],
]);

const bannedTemplatePhrases = [
  '难点，通常不在于缺少信息',
  '它让前面的入口判断继续向前推进',
  '从一个模糊感受整理成可以分析',
  '真正有用的阅读路径，需要先让问题变清楚',
];

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
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

function loadBooksBySlug() {
  const booksBySlug = new Map();
  for (const filePath of scanMarkdownFiles(booksDir)) {
    const relativePath = toRepoPath(filePath);
    const { data } = matter(readFileSync(filePath, 'utf8'));
    if (typeof data.slug === 'string' && data.slug.trim()) {
      booksBySlug.set(data.slug, { ...data, relativePath });
    }
  }
  return booksBySlug;
}

test('topic markdown files follow the current curation and hierarchy model', () => {
  assert.equal(existsSync(topicsDir), true, 'topics/ directory should exist');

  const booksBySlug = loadBooksBySlug();
  const topicFiles = scanMarkdownFiles(topicsDir);
  const slugs = new Set();
  const topicDataBySlug = new Map();

  for (const filePath of topicFiles) {
    const relativePath = toRepoPath(filePath);
    const { data, content } = matter(readFileSync(filePath, 'utf8'));

    assert.equal(typeof data.slug, 'string', `${relativePath} should have a slug`);
    assert.match(data.slug, /^[a-z0-9-]+$/, `${relativePath} slug should be URL-safe`);
    assert.equal(slugs.has(data.slug), false, `${relativePath} slug should be unique`);
    slugs.add(data.slug);
    topicDataBySlug.set(data.slug, data);

    assert.equal(typeof data.title, 'string', `${relativePath} should have a title`);
    assert.equal(typeof data.description, 'string', `${relativePath} should have a description`);
    assert.ok(Array.isArray(data.tags) && data.tags.length > 0, `${relativePath} should have tags`);
    assert.equal(typeof data.date, 'string', `${relativePath} should have a date`);
    assert.match(data.date, /^\d{4}-\d{2}-\d{2}$/, `${relativePath} date should use YYYY-MM-DD`);

    if (data.kind !== undefined) {
      assert.match(data.kind, /^(primary|specialty)$/, `${relativePath} should use a supported topic kind`);
    }

    if (data.kind === 'specialty') {
      assert.equal(typeof data.parent, 'string', `${relativePath} specialty should declare a parent slug`);
      assert.match(data.parent, /^[a-z0-9-]+$/, `${relativePath} parent slug should be URL-safe`);
    } else {
      assert.equal(data.parent, undefined, `${relativePath} primary topic should not declare a parent`);
    }

    const topicBooks = data.books || [];
    assert.ok(Array.isArray(topicBooks), `${relativePath} books should be an array when present`);
    assert.ok(content.trim().length > 300, `${relativePath} should include a substantive guide body`);
    assert.match(content, /^#\s+/m, `${relativePath} should include a first-level title`);
    assert.match(content, /## 建议读法/, `${relativePath} should include reading advice`);

    for (const phrase of bannedTemplatePhrases) {
      assert.equal(content.includes(phrase), false, `${relativePath} should not contain template phrase: ${phrase}`);
    }

    for (const [index, book] of topicBooks.entries()) {
      const label = `${relativePath} books[${index}]`;
      assert.equal(typeof book.title, 'string', `${label} should have a title`);
      assert.equal(typeof book.author, 'string', `${label} should have an author`);
      assert.equal(typeof book.role, 'string', `${label} should have a role`);
      assert.equal(typeof book.reason, 'string', `${label} should have a reason`);
      assert.match(book.status, /^(in_library|planned)$/, `${label} should have a supported status`);

      if (book.slug || book.status === 'in_library') {
        assert.equal(typeof book.slug, 'string', `${label} in-library reference should have a slug`);
        const referencedBook = booksBySlug.get(book.slug);
        assert.ok(referencedBook, `${label} should reference an existing book slug: ${book.slug}`);

        if (book.path) {
          assert.equal(book.path, referencedBook.relativePath, `${label} path should match referenced book file`);
        }
      }
    }
  }

  for (const [mergedSlug, targetSlug] of mergedTopics) {
    assert.equal(slugs.has(mergedSlug), false, `${mergedSlug} should no longer ship as an independent topic article`);
    assert.equal(slugs.has(targetSlug), true, `${mergedSlug} merge target should exist: ${targetSlug}`);
  }

  for (const [retiredSlug, replacements] of splitTopics) {
    assert.equal(slugs.has(retiredSlug), false, `${retiredSlug} should be retired after the structural split`);
    for (const replacementSlug of replacements) {
      assert.equal(slugs.has(replacementSlug), true, `${retiredSlug} split replacement should exist: ${replacementSlug}`);
    }
  }

  for (const [specialtySlug, parentSlug] of specialtyParents) {
    const specialty = topicDataBySlug.get(specialtySlug);
    const parent = topicDataBySlug.get(parentSlug);

    assert.ok(specialty, `specialty topic should exist: ${specialtySlug}`);
    assert.ok(parent, `specialty parent should exist: ${parentSlug}`);
    assert.equal(specialty.kind, 'specialty', `${specialtySlug} should be marked as specialty`);
    assert.equal(specialty.parent, parentSlug, `${specialtySlug} should point to its approved parent`);
    assert.notEqual(parent.kind, 'specialty', `${parentSlug} should remain a primary topic`);
  }
});
