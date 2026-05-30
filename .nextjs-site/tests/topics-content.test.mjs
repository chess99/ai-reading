import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import matter from 'gray-matter';

const repoRoot = path.resolve(new URL('../..', import.meta.url).pathname);
const topicsDir = path.join(repoRoot, 'topics');
const booksDir = path.join(repoRoot, 'books');
const expectedTopicSlugs = new Set([
  'zhong-da-jue-ce',
  'cong-0-dao-1-zuo-chan-pin',
  'xi-tong-yu-fu-za-xing',
  'ke-chi-xu-xi-guan',
  'pian-jian-yu-qun-ti-ying-xiang',
  'li-jie-qin-mi-guan-xi',
  'chuang-shang-yu-zi-wo-xiu-fu',
  'ti-gao-shen-du-gong-zuo-neng-li',
]);

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

function loadBookSlugs() {
  const slugs = new Set();
  for (const filePath of scanMarkdownFiles(booksDir)) {
    const { data } = matter(readFileSync(filePath, 'utf8'));
    if (typeof data.slug === 'string' && data.slug.trim()) {
      slugs.add(data.slug.trim());
    }
  }
  return slugs;
}

test('topic markdown files follow the structured recommendation model', () => {
  assert.equal(existsSync(topicsDir), true, 'topics/ directory should exist');

  const topicFiles = scanMarkdownFiles(topicsDir);
  assert.equal(topicFiles.length, expectedTopicSlugs.size, 'first batch should ship eight topic articles');

  const slugs = new Set();
  const bookSlugs = loadBookSlugs();

  for (const filePath of topicFiles) {
    const relativePath = path.relative(repoRoot, filePath);
    const { data, content } = matter(readFileSync(filePath, 'utf8'));

    assert.equal(typeof data.slug, 'string', `${relativePath} should have a slug`);
    assert.match(data.slug, /^[a-z0-9-]+$/, `${relativePath} slug should be URL-safe`);
    assert.equal(slugs.has(data.slug), false, `${relativePath} slug should be unique`);
    slugs.add(data.slug);
    assert.equal(expectedTopicSlugs.has(data.slug), true, `${relativePath} slug should be in the first topic batch`);

    assert.equal(typeof data.title, 'string', `${relativePath} should have a title`);
    assert.equal(typeof data.description, 'string', `${relativePath} should have a description`);
    assert.ok(Array.isArray(data.tags) && data.tags.length > 0, `${relativePath} should have tags`);
    assert.equal(typeof data.date, 'string', `${relativePath} should have a date`);
    assert.match(data.date, /^\d{4}-\d{2}-\d{2}$/, `${relativePath} date should use YYYY-MM-DD`);
    assert.ok(Array.isArray(data.books) && data.books.length >= 6, `${relativePath} should recommend at least six books`);
    assert.ok(content.trim().length > 300, `${relativePath} should include a substantive guide body`);

    for (const [index, book] of data.books.entries()) {
      const label = `${relativePath} books[${index}]`;
      assert.equal(typeof book.title, 'string', `${label} should have a title`);
      assert.equal(typeof book.author, 'string', `${label} should have an author`);
      assert.equal(typeof book.role, 'string', `${label} should have a role`);
      assert.equal(typeof book.reason, 'string', `${label} should have a reason`);
      assert.ok(['in_library', 'planned'].includes(book.status), `${label} should have a valid status`);

      if (book.status === 'in_library') {
        assert.equal(typeof book.slug, 'string', `${label} should have a slug`);
        assert.equal(bookSlugs.has(book.slug), true, `${label} slug should match an existing book`);
      }
    }
  }

  assert.deepEqual(slugs, expectedTopicSlugs, 'first topic batch should include the expected slugs');
});
