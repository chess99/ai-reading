import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const siteRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const repoRoot = path.resolve(siteRoot, '..');
const booksDir = path.join(repoRoot, 'books');
const linksPath = path.join(siteRoot, 'data', 'weread-links.json');
const today = new Date().toISOString().slice(0, 10);

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const includeManual = args.has('--include-manual');
const dryRun = args.has('--dry-run');
const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.slice('--limit='.length)) : Infinity;

const digitMap = new Map([
  ['0', '零'],
  ['1', '一'],
  ['2', '二'],
  ['3', '三'],
  ['4', '四'],
  ['5', '五'],
  ['6', '六'],
  ['7', '七'],
  ['8', '八'],
  ['9', '九'],
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(value) {
  return String(value)
    .replace(/\d/g, digit => digitMap.get(digit) || digit)
    .replace(/\[[^\]]+\]|【[^】]+】|（[^）]+）|\([^)]*\)/g, '')
    .replace(/[《》<>〈〉“”"'\s·•・,，.。:：;；!！?？、\-—–_]/g, '')
    .toLowerCase();
}

function authorParts(author) {
  return String(author)
    .split(/[,，、/]/)
    .map(part => normalize(part))
    .filter(part => part.length >= 2);
}

function scanMarkdownFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function loadBooks() {
  return scanMarkdownFiles(booksDir)
    .map(filePath => {
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(raw);
      return {
        slug: data.slug,
        title: data.title,
        author: data.author,
        relativePath: path.relative(repoRoot, filePath).split(path.sep).join('/'),
      };
    })
    .filter(book => book.slug && book.title && book.author)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function loadLinks() {
  if (!fs.existsSync(linksPath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(linksPath, 'utf8'));
}

function parseSearchResults(html) {
  const listItems = html.match(/<li class="wr_bookList_item">[\s\S]*?<\/li>/g) || [];
  return listItems.map(item => {
    const titleMatch = item.match(/<p class="wr_bookList_item_title">([\s\S]*?)<\/p>/);
    const authorMatch = item.match(/<p class="wr_bookList_item_author">([\s\S]*?)<\/p>/);
    const hrefMatch = item.match(/href="([^"]*(?:bookDetail|reader)[^"]*)"/);
    const idMatch =
      item.match(/[?&]amp;ii=([^"&]+)/) ||
      item.match(/[?&]ii=([^"&]+)/) ||
      hrefMatch?.[1]?.match(/\/(?:bookDetail|reader)\/([^?"/]+)/);

    return {
      title: titleMatch ? decodeHtml(titleMatch[1]) : '',
      author: authorMatch ? decodeHtml(authorMatch[1]) : '',
      id: idMatch?.[1] || '',
      href: hrefMatch?.[1]?.replace(/&amp;/g, '&') || '',
    };
  }).filter(result => result.title && result.id);
}

function scoreCandidate(book, candidate) {
  const bookTitle = normalize(book.title);
  const candidateTitle = normalize(candidate.title);
  const bookAuthors = authorParts(book.author);
  const candidateAuthor = normalize(candidate.author);

  let titleScore = 0;
  if (candidateTitle === bookTitle) {
    titleScore = 100;
  } else if (candidateTitle.includes(bookTitle) && bookTitle.length >= 3) {
    titleScore = 80;
  } else if (bookTitle.includes(candidateTitle) && candidateTitle.length >= 3) {
    titleScore = 70;
  }

  const matchedAuthor = candidateAuthor.length >= 2
    ? bookAuthors.find(part => candidateAuthor.includes(part) || part.includes(candidateAuthor))
    : null;
  const authorScore = matchedAuthor ? 30 : 0;

  return {
    score: titleScore + authorScore,
    titleScore,
    authorScore,
  };
}

function pickBestCandidate(book, candidates) {
  const scored = candidates
    .map(candidate => ({ candidate, ...scoreCandidate(book, candidate) }))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best || best.titleScore < 70 || best.authorScore === 0) {
    return null;
  }
  return best;
}

async function fetchCandidates(book) {
  const searchUrl = `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent(book.title)}`;
  const response = await fetch(searchUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
      'accept-language': 'zh-CN,zh;q=0.9',
    },
  });
  if (!response.ok) {
    throw new Error(`WeRead search failed: ${response.status} ${response.statusText}`);
  }
  const html = await response.text();
  return parseSearchResults(html);
}

function writeLinks(links) {
  const ordered = Object.fromEntries(Object.entries(links).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(linksPath, `${JSON.stringify(ordered, null, 2)}\n`);
}

const books = loadBooks();
const links = loadLinks();
let processed = 0;
let found = 0;
let notFound = 0;
let skipped = 0;

for (const book of books) {
  if (links[book.slug]?.note?.startsWith('manual-audit') && !includeManual) {
    skipped++;
    continue;
  }
  if (!force && links[book.slug]) {
    skipped++;
    continue;
  }
  if (processed >= limit) {
    break;
  }

  processed++;
  try {
    const candidates = await fetchCandidates(book);
    const best = pickBestCandidate(book, candidates);
    if (best) {
      const { candidate, score } = best;
      links[book.slug] = {
        status: 'found',
        url: `https://weread.qq.com/web/bookDetail/${candidate.id}`,
        checkedAt: today,
        note: `${candidate.title} / ${candidate.author} / score ${score}`,
      };
      found++;
      console.log(`FOUND ${book.slug}: ${candidate.title} / ${candidate.author}`);
    } else {
      links[book.slug] = {
        status: 'not_found',
        checkedAt: today,
        note: 'No high-confidence WeRead match from title search',
      };
      notFound++;
      console.log(`MISS  ${book.slug}: ${book.title} / ${book.author}`);
    }
  } catch (error) {
    console.log(`ERROR ${book.slug}: ${error.message}`);
  }

  if (!dryRun) {
    writeLinks(links);
  }
  await sleep(350);
}

if (dryRun) {
  console.log('Dry run: weread-links.json was not written.');
} else {
  writeLinks(links);
}

console.log(`Done. processed=${processed} found=${found} not_found=${notFound} skipped=${skipped}`);
