import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const siteRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const repoRoot = path.resolve(siteRoot, '..');
const booksDir = path.join(repoRoot, 'books');
const linksPath = path.join(siteRoot, 'data', 'weread-links.json');

const args = new Set(process.argv.slice(2));
const candidatesOnly = args.has('--candidates');
const includeReviewed = args.has('--include-reviewed');
const slugArg = process.argv.find(arg => arg.startsWith('--slug='));
const targetSlug = slugArg ? slugArg.slice('--slug='.length).trim() : '';
const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.slice('--limit='.length)) : Infinity;

if (candidatesOnly && !targetSlug) {
  throw new Error('--candidates requires --slug=<slug>');
}

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

function scoreCandidates(book, candidates) {
  return candidates
    .map(candidate => ({ candidate, ...scoreCandidate(book, candidate) }))
    .sort((a, b) => b.score - a.score);
}

function printCandidates(book, currentEntry, candidates) {
  console.log(`BOOK ${book.slug}: ${book.title} / ${book.author}`);
  console.log(`CURRENT ${JSON.stringify(currentEntry ?? null)}`);
  const scored = scoreCandidates(book, candidates);
  if (scored.length === 0) {
    console.log('CANDIDATES []');
    return;
  }

  for (const [index, item] of scored.entries()) {
    console.log(JSON.stringify({
      rank: index + 1,
      title: item.candidate.title,
      author: item.candidate.author,
      url: `https://weread.qq.com/web/bookDetail/${item.candidate.id}`,
      score: item.score,
      titleScore: item.titleScore,
      authorScore: item.authorScore,
    }));
  }
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

const allBooks = loadBooks();
const links = loadLinks();
let books;

if (targetSlug) {
  books = allBooks.filter(book => book.slug === targetSlug);
  if (books.length === 0) {
    throw new Error(`Unknown book slug: ${targetSlug}`);
  }
} else if (includeReviewed) {
  books = allBooks;
} else {
  books = allBooks.filter(book => !(book.slug in links));
}

let processed = 0;
let skipped = allBooks.length - books.length;
let errors = 0;

for (const book of books) {
  if (processed >= limit) {
    break;
  }
  processed++;
  try {
    const candidates = await fetchCandidates(book);
    printCandidates(book, links[book.slug], candidates);
  } catch (error) {
    errors++;
    console.log(`ERROR ${book.slug}: ${error.message}`);
  }
  await sleep(350);
}

console.log('Review-only mode: weread-links.json was not written.');
console.log('An agent must inspect the real detail page, current readability, title/author identity, and plausible alternate editions before recording found or not_found.');
console.log(`Done. processed=${processed} skipped=${skipped} errors=${errors}`);

if (errors > 0) {
  process.exitCode = 1;
}
