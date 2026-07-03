# WeRead Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add build-time WeRead original-book links to book detail pages without modifying `books/` Markdown files.

**Architecture:** Keep WeRead links in an independent JSON map keyed by book slug. Server-side book page generation reads the map at build time and passes only the current book's URL to the client component, which conditionally renders a clean title-area external-link button.

**Tech Stack:** Next.js App Router, React, TypeScript, Node `fs/path`, Node test runner.

---

## File Structure

- Create `.nextjs-site/data/weread-links.json`: source-side slug-to-WeRead-URL map.
- Create `.nextjs-site/lib/external-links.ts`: server-only helper that loads and validates WeRead links and exposes `getWereadUrlForBook(slug)`.
- Modify `.nextjs-site/app/books/[slug]/page.tsx`: look up the current book's link during static generation and pass it into the client component.
- Modify `.nextjs-site/app/books/[slug]/page-client.tsx`: add optional `wereadUrl` prop and render the title-area button only when present.
- Create `.nextjs-site/tests/weread-links.test.mjs`: repository-level validation for JSON shape, existing slugs, allowed domain, and duplicate URLs.
- Modify `.nextjs-site/tests/topic-reading-ui.test.mjs` or add a focused UI source test: assert the button label and external-link attributes exist in the book page client source.

## Task 1: Add WeRead Link Data And Validation

**Files:**
- Create: `.nextjs-site/data/weread-links.json`
- Create: `.nextjs-site/tests/weread-links.test.mjs`

- [ ] **Step 1: Create the initial empty link map**

Create `.nextjs-site/data/weread-links.json`:

```json
{}
```

- [ ] **Step 2: Write the validation test**

Create `.nextjs-site/tests/weread-links.test.mjs`:

```js
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
```

- [ ] **Step 3: Run the new validation test**

Run:

```bash
cd .nextjs-site
npm test -- tests/weread-links.test.mjs
```

Expected: PASS with the empty JSON map.

## Task 2: Add Build-Time Link Lookup

**Files:**
- Create: `.nextjs-site/lib/external-links.ts`
- Modify: `.nextjs-site/app/books/[slug]/page.tsx`

- [ ] **Step 1: Create the server-side lookup helper**

Create `.nextjs-site/lib/external-links.ts`:

```ts
import fs from 'fs';
import path from 'path';

const WEREAD_LINKS_PATH = path.join(process.cwd(), 'data', 'weread-links.json');

let cachedWereadLinks: Record<string, string> | null = null;

function loadWereadLinks(): Record<string, string> {
  if (cachedWereadLinks) {
    return cachedWereadLinks;
  }

  if (!fs.existsSync(WEREAD_LINKS_PATH)) {
    cachedWereadLinks = {};
    return cachedWereadLinks;
  }

  const raw = fs.readFileSync(WEREAD_LINKS_PATH, 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  cachedWereadLinks = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? parsed as Record<string, string>
    : {};
  return cachedWereadLinks;
}

export function getWereadUrlForBook(slug: string): string | null {
  const url = loadWereadLinks()[slug];
  return typeof url === 'string' && url.trim() ? url : null;
}
```

- [ ] **Step 2: Pass the current book link into the client page**

Modify `.nextjs-site/app/books/[slug]/page.tsx`:

```ts
import { getWereadUrlForBook } from '@/lib/external-links';
```

Inside `BookPage`, after `pageUrl` is defined:

```ts
const wereadUrl = getWereadUrlForBook(book.slug);
```

Pass the prop:

```tsx
<BookPageClient
  content={injectBookLinks(book.content, book.slug)}
  bookSlug={book.slug}
  bookTitle={book.title}
  bookAuthor={book.author}
  bookTags={book.tags}
  wereadUrl={wereadUrl}
/>
```

- [ ] **Step 3: Run TypeScript build validation**

Run:

```bash
cd .nextjs-site
npm run build
```

Expected: build succeeds; no client request for `.nextjs-site/data/weread-links.json` is introduced because the helper is only imported by the server page module.

## Task 3: Render The Title-Area Button

**Files:**
- Modify: `.nextjs-site/app/books/[slug]/page-client.tsx`
- Create or modify: `.nextjs-site/tests/weread-link-ui.test.mjs`

- [ ] **Step 1: Write a focused UI source test**

Create `.nextjs-site/tests/weread-link-ui.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const siteRoot = path.resolve(import.meta.dirname, '..');

test('book page renders a clean WeRead external-link action when URL exists', () => {
  const source = readFileSync(path.join(siteRoot, 'app/books/[slug]/page-client.tsx'), 'utf8');

  assert.match(source, /wereadUrl\?: string \| null/, 'BookPageClient should accept an optional wereadUrl prop');
  assert.match(source, /微信读书看原书/, 'button label should match the approved copy');
  assert.match(source, /target="_blank"/, 'WeRead link should open in a new tab');
  assert.match(source, /rel="noopener noreferrer"/, 'WeRead link should use safe external-link rel');
  assert.doesNotMatch(source, /跳转到正版阅读平台/, 'WeRead action should not include explanatory platform copy');
});
```

- [ ] **Step 2: Update the client component props and rendering**

Modify `.nextjs-site/app/books/[slug]/page-client.tsx`:

```ts
interface BookPageClientProps {
  content: string;
  bookSlug: string;
  bookTitle: string;
  bookAuthor: string;
  bookTags: string[];
  wereadUrl?: string | null;
}

export default function BookPageClient({ content, bookSlug, bookTitle, bookAuthor, bookTags, wereadUrl }: BookPageClientProps) {
```

In the title block, directly below the author paragraph:

```tsx
{wereadUrl && (
  <a
    href={wereadUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-5 inline-flex min-h-10 items-center rounded-md bg-stone-950 px-4 text-sm font-bold text-white transition-colors hover:bg-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
  >
    微信读书看原书 ↗
  </a>
)}
```

- [ ] **Step 3: Run UI and link validation tests**

Run:

```bash
cd .nextjs-site
npm test -- tests/weread-links.test.mjs tests/weread-link-ui.test.mjs
```

Expected: both tests pass.

- [ ] **Step 4: Run the full test suite**

Run:

```bash
cd .nextjs-site
npm test
```

Expected: all existing tests pass.

- [ ] **Step 5: Commit the implementation**

Run:

```bash
git status --short
git add -- .nextjs-site/data/weread-links.json .nextjs-site/lib/external-links.ts .nextjs-site/app/books/[slug]/page.tsx .nextjs-site/app/books/[slug]/page-client.tsx .nextjs-site/tests/weread-links.test.mjs .nextjs-site/tests/weread-link-ui.test.mjs
git diff --staged --name-status
git commit -m "Add WeRead book link support"
```

Expected staged files: only the six implementation files listed above.

## Self-Review

- Spec coverage: the plan covers independent source data, build-time lookup, single-page prop injection, clean title-area UI, domain/slug/duplicate validation, and no `books/` frontmatter changes.
- Placeholder scan: no unresolved placeholders remain in implementation steps. The example URL in the spec is not used by implementation.
- Type consistency: the prop and helper names are consistently `wereadUrl` and `getWereadUrlForBook`.
