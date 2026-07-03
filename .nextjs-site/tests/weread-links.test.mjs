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
  assert.equal(
    Object.keys(links).length,
    bookSlugs.size,
    'weread-links.json should include a lookup status for every book'
  );

  for (const slug of bookSlugs) {
    assert.equal(slug in links, true, `missing WeRead lookup status for book slug: ${slug}`);
  }

  const seenUrls = new Map();

  for (const [slug, entry] of Object.entries(links)) {
    assert.equal(bookSlugs.has(slug), true, `unknown book slug in weread-links.json: ${slug}`);
    assert.equal(
      entry !== null && typeof entry === 'object' && !Array.isArray(entry),
      true,
      `${slug} WeRead entry should be an object`
    );
    assert.ok(['found', 'not_found'].includes(entry.status), `${slug} WeRead status should be found or not_found`);
    assert.match(String(entry.checkedAt), /^\d{4}-\d{2}-\d{2}$/, `${slug} checkedAt should be YYYY-MM-DD`);

    if (entry.status === 'not_found') {
      assert.equal('url' in entry, false, `${slug} not_found entry should not include a URL`);
      continue;
    }

    assert.equal(typeof entry.url, 'string', `${slug} found entry should include a URL string`);
    const parsed = new URL(entry.url);
    assert.equal(parsed.hostname, 'weread.qq.com', `${slug} WeRead URL should use weread.qq.com`);
    assert.match(parsed.pathname, /^\/(web\/bookDetail\/|book-detail)/, `${slug} WeRead URL should be a book detail URL`);

    const previousSlug = seenUrls.get(entry.url);
    assert.equal(previousSlug, undefined, `${slug} duplicates WeRead URL already used by ${previousSlug}`);
    seenUrls.set(entry.url, slug);
  }
});
