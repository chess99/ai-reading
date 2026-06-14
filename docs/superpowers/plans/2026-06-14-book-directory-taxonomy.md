# Book Directory Taxonomy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize `books/` into a consistent, reader-intent directory taxonomy while preserving every book slug, public book URL, topic recommendation, and source-of-truth reference.

**Architecture:** Treat the filesystem as each book's primary shelf, and use `tags` plus `topics/` for cross-domain relationships. The implementation first adds migration guardrails, then fixes slug-based manifest generation, then moves book files in reviewable batches with automated path rewrites and validation. Public URLs remain `/books/<frontmatter slug>/`; only `category` and `categoryPath` change.

**Tech Stack:** Markdown book files in `books/`, topic Markdown in `topics/`, docs under `docs/topic-booklists/`, Next.js 16 static export in `.nextjs-site/`, Node.js `node:test`, `gray-matter`, existing `slugify.js`, `generate-manifest.js`, and `npm run build`.

---

## Current Audit

- Current library size: 364 Markdown books.
- Current top-level folders: 12.
- Current depth imbalance: 297 books are directly under top-level folders; 67 books are under second-level folders.
- Existing second-level folders only appear under `商业管理`, `社会科学`, and `投资`.
- Current path references: all 73 topic files contain book references; topic path refs are currently valid, but any move must rewrite them.
- `docs/topic-booklists/*.md`, `docs/topic-production-guide.md`, and `docs/superpowers/plans/2026-06-01-topic-reading-panorama.md` also contain source-of-truth book paths.
- `AGENTS.md`, `CLAUDE.md`, and `.nextjs-site/docs/book-format.md` still document the old root-level or arbitrary-depth path model. The migration must update these source-of-truth docs before enforcing exactly two category levels.
- `.nextjs-site/lib/books.ts` already recursively scans arbitrary nested `books/` paths and derives `categoryPath`, so the loader can support the taxonomy.
- `.nextjs-site/scripts/generate-manifest.js` currently derives book slugs from filenames rather than frontmatter, so the manifest must be fixed before large moves.
- A separate naming audit found 17 current filename/frontmatter mismatches and 2 current H1/title mismatches. Those are real library-format issues, but they are not taxonomy blockers. This plan records them as a follow-up cleanup batch instead of making the taxonomy migration fail for pre-existing content drift.

## Independent Review Consensus

Three read-only reviews were run with separate lenses: information architecture, implementation risk, and reader/content strategy.

Consensus:

- The root issue is not a few misplaced books; it is inconsistent directory rules.
- Do not flatten the library. At 364 books, flat categories are no longer scannable.
- Use one primary shelf per book; use `tags` and `topics/` for cross-cutting use cases.
- Keep directory depth to two levels unless a future domain becomes large enough to justify a deliberate third-level migration.
- Preserve frontmatter `slug`, `title`, and `author`; directory moves must not change book URLs.
- Automate reference rewrites and validate them before committing any move batch.

Resolved review tension:

- One reviewer preferred keeping `商业管理` and `创业产品` as separate top-level domains, while another recommended merging them for reader navigation.
- This plan chooses a reader-intent top-level domain `商业产品` for market-facing business, product, entrepreneurship, strategy, marketing, and company-building books.
- `职业组织` is deliberately separate: it holds workplace-facing management practice, leadership, organizational behavior, collaboration, power, change, operations, and coaching books where the reader goal is making teams and organizations work.
- One reviewer preferred keeping `个人成长` and `效率习惯` separate; this plan merges them into `自我管理`, with second-level folders for habits, focus, learning, career, and expression.
- This is not a root disagreement because both views reject the current mixed rule set and accept second-level folders as the boundary-preserving mechanism.

## Target Directory Tree

Use short, stable Chinese directory names without punctuation.

```text
books/
  思维科学/
    决策判断/
    证据科学/
    系统复杂/
    概率风险/
    行为经济/

  自我管理/
    习惯行动/
    专注效率/
    学习练习/
    时间精力/
    职业发展/
    表达输出/

  心理修复/
    心理通论/
    情绪内耗/
    自尊成长/
    创伤修复/
    成瘾自控/

  关系家庭/
    亲密关系/
    沟通冲突/
    家庭教育/
    儿童发展/

  职业组织/
    管理通论/
    组织领导/
    权力变革/
    运营流程/
    教练协作/

  商业产品/
    商业战略/
    产品管理/
    创业方法/
    市场增长/
    用户体验/
    商业模式/
    经营财务/

  金钱投资/
    理财入门/
    价值投资/
    交易系统/
    交易心理/
    宏观周期/
    经济学/

  社会公共/
    社会理论/
    法律公共/
    政治制度/
    媒介传播/
    性别结构/
    城市环境/
    技术社会/

  历史世界/
    中国历史/
    世界历史/
    国际秩序/
    传记回忆/

  科技媒介/
    AI变革/
    平台算法/
    未来技术/
    信息网络/

  人文艺术/
    文学阅读/
    写作技艺/
    叙事创作/
    艺术美学/
    设计视觉/
    人生哲学/
    中国哲学/
    政治哲学/

  健康身体/
    医学生理/
    营养代谢/
    睡眠恢复/
    运动训练/
    衰老照护/
```

Boundary rules:

- `职业组织` is internal-facing: managing yourself inside work, managing people, operating teams, leading change, and understanding organizational power.
- `商业产品` is market-facing: choosing strategy, building products, validating opportunities, finding customers, growing demand, designing business models, and understanding company economics.
- `社会公共/技术社会` holds social-theory books about technology's public impact.
- `科技媒介/*` holds AI, algorithm, platform, and information-network books where the reader goal is understanding the technology environment itself.
- `健康身体` does not absorb climate, agriculture, cities, or sustainability; those remain under `社会公共/城市环境` unless the book is primarily about personal health.
- `人文艺术/人生哲学` holds life-wisdom and meaning books; technical philosophy goes to `人文艺术/中国哲学`, `人文艺术/政治哲学`, or a future `人文艺术/哲学通论` if enough books accumulate.

## Files And Responsibilities

- Create: `.nextjs-site/tests/book-taxonomy.test.mjs`  
  Validates taxonomy depth, allowed top-level folders and shelves, no orphan root books, required frontmatter fields, unique slugs, and topic path consistency.

- Modify: `.nextjs-site/scripts/generate-manifest.js`  
  Reads book frontmatter with `gray-matter` and emits manifest URLs keyed by frontmatter `slug`.

- Modify: `books/**/*.md` paths only  
  Move files with `git mv`; do not edit book content unless a pre-existing frontmatter violation blocks validation.

- Modify: tracked Markdown files containing moved `books/...md` references  
  Rewrite moved book paths in every tracked `*.md` file so verification scope and mutation scope match. This includes `topics/`, `docs/topic-booklists/`, `.nextjs-site/docs/`, and active planning docs, but only files containing paths from `docs/book-taxonomy-migration.tsv` will change.

- Modify: `AGENTS.md`, `CLAUDE.md`, `.nextjs-site/docs/book-format.md`  
  Update book path rules from `books/<分类>/<作者>-<书名>.md` or arbitrary multi-level categories to `books/<一级分类>/<二级分类>/<作者>-<书名>.md`, and document that new books must use approved shelves from this plan unless a future taxonomy plan changes the list.

- Ignored generated output: `.nextjs-site/public/build-manifest.json`  
  Regenerate and inspect it through `npm run build` or `node .nextjs-site/scripts/generate-manifest.js`; do not hand-edit, stage, or commit it because `.gitignore` intentionally ignores this file.

## Task 1: Add Taxonomy Validation

**Files:**
- Create: `.nextjs-site/tests/book-taxonomy.test.mjs`

This task creates the future guardrail first, but it is expected to fail until Task 2 updates source-of-truth docs and Task 5 moves the books. Do not treat this test as an enforced passing gate until the migration batch reaches Task 5.

- [ ] **Step 1: Create the failing taxonomy test**

Create `.nextjs-site/tests/book-taxonomy.test.mjs` with:

```js
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import matter from 'gray-matter';

const repoRoot = path.resolve(new URL('../..', import.meta.url).pathname);
const booksDir = path.join(repoRoot, 'books');
const topicsDir = path.join(repoRoot, 'topics');

const allowedTopLevel = new Set([
  '思维科学',
  '自我管理',
  '心理修复',
  '关系家庭',
  '职业组织',
  '商业产品',
  '金钱投资',
  '社会公共',
  '历史世界',
  '科技媒介',
  '人文艺术',
  '健康身体',
]);

const allowedShelves = new Set([
  '思维科学/决策判断',
  '思维科学/证据科学',
  '思维科学/系统复杂',
  '思维科学/概率风险',
  '思维科学/行为经济',
  '自我管理/习惯行动',
  '自我管理/专注效率',
  '自我管理/学习练习',
  '自我管理/时间精力',
  '自我管理/职业发展',
  '自我管理/表达输出',
  '心理修复/心理通论',
  '心理修复/情绪内耗',
  '心理修复/自尊成长',
  '心理修复/创伤修复',
  '心理修复/成瘾自控',
  '关系家庭/亲密关系',
  '关系家庭/沟通冲突',
  '关系家庭/家庭教育',
  '关系家庭/儿童发展',
  '职业组织/管理通论',
  '职业组织/组织领导',
  '职业组织/权力变革',
  '职业组织/运营流程',
  '职业组织/教练协作',
  '商业产品/商业战略',
  '商业产品/产品管理',
  '商业产品/创业方法',
  '商业产品/市场增长',
  '商业产品/用户体验',
  '商业产品/商业模式',
  '商业产品/经营财务',
  '金钱投资/理财入门',
  '金钱投资/价值投资',
  '金钱投资/交易系统',
  '金钱投资/交易心理',
  '金钱投资/宏观周期',
  '金钱投资/经济学',
  '社会公共/社会理论',
  '社会公共/法律公共',
  '社会公共/政治制度',
  '社会公共/媒介传播',
  '社会公共/性别结构',
  '社会公共/城市环境',
  '社会公共/技术社会',
  '历史世界/中国历史',
  '历史世界/世界历史',
  '历史世界/国际秩序',
  '历史世界/传记回忆',
  '科技媒介/AI变革',
  '科技媒介/平台算法',
  '科技媒介/未来技术',
  '科技媒介/信息网络',
  '人文艺术/文学阅读',
  '人文艺术/写作技艺',
  '人文艺术/叙事创作',
  '人文艺术/艺术美学',
  '人文艺术/设计视觉',
  '人文艺术/人生哲学',
  '人文艺术/中国哲学',
  '人文艺术/政治哲学',
  '健康身体/医学生理',
  '健康身体/营养代谢',
  '健康身体/睡眠恢复',
  '健康身体/运动训练',
  '健康身体/衰老照护',
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

function loadBookBySlug() {
  const bySlug = new Map();
  const files = scanMarkdownFiles(booksDir);

  for (const filePath of files) {
    const relativePath = path.relative(repoRoot, filePath);
    const parts = relativePath.split(path.sep);
    const categories = parts.slice(1, -1);
    const { data } = matter(readFileSync(filePath, 'utf8'));

    assert.equal(parts[0], 'books', `${relativePath} should be under books/`);
    assert.equal(categories.length, 2, `${relativePath} should use exactly two category levels`);
    assert.ok(allowedTopLevel.has(categories[0]), `${relativePath} should use an allowed top-level category`);
    assert.ok(allowedShelves.has(categories.join('/')), `${relativePath} should use an approved second-level shelf`);
    assert.equal(typeof data.slug, 'string', `${relativePath} should have slug`);
    assert.match(data.slug, /^[a-z0-9-]+$/, `${relativePath} slug should be URL-safe`);
    assert.equal(typeof data.title, 'string', `${relativePath} should have title`);
    assert.equal(typeof data.author, 'string', `${relativePath} should have author`);
    assert.ok(Array.isArray(data.tags), `${relativePath} tags should be an inline array parsed as an array`);
    assert.match(String(data.date), /^\d{4}-\d{2}-\d{2}$/, `${relativePath} date should be YYYY-MM-DD`);

    assert.equal(bySlug.has(data.slug), false, `${relativePath} slug should be unique: ${data.slug}`);
    bySlug.set(data.slug, { relativePath, data });
  }

  return bySlug;
}

test('books use the approved two-level taxonomy and stable frontmatter', () => {
  assert.equal(existsSync(booksDir), true, 'books/ directory should exist');
  const bySlug = loadBookBySlug();
  assert.equal(bySlug.size, 364, 'taxonomy migration should preserve the current 364 books');
});

test('topic book paths point to the file for the referenced slug', () => {
  const bySlug = loadBookBySlug();
  const topicFiles = scanMarkdownFiles(topicsDir);

  for (const filePath of topicFiles) {
    const relativeTopicPath = path.relative(repoRoot, filePath);
    const { data } = matter(readFileSync(filePath, 'utf8'));
    const books = data.books || [];
    assert.ok(Array.isArray(books), `${relativeTopicPath} books should be an array when present`);

    for (const [index, book] of books.entries()) {
      const label = `${relativeTopicPath} books[${index}]`;
      if (book.status !== 'in_library') continue;

      assert.equal(typeof book.slug, 'string', `${label} should include slug`);
      assert.equal(typeof book.path, 'string', `${label} should include path`);
      const referenced = bySlug.get(book.slug);
      assert.ok(referenced, `${label} should reference an existing book slug: ${book.slug}`);
      assert.equal(book.path, referenced.relativePath, `${label} path should match the referenced book slug`);
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails on the current taxonomy**

Run:

```bash
cd .nextjs-site && npm test -- tests/book-taxonomy.test.mjs
```

Expected:

```text
not ok ... should use exactly two category levels
```

The current library still has root-level books and old top-level folders, so this failure proves the test is guarding the migration.

- [ ] **Step 3: Commit the failing guardrail test**

```bash
git add .nextjs-site/tests/book-taxonomy.test.mjs
git commit -m "test: add book taxonomy migration guardrails"
```

## Task 2: Update Book Format Source-Of-Truth Docs

**Files:**
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `.nextjs-site/docs/book-format.md`

- [ ] **Step 1: Update root agent instructions**

In both `AGENTS.md` and `CLAUDE.md`, replace:

```markdown
文件路径：`books/<分类>/<作者>-<书名>.md`
```

with:

```markdown
文件路径：`books/<一级分类>/<二级分类>/<作者>-<书名>.md`

- 新书必须放入已批准的两级书架；不要直接放在一级分类根目录。
- 一级分类与二级分类以 `docs/superpowers/plans/2026-06-14-book-directory-taxonomy.md` 的 Target Directory Tree 为准。
- 若确实需要新增分类，先更新书籍目录计划和校验测试，再入库书籍。
```

- [ ] **Step 2: Update `.nextjs-site/docs/book-format.md` path examples**

Replace the "文件命名" section with:

````markdown
## 文件命名

```text
books/<一级分类>/<二级分类>/<作者>-<书名>.md
```

示例：

- `books/职业组织/管理通论/彼得·德鲁克-卓有成效的管理者.md`
- `books/金钱投资/价值投资/本杰明·格雷厄姆-聪明的投资者.md`
- `books/商业产品/商业战略/彼得·蒂尔,布莱克·马斯特斯-从零到一.md`

书籍目录使用固定两级书架。不要把书直接放在一级分类根目录，也不要自行创建第三级目录。
````

- [ ] **Step 3: Update `.nextjs-site/docs/book-format.md` category rules**

Replace the "分类目录" section with:

````markdown
## 分类目录

站点会递归读取 `books/`，但当前书库规范要求每本书使用固定两级目录：

```text
books/<一级分类>/<二级分类>/<作者>-<书名>.md
```

一级分类和二级分类由书库目录计划维护。新增书籍时应选择现有二级书架；如果现有书架无法容纳，应先更新目录计划、校验测试和相关文档，再新增分类。
````

- [ ] **Step 4: Verify no old path model remains in source-of-truth docs**

Run:

```bash
rg -n 'books/<分类>|支持多级子分类|支持任意层级|arbitrary' AGENTS.md CLAUDE.md .nextjs-site/docs/book-format.md
```

Expected:

```text
No matches.
```

- [ ] **Step 5: Commit source-of-truth doc updates**

```bash
git add AGENTS.md CLAUDE.md .nextjs-site/docs/book-format.md
git status --short
git commit -m "docs: update book taxonomy path rules"
```

Before committing, inspect `git status --short` and confirm only these three source-of-truth docs are staged.

## Task 3: Fix Manifest Slug Generation

**Files:**
- Modify: `.nextjs-site/scripts/generate-manifest.js`
- Test: `.nextjs-site/tests/book-taxonomy.test.mjs`

- [ ] **Step 1: Update `generate-manifest.js` to read frontmatter**

Replace the imports and `scanBooks` implementation in `.nextjs-site/scripts/generate-manifest.js` with:

```js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

function scanBooks(dir) {
  const books = {};

  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const hash = generateHash(content);
          const { data } = matter(content);
          const fallback = parseFilename(entry.name);
          const slug = data.slug || entry.name.replace(/\.md$/, '');
          const title = data.title || fallback.title;
          const author = data.author || fallback.author;

          books[slug] = {
            hash,
            title,
            author,
            path: path.relative(BOOKS_DIR, fullPath),
          };
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error.message);
        }
      }
    }
  }

  scan(dir);
  return books;
}
```

- [ ] **Step 2: Generate the manifest**

Run:

```bash
node .nextjs-site/scripts/generate-manifest.js
```

Expected:

```text
Manifest generated: 364 books, 73 topics
```

- [ ] **Step 3: Verify manifest URLs are slug-based**

Run:

```bash
node --input-type=module <<'NODE'
import { readFileSync } from 'node:fs';
const manifest = JSON.parse(readFileSync('.nextjs-site/public/build-manifest.json', 'utf8'));
const urls = Object.keys(manifest.content).filter(url => url.startsWith('/books/'));
if (manifest.booksCount !== 364) throw new Error(`Expected 364 books, got ${manifest.booksCount}`);
if (!urls.includes('/books/cong-ling-dao-yi/')) throw new Error('Missing known frontmatter slug URL');
if (urls.some(url => /[\u4e00-\u9fff]/.test(url))) throw new Error('Book manifest URLs should not contain Chinese filenames');
console.log(`ok ${urls.length} book URLs`);
NODE
```

Expected:

```text
ok 364 book URLs
```

- [ ] **Step 4: Commit the manifest script fix**

```bash
git add .nextjs-site/scripts/generate-manifest.js
git commit -m "fix: generate book manifest from frontmatter slugs"
```

## Task 4: Build The Migration Map

**Files:**
- Create: `docs/book-taxonomy-migration.tsv`

- [ ] **Step 1: Create the migration map**

Create `docs/book-taxonomy-migration.tsv` with tab-separated columns:

```text
slug	current_path	target_path	reason
```

For every current `books/**/*.md`, add one row. Example rows:

```text
cong-ling-dao-yi	books/商业管理/公司战略/彼得·蒂尔,布莱克·马斯特斯-从零到一.md	books/商业产品/商业战略/彼得·蒂尔,布莱克·马斯特斯-从零到一.md	strategy and product bridge; primary shelf is business strategy
shen-du-gong-zuo	books/效率习惯/卡尔·纽波特-深度工作.md	books/自我管理/专注效率/卡尔·纽波特-深度工作.md	reader goal is deep focus and sustainable output
qin-mi-guan-xi	books/心理学/罗兰·米勒-亲密关系.md	books/关系家庭/亲密关系/罗兰·米勒-亲密关系.md	reader goal is relationship understanding, not psychology as discipline
guo-fu-lun	books/社会科学/亚当·斯密-国富论.md	books/金钱投资/经济学/亚当·斯密-国富论.md	primary shelf is economics
yi-shu-de-gu-shi	books/写作创意/E.H. 贡布里希-艺术的故事.md	books/人文艺术/艺术美学/E.H. 贡布里希-艺术的故事.md	primary shelf is art history and aesthetics
```

- [ ] **Step 2: Validate the migration map is complete**

Run:

```bash
node --input-type=module <<'NODE'
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from './.nextjs-site/node_modules/gray-matter/index.js';

function scan(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...scan(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(fullPath);
  }
  return files;
}

const repoRoot = process.cwd();
const bookRows = scan('books').map(filePath => {
  const { data } = matter(readFileSync(filePath, 'utf8'));
  return { slug: data.slug, path: filePath };
});

const rows = readFileSync('docs/book-taxonomy-migration.tsv', 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map(line => line.split('\t'));

const bySlug = new Map(rows.map(([slug, currentPath, targetPath]) => [slug, { currentPath, targetPath }]));
if (bySlug.size !== bookRows.length) throw new Error(`Expected ${bookRows.length} map rows, got ${bySlug.size}`);
for (const book of bookRows) {
  const row = bySlug.get(book.slug);
  if (!row) throw new Error(`Missing migration row for ${book.slug}`);
  if (row.currentPath !== book.path) throw new Error(`Current path mismatch for ${book.slug}: ${row.currentPath} !== ${book.path}`);
  if (!row.targetPath.startsWith('books/')) throw new Error(`Bad target path for ${book.slug}`);
  if (row.targetPath.split(path.sep).length !== 4) throw new Error(`Target path should be books/top/sub/file.md for ${book.slug}`);
  const shelf = row.targetPath.split(path.sep).slice(1, 3).join('/');
  const approvedShelves = new Set([
    '思维科学/决策判断', '思维科学/证据科学', '思维科学/系统复杂', '思维科学/概率风险', '思维科学/行为经济',
    '自我管理/习惯行动', '自我管理/专注效率', '自我管理/学习练习', '自我管理/时间精力', '自我管理/职业发展', '自我管理/表达输出',
    '心理修复/心理通论', '心理修复/情绪内耗', '心理修复/自尊成长', '心理修复/创伤修复', '心理修复/成瘾自控',
    '关系家庭/亲密关系', '关系家庭/沟通冲突', '关系家庭/家庭教育', '关系家庭/儿童发展',
    '职业组织/管理通论', '职业组织/组织领导', '职业组织/权力变革', '职业组织/运营流程', '职业组织/教练协作',
    '商业产品/商业战略', '商业产品/产品管理', '商业产品/创业方法', '商业产品/市场增长', '商业产品/用户体验', '商业产品/商业模式', '商业产品/经营财务',
    '金钱投资/理财入门', '金钱投资/价值投资', '金钱投资/交易系统', '金钱投资/交易心理', '金钱投资/宏观周期', '金钱投资/经济学',
    '社会公共/社会理论', '社会公共/法律公共', '社会公共/政治制度', '社会公共/媒介传播', '社会公共/性别结构', '社会公共/城市环境', '社会公共/技术社会',
    '历史世界/中国历史', '历史世界/世界历史', '历史世界/国际秩序', '历史世界/传记回忆',
    '科技媒介/AI变革', '科技媒介/平台算法', '科技媒介/未来技术', '科技媒介/信息网络',
    '人文艺术/文学阅读', '人文艺术/写作技艺', '人文艺术/叙事创作', '人文艺术/艺术美学', '人文艺术/设计视觉', '人文艺术/人生哲学', '人文艺术/中国哲学', '人文艺术/政治哲学',
    '健康身体/医学生理', '健康身体/营养代谢', '健康身体/睡眠恢复', '健康身体/运动训练', '健康身体/衰老照护',
  ]);
  if (!approvedShelves.has(shelf)) throw new Error(`Unapproved target shelf for ${book.slug}: ${shelf}`);
}
console.log(`ok ${bySlug.size} migration rows`);
NODE
```

Expected:

```text
ok 364 migration rows
```

- [ ] **Step 3: Review the map by domain**

Run:

```bash
awk -F'\t' 'NR>1 { split($3, p, "/"); count[p[2] "/" p[3]]++ } END { for (k in count) print k "\t" count[k] }' docs/book-taxonomy-migration.tsv | sort
```

Expected:

```text
Each target second-level shelf has at least 1 row, and no row targets an old top-level folder.
```

- [ ] **Step 4: Commit the migration map**

```bash
git add docs/book-taxonomy-migration.tsv
git commit -m "docs: map book directory taxonomy migration"
```

## Task 5: Move Books And Rewrite References

**Files:**
- Modify paths: `books/**/*.md`
- Modify: any tracked `*.md` file containing a moved `books/...md` reference

- [ ] **Step 1: Move books with `git mv` from the migration map**

Run:

```bash
git status --short
node --input-type=module <<'NODE'
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const rows = readFileSync('docs/book-taxonomy-migration.tsv', 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map(line => line.split('\t'));

for (const [slug, currentPath, targetPath] of rows) {
  mkdirSync(dirname(targetPath), { recursive: true });
  if (currentPath === targetPath) continue;
  execFileSync('git', ['mv', currentPath, targetPath], { stdio: 'inherit' });
  console.log(`${slug}\t${currentPath}\t${targetPath}`);
}
NODE
```

Expected:

```text
git status shows no unrelated uncommitted changes that would be touched by this task.
Rows print only for files that moved; no git mv command fails.
```

- [ ] **Step 2: Rewrite all tracked Markdown path references**

Run:

```bash
node --input-type=module <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const rows = readFileSync('docs/book-taxonomy-migration.tsv', 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map(line => line.split('\t'));

const replacements = new Map(rows.map(([, currentPath, targetPath]) => [currentPath, targetPath]));
const files = execFileSync('git', ['ls-files', '*.md'], { encoding: 'utf8' })
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);

const changedFiles = [];
for (const file of files) {
  let raw = readFileSync(file, 'utf8');
  const before = raw;
  for (const [from, to] of replacements) {
    raw = raw.split(from).join(to);
  }
  if (raw !== before) {
    writeFileSync(file, raw);
    changedFiles.push(file);
    console.log(file);
  }
}

writeFileSync('/tmp/book-taxonomy-reference-files.txt', `${changedFiles.join('\n')}\n`);
NODE
```

Expected:

```text
Only tracked Markdown files with moved path references are printed.
```

- [ ] **Step 3: Remove empty old directories**

Run:

```bash
find books -type d -empty -delete
find books -type d | sort
```

Expected:

```text
Only the approved target tree remains under books/.
```

- [ ] **Step 4: Verify no old path references remain**

Run:

```bash
node --input-type=module <<'NODE'
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const rows = readFileSync('docs/book-taxonomy-migration.tsv', 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map(line => line.split('\t'));

const files = execFileSync('git', ['ls-files', '*.md'], { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
const stale = [];
for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  for (const [, currentPath, targetPath] of rows) {
    if (currentPath !== targetPath && raw.includes(currentPath)) stale.push(`${file}: ${currentPath}`);
  }
}
if (stale.length) throw new Error(`Stale references:\n${stale.slice(0, 50).join('\n')}`);
console.log('ok no stale moved-path references');
NODE
```

Expected:

```text
ok no stale moved-path references
```

- [ ] **Step 5: Run content validation**

Run:

```bash
node .nextjs-site/scripts/slugify.js --check
node .nextjs-site/scripts/generate-manifest.js
cd .nextjs-site && npm test
```

Expected:

```text
Ignored manifest output is regenerated locally with moved paths, and all tests pass, including book-taxonomy.test.mjs and topics-content.test.mjs.
```

- [ ] **Step 6: Commit the move batch**

```bash
node --input-type=module <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';
const rows = readFileSync('docs/book-taxonomy-migration.tsv', 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map(line => line.split('\t'));
const paths = new Set();
for (const [, currentPath, targetPath] of rows) {
  paths.add(targetPath);
}
for (const file of readFileSync('/tmp/book-taxonomy-reference-files.txt', 'utf8').split(/\r?\n/).filter(Boolean)) {
  paths.add(file);
}
writeFileSync('/tmp/book-taxonomy-stage-files.txt', `${[...paths].join('\n')}\n`);
NODE
git add -u books
git add --pathspec-from-file=/tmp/book-taxonomy-stage-files.txt
git status --short
git commit -m "chore: reorganize book directory taxonomy"
```

Before committing, inspect `git status --short`. Only moved book files and rewritten Markdown reference files should be staged. `.nextjs-site/public/build-manifest.json` may exist locally after regeneration, but it is ignored and must not be staged.

## Task 6: Regenerate And Verify Static Output

**Files:**
- Ignored generated local output: `.nextjs-site/public/build-manifest.json`
- Ignored generated local output: `.nextjs-site/out/`

- [ ] **Step 1: Run full build**

Run:

```bash
cd .nextjs-site && npm run build
```

Expected:

```text
next build completes successfully
pagefind indexes out
```

- [ ] **Step 2: Verify representative book pages still use slug URLs**

Run:

```bash
test -f .nextjs-site/out/books/cong-ling-dao-yi/index.html
test -f .nextjs-site/out/books/shen-du-gong-zuo/index.html
test -f .nextjs-site/out/books/qin-mi-guan-xi/index.html
grep -R "/books/cong-ling-dao-yi/" .nextjs-site/out/sitemap.xml .nextjs-site/public/build-manifest.json
```

Expected:

```text
All test commands exit 0, and grep prints slug-based URLs.
```

- [ ] **Step 3: Verify category navigation reflects the new taxonomy**

Run:

```bash
node --input-type=module <<'NODE'
import { readFileSync } from 'node:fs';
const html = readFileSync('.nextjs-site/out/index.html', 'utf8');
for (const label of ['思维科学', '自我管理', '商业产品', '金钱投资', '人文艺术']) {
  if (!html.includes(label)) throw new Error(`Missing category label on homepage: ${label}`);
}
console.log('ok homepage categories');
NODE
```

Expected:

```text
ok homepage categories
```

- [ ] **Step 4: Confirm generated files remain ignored**

```bash
git status --short --ignored .nextjs-site/public/build-manifest.json .nextjs-site/out | sed -n '1,20p'
```

Expected:

```text
Ignored generated files may appear with !! and no generated file appears staged.
```

## Task 7: Manual Review Checkpoint

**Files:**
- Read only unless issues are found: `books/`, `topics/`, `.nextjs-site/out/`

- [ ] **Step 1: Review the final directory distribution**

Run:

```bash
find books -type f -name '*.md' | awk -F/ '{ count[$2 "/" $3]++ } END { for (k in count) print k "\t" count[k] }' | sort
```

Expected:

```text
Every row is books/<approved top-level>/<approved second-level>; no top-level root book rows exist.
```

- [ ] **Step 2: Review high-risk placements**

Manually inspect these representative books in the migration map:

```text
《原则》: should not be moved repeatedly; choose one primary shelf and rely on tags/topics for other roles.
《黑天鹅》: choose between 思维科学/概率风险 and 金钱投资/宏观周期 based on the primary reader goal.
《影响力》: choose one primary shelf; use topics for marketing, persuasion, and bias roles.
《艺术的故事》: should be under 人文艺术/艺术美学, not writing-only.
《气候经济与人类未来》: should be under 社会公共 or 科技媒介, not 健康身体.
```

Expected:

```text
Each high-risk placement has a clear primary-shelf reason in docs/book-taxonomy-migration.tsv.
```

- [ ] **Step 3: Commit any final corrections**

If manual review finds corrections:

```bash
git status --short
git add docs/book-taxonomy-migration.tsv
git add -u books
git add --pathspec-from-file=/tmp/book-taxonomy-stage-files.txt
git status --short
git commit -m "chore: refine book taxonomy placements"
```

Before committing, inspect `git status --short` and stage only correction files produced by this review pass. Do not stage ignored generated files.

If no corrections are needed:

```bash
git status --short
```

Expected:

```text
No uncommitted changes.
```

## Follow-Up Cleanup: Naming And H1 Drift

This cleanup is intentionally separate from taxonomy migration. Run it after the directory migration is complete, or before it only if the implementer wants to reduce library-format drift first.

Known current filename/frontmatter mismatches:

```text
books/个人成长/布赖恩·费瑟斯通豪-远见.md
books/健康运动/Frances Sizer,Eleanor Whitney-营养学.md
books/健康运动/Randolph M. Nesse,George C. Williams-我们为什么会生病.md
books/写作创意/杰西卡·布鲁迪-Save-the-Cat-写青少年小说.md
books/创业产品/Jake Knapp,John Zeratsky,Braden Kowitz-设计冲刺.md
books/商业管理/詹姆斯·沃麦克-精益思维.md
books/商业管理/财务与估值/卡伦·伯曼,乔·奈特-财务智慧.md
books/心理学/鲁道夫·德雷克斯,薇姬·索尔兹-孩子.md
books/思维方式/丹尼尔·卡尼曼,奥利维耶·西博尼,卡斯·桑斯坦-噪声.md
books/思维方式/富勒,彼得·萨伯-洞穴奇案.md
books/思维方式/理查德·塞勒,卡斯·桑斯坦-助推.md
books/社会科学/Mustafa Suleyman,Michael Bhaskar-即将到来的浪潮.md
books/社会科学/Philip Lymbery,Isabel Oakeshott-失控的农业.md
books/社会科学/李开复,陈楸帆-AI 2041.md
books/社会科学/约翰·梅纳德·凯恩斯-就业利息与货币通论.md
books/社会科学/经济学/大卫·格雷伯-债.md
books/社会科学/经济学/阿比吉特·班纳吉,埃斯特·迪弗洛-贫穷的本质.md
```

Known current H1/title mismatches:

```text
books/社会科学/伊莱·帕里泽-过滤泡.md
books/社会科学/德隆·阿西莫格鲁,詹姆斯·罗宾逊-国家为什么会失败.md
```

Cleanup rule:

```text
For each mismatch, decide whether the filename or frontmatter is the canonical value according to AGENTS.md. Then change exactly the filename, frontmatter title/author, and H1 needed to make the book internally consistent. Preserve slug unless the user explicitly approves a URL change.
```

Verification after cleanup:

```bash
node .nextjs-site/scripts/slugify.js --check
(cd .nextjs-site && npm test)
```

Commit cleanup separately:

```bash
git diff --name-only > /tmp/book-naming-cleanup-files.txt
git add --pathspec-from-file=/tmp/book-naming-cleanup-files.txt
git status --short
git commit -m "chore: normalize book naming metadata"
```

Before committing, inspect `git status --short` and confirm only the naming/H1 cleanup files from the list above are staged.

## Verification Gates

Before declaring the migration complete, run:

```bash
node .nextjs-site/scripts/slugify.js --check
(cd .nextjs-site && npm test && npm run build)
git status --short
```

Required result:

```text
slugify check passes
all node:test suites pass
Next.js build and Pagefind indexing pass
git status shows no uncommitted changes except intentionally ignored generated output
```

## Self-Review

Spec coverage:

- Overall review of current directory structure: covered in Current Audit and Independent Review Consensus.
- Book directory plan: covered in Target Directory Tree and Boundary Rules.
- Multiple independent agent self-review: recorded in Independent Review Consensus, with the one non-root tension resolved explicitly.
- Source-of-truth doc consistency: covered by Task 2 before the taxonomy migration is enforced.
- Implementation safety: covered by Tasks 1-7, with guardrails before moves.
- Pre-existing naming/H1 drift: recorded as a separate follow-up cleanup so taxonomy migration is not blocked by unrelated content normalization.
- Project commit discipline: each task includes a commit step and stages only files owned by that task.

Placeholder scan:

- No `TBD`, `TODO`, `implement later`, or vague "add validation" steps remain.
- Each code-writing step includes concrete code or commands.
- Each verification step includes expected output or expected behavior.

Type and naming consistency:

- Test names use `book-taxonomy.test.mjs` consistently.
- Migration map path is `docs/book-taxonomy-migration.tsv` consistently.
- Public URL invariant is consistently `/books/<frontmatter slug>/`.
- The allowed top-level and second-level shelf lists match the target directory tree.
- The implementation review's blocking concerns were resolved: repo-root snippets import `gray-matter` from `.nextjs-site/node_modules`, shelf-pair validation is explicit, staging is pathspec-based, ignored manifest output is regenerated but not staged, and final verification uses one subshell for `.nextjs-site` commands.
- The final review's naming/H1 blocker was resolved by removing unrelated filename/H1 assertions from taxonomy validation and recording known current drift as a separate cleanup batch.
- The source-of-truth blocker was resolved by adding an explicit task to update `AGENTS.md`, `CLAUDE.md`, and `.nextjs-site/docs/book-format.md` before migration enforcement.
