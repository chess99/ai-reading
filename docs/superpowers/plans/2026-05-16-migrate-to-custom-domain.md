# Custom Domain Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move deployment from `https://cearl.cc/ai-reading` (GitHub Pages subpath) to `https://reading.cearl.cc` (custom subdomain root).

**Architecture:** Next.js static site exported to `out/`, deployed via GitHub Pages. Currently uses `basePath: '/ai-reading'` in Next.js config and hardcoded `/ai-reading` paths throughout source files. Migration removes the basePath entirely (site serves from `/`) and adds a `CNAME` file so GitHub Pages routes `reading.cearl.cc` to the repo. DNS CNAME record on the domain side must also point `reading` → `chess99.github.io`.

**Tech Stack:** Next.js 15, TypeScript, GitHub Pages, `NEXT_PUBLIC_BASE_PATH` env var, Service Worker (`public/sw.js`)

---

## Affected Files

| File | Change |
|------|--------|
| `.nextjs-site/next.config.ts` | Remove `basePath: '/ai-reading'` |
| `.nextjs-site/public/CNAME` | Create — `reading.cearl.cc` |
| `.nextjs-site/public/sw.js` | `BASE_PATH = '/ai-reading'` → `BASE_PATH = ''` and `CACHE_NAME = 'ai-reading-v1'` → `'reading-v1'` |
| `.nextjs-site/app/layout.tsx` | `/ai-reading/manifest.webmanifest` and `/ai-reading/icon.svg` → `/manifest.webmanifest`, `/icon.svg` |
| `.nextjs-site/app/layout-client.tsx` | Remove `basePath` constant and `swPath`/`scope` construction — use literal `/sw.js` and `/` |
| `.nextjs-site/app/search/search-client.tsx` | Remove `BASE_PATH` constant, hardcoded fallback `/ai-reading` |
| `.nextjs-site/app/books/[slug]/page.tsx` | Remove `basePath` constants, hardcoded fallback `/ai-reading` |
| `.nextjs-site/components/SettingsDialog.tsx` | `/ai-reading/books/${book.slug}/` → `/books/${book.slug}/` |
| `.nextjs-site/components/SearchBar.tsx` | Remove `basePath` constant, hardcoded fallback `/ai-reading` |
| `.nextjs-site/scripts/preview.mjs` | `mountedSiteDir` path: `'ai-reading'` folder name → `'reading'` (matches new subdomain) |
| `CLAUDE.md` | Update deployment section: basePath → no basePath, URL → `reading.cearl.cc` |

**Not changed:** `components/SettingsDialog.tsx:228` GitHub repo link (`github.com/chess99/ai-reading`) — that's a GitHub URL, not a deployed site URL; keep as-is.

---

### Task 1: Remove basePath from Next.js config

**Files:**
- Modify: `.nextjs-site/next.config.ts`

- [ ] **Step 1: Edit `.nextjs-site/next.config.ts`**

Change from:
```ts
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ai-reading',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```
To:
```ts
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

- [ ] **Step 2: Verify**

```bash
grep -n "basePath" .nextjs-site/next.config.ts
```
Expected output: empty (no matches)

- [ ] **Step 3: Commit**

```bash
git add .nextjs-site/next.config.ts
git commit -m "feat: remove basePath for reading.cearl.cc custom domain"
```

---

### Task 2: Add CNAME file for GitHub Pages

**Files:**
- Create: `.nextjs-site/public/CNAME`

**Background:** GitHub Pages reads a `CNAME` file from the deployed site root to know which custom domain to serve. Next.js copies everything from `public/` verbatim into `out/`, so placing `CNAME` in `public/` ensures it's always included in every deploy. Without this file, the custom domain setting in GitHub repository settings gets wiped on each deploy.

- [ ] **Step 1: Create `.nextjs-site/public/CNAME`**

```bash
echo "reading.cearl.cc" > .nextjs-site/public/CNAME
```

- [ ] **Step 2: Verify**

```bash
cat .nextjs-site/public/CNAME
```
Expected output:
```
reading.cearl.cc
```

- [ ] **Step 3: Commit**

```bash
git add .nextjs-site/public/CNAME
git commit -m "feat: add CNAME file for reading.cearl.cc custom domain"
```

---

### Task 3: Update Service Worker BASE_PATH and cache name

**Files:**
- Modify: `.nextjs-site/public/sw.js`

**Background:** The service worker uses `BASE_PATH` to scope which fetch requests it intercepts and what URLs it precaches. With no basePath, all routes are at `/`, so `BASE_PATH` becomes an empty string. The `CACHE_NAME` is changed from `'ai-reading-v1'` to `'reading-v1'` so old cached data is cleared on first load (the SW's activate event deletes all caches not matching `CACHE_NAME`).

- [ ] **Step 1: Edit `.nextjs-site/public/sw.js` lines 1–5**

Change from:
```js
const CACHE_NAME = 'ai-reading-v1';
const BASE_PATH = '/ai-reading';
const MANIFEST_URL = `${BASE_PATH}/build-manifest.json`;
const PRECACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.webmanifest`,
  `${BASE_PATH}/icon.svg`,
];
```
To:
```js
const CACHE_NAME = 'reading-v1';
const BASE_PATH = '';
const MANIFEST_URL = `${BASE_PATH}/build-manifest.json`;
const PRECACHE_URLS = [
  `/`,
  `/manifest.webmanifest`,
  `/icon.svg`,
];
```

- [ ] **Step 2: Verify**

```bash
grep -n "CACHE_NAME\|BASE_PATH\|PRECACHE" .nextjs-site/public/sw.js | head -8
```
Expected:
```
1:const CACHE_NAME = 'reading-v1';
2:const BASE_PATH = '';
3:const MANIFEST_URL = `/build-manifest.json`;
4:const PRECACHE_URLS = [
5:  `/`,
6:  `/manifest.webmanifest`,
7:  `/icon.svg`,
8:];
```

- [ ] **Step 3: Commit**

```bash
git add .nextjs-site/public/sw.js
git commit -m "fix: update service worker BASE_PATH and cache name for root deployment"
```

---

### Task 4: Update hardcoded paths in app/layout.tsx

**Files:**
- Modify: `.nextjs-site/app/layout.tsx`

- [ ] **Step 1: Edit `.nextjs-site/app/layout.tsx`**

Change lines 11–14 from:
```ts
  manifest: '/ai-reading/manifest.webmanifest',
  icons: {
    icon: '/ai-reading/icon.svg',
    apple: '/ai-reading/icon.svg',
  },
```
To:
```ts
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
```

- [ ] **Step 2: Verify**

```bash
grep -n "ai-reading" .nextjs-site/app/layout.tsx
```
Expected output: empty (no matches)

- [ ] **Step 3: Commit**

```bash
git add .nextjs-site/app/layout.tsx
git commit -m "fix: remove /ai-reading prefix from manifest and icon paths"
```

---

### Task 5: Update layout-client.tsx service worker registration

**Files:**
- Modify: `.nextjs-site/app/layout-client.tsx`

- [ ] **Step 1: Check current content around lines 22–30**

```bash
sed -n '18,32p' .nextjs-site/app/layout-client.tsx
```

- [ ] **Step 2: Edit `.nextjs-site/app/layout-client.tsx`**

Find the block:
```ts
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/ai-reading';
    const swPath = `${basePath}/sw.js`;
    const scope = `${basePath}/`;
```
Replace with:
```ts
    const swPath = '/sw.js';
    const scope = '/';
```

- [ ] **Step 3: Verify**

```bash
grep -n "ai-reading\|NEXT_PUBLIC_BASE_PATH\|basePath" .nextjs-site/app/layout-client.tsx
```
Expected output: empty (no matches)

- [ ] **Step 4: Commit**

```bash
git add .nextjs-site/app/layout-client.tsx
git commit -m "fix: use root paths for SW registration in layout-client"
```

---

### Task 6: Update search-client.tsx BASE_PATH

**Files:**
- Modify: `.nextjs-site/app/search/search-client.tsx`

- [ ] **Step 1: Check current line 26**

```bash
sed -n '24,30p' .nextjs-site/app/search/search-client.tsx
```

- [ ] **Step 2: Edit `.nextjs-site/app/search/search-client.tsx`**

Find:
```ts
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/ai-reading';
```
Replace with:
```ts
const BASE_PATH = '';
```

- [ ] **Step 3: Verify**

```bash
grep -n "ai-reading\|NEXT_PUBLIC_BASE_PATH" .nextjs-site/app/search/search-client.tsx
```
Expected output: empty

- [ ] **Step 4: Commit**

```bash
git add .nextjs-site/app/search/search-client.tsx
git commit -m "fix: remove basePath from search client"
```

---

### Task 7: Update books/[slug]/page.tsx basePath constants

**Files:**
- Modify: `.nextjs-site/app/books/[slug]/page.tsx`

- [ ] **Step 1: Check current content**

```bash
grep -n "ai-reading\|basePath\|NEXT_PUBLIC_BASE_PATH" ".nextjs-site/app/books/[slug]/page.tsx"
```
Expected: two `basePath` const declarations at lines ~7 and ~44

- [ ] **Step 2: Edit `.nextjs-site/app/books/[slug]/page.tsx`**

Find all occurrences of:
```ts
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/ai-reading';
```
Replace each with:
```ts
const basePath = '';
```
(There are two occurrences — both need updating.)

- [ ] **Step 3: Verify**

```bash
grep -n "ai-reading\|NEXT_PUBLIC_BASE_PATH" ".nextjs-site/app/books/[slug]/page.tsx"
```
Expected output: empty

- [ ] **Step 4: Commit**

```bash
git add ".nextjs-site/app/books/[slug]/page.tsx"
git commit -m "fix: remove basePath from books slug page"
```

---

### Task 8: Update SettingsDialog.tsx book URL construction

**Files:**
- Modify: `.nextjs-site/components/SettingsDialog.tsx`

- [ ] **Step 1: Check current line 65**

```bash
grep -n "ai-reading" .nextjs-site/components/SettingsDialog.tsx
```

- [ ] **Step 2: Edit `.nextjs-site/components/SettingsDialog.tsx`**

Find:
```ts
    const bookUrls = allBooks.map(book => `/ai-reading/books/${book.slug}/`);
```
Replace with:
```ts
    const bookUrls = allBooks.map(book => `/books/${book.slug}/`);
```

- [ ] **Step 3: Verify**

```bash
grep -n "ai-reading" .nextjs-site/components/SettingsDialog.tsx
```
Expected: only the GitHub repo link at line ~228 remains (`github.com/chess99/ai-reading`) — that is correct to keep.

- [ ] **Step 4: Commit**

```bash
git add .nextjs-site/components/SettingsDialog.tsx
git commit -m "fix: remove /ai-reading prefix from book prefetch URLs"
```

---

### Task 9: Update SearchBar.tsx basePath

**Files:**
- Modify: `.nextjs-site/components/SearchBar.tsx`

- [ ] **Step 1: Check current content**

```bash
grep -n "ai-reading\|basePath\|NEXT_PUBLIC_BASE_PATH" .nextjs-site/components/SearchBar.tsx
```

- [ ] **Step 2: Edit `.nextjs-site/components/SearchBar.tsx`**

Find the block:
```ts
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/ai-reading";
    window.location.href = `${basePath}/books/${randomBook.slug}`;
```
Replace with:
```ts
    window.location.href = `/books/${randomBook.slug}`;
```

- [ ] **Step 3: Verify**

```bash
grep -n "ai-reading\|NEXT_PUBLIC_BASE_PATH" .nextjs-site/components/SearchBar.tsx
```
Expected output: empty

- [ ] **Step 4: Commit**

```bash
git add .nextjs-site/components/SearchBar.tsx
git commit -m "fix: remove basePath from SearchBar random book navigation"
```

---

### Task 10: Update preview.mjs mount directory name

**Files:**
- Modify: `.nextjs-site/scripts/preview.mjs`

**Background:** The local preview script mounts the `out/` directory at `.preview-site/ai-reading/` so that `serve` serves it at `localhost:4173/ai-reading/`, simulating the old subpath deployment. With the new root deployment, this is no longer needed — the out directory should be served directly from root. The mount dir name `'reading'` is used just to keep the preview script internally consistent.

- [ ] **Step 1: Edit `.nextjs-site/scripts/preview.mjs`**

Find:
```js
const mountedSiteDir = path.join(previewRoot, 'ai-reading');
```
Replace with:
```js
const mountedSiteDir = path.join(previewRoot, 'reading');
```

Actually, since there's no longer a subpath, it's cleaner to serve `out/` directly. Replace the full script content:

```js
import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const cwd = process.cwd();
const outDir = path.join(cwd, 'out');
const serveEntry = path.join(cwd, 'node_modules', 'serve', 'build', 'main.js');

if (!existsSync(outDir)) {
  console.error('Missing out/ directory. Run npm run build first.');
  process.exit(1);
}
if (!existsSync(serveEntry)) {
  console.error('Missing serve package. Run npm install first.');
  process.exit(1);
}

const server = spawn(
  process.execPath,
  [serveEntry, outDir, '-l', '4173', '--no-port-switching'],
  {
    stdio: 'inherit',
  }
);

server.on('exit', code => {
  process.exit(code ?? 0);
});
```

- [ ] **Step 2: Verify**

```bash
grep -n "ai-reading" .nextjs-site/scripts/preview.mjs
```
Expected output: empty

- [ ] **Step 3: Commit**

```bash
git add .nextjs-site/scripts/preview.mjs
git commit -m "fix: update preview script to serve from root (no subpath)"
```

---

### Task 11: Update CLAUDE.md deployment section

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Edit `CLAUDE.md`**

Find the deployment section:
```markdown
## 部署

GitHub Pages，仓库名 `ai-reading`，所有路径以 `/ai-reading` 为前缀。
next.config.ts 已配置 `basePath: '/ai-reading'`。
代码中手动拼接路径时统一用 `process.env.NEXT_PUBLIC_BASE_PATH || '/ai-reading'`，不要硬编码裸路径。
```
Replace with:
```markdown
## 部署

GitHub Pages，自定义域名 `reading.cearl.cc`，站点部署在域名根路径 `/`。
next.config.ts 无 `basePath` 配置。
代码中路径直接使用绝对路径（如 `/books/slug/`），不需要拼接前缀。
```

- [ ] **Step 2: Verify**

```bash
grep -n "ai-reading\|basePath\|NEXT_PUBLIC_BASE_PATH" CLAUDE.md
```
Expected output: empty (repo URL in README is fine but CLAUDE.md deployment docs should be clean)

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md to reflect reading.cearl.cc deployment"
```

---

### Task 12: Final verification

**Files:** None modified — read-only checks

- [ ] **Step 1: Confirm no remaining hardcoded `/ai-reading` path prefixes in source**

```bash
grep -rn "/ai-reading" \
  .nextjs-site/app/ \
  .nextjs-site/components/ \
  .nextjs-site/public/sw.js \
  .nextjs-site/scripts/ \
  .nextjs-site/next.config.ts \
  CLAUDE.md 2>/dev/null | grep -v "chess99/ai-reading"
```
Expected output: empty (only the GitHub repo URL `chess99/ai-reading` is acceptable)

- [ ] **Step 2: Confirm CNAME exists and is correct**

```bash
cat .nextjs-site/public/CNAME
```
Expected: `reading.cearl.cc`

- [ ] **Step 3: Local build smoke test**

```bash
cd .nextjs-site && npm run build 2>&1 | tail -20
```
Expected: completes without errors, `out/` directory is created

- [ ] **Step 4: Local preview smoke test**

```bash
cd .nextjs-site && npm run preview
```
Open `http://localhost:4173` in browser. Verify:
- Homepage loads
- A book page loads at `/books/<slug>/`
- Search works

---

### Out-of-scope: DNS setup

After pushing, configure DNS at your domain registrar:
- Add a CNAME record: `reading` → `chess99.github.io`
- In GitHub repo Settings → Pages, confirm the custom domain shows `reading.cearl.cc`
- Wait for DNS propagation (up to 24h; usually minutes)
- GitHub will auto-provision HTTPS via Let's Encrypt once DNS resolves
