import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const siteRoot = path.join(repoRoot, '.nextjs-site');
const booksDir = path.join(repoRoot, 'books');
const linksPath = path.join(siteRoot, 'data', 'weread-links.json');

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
  return new Set(
    scanMarkdownFiles(booksDir).map(filePath => {
      const { data } = matter(readFileSync(filePath, 'utf8'));
      return data.slug;
    })
  );
}

test('WeRead links map points to existing books and allowed URLs', () => {
  assert.equal(existsSync(linksPath), true, 'weread-links.json should exist');

  const links = JSON.parse(readFileSync(linksPath, 'utf8'));
  assert.equal(
    links !== null && typeof links === 'object' && !Array.isArray(links),
    true,
    'weread-links.json should be a JSON object'
  );

  const bookSlugs = loadBookSlugs();
  const seenUrls = new Map();

  for (const [slug, url] of Object.entries(links)) {
    assert.equal(bookSlugs.has(slug), true, `unknown book slug in weread-links.json: ${slug}`);
    assert.equal(typeof url, 'string', `${slug} WeRead URL should be a string`);

    const parsed = new URL(url);
    assert.equal(parsed.hostname, 'weread.qq.com', `${slug} WeRead URL should use weread.qq.com`);
    assert.match(parsed.pathname, /^\/(web\/bookDetail\/|book-detail)/, `${slug} WeRead URL should be a book detail URL`);

    const previousSlug = seenUrls.get(url);
    assert.equal(previousSlug, undefined, `${slug} duplicates WeRead URL already used by ${previousSlug}`);
    seenUrls.set(url, slug);
  }
});
