import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const booksDir = path.join(repoRoot, 'books');
const linksPath = path.join(repoRoot, '.nextjs-site', 'data', 'weread-links.json');
const outJson = path.join(repoRoot, 'weread-audit.json');
const outMd = path.join(repoRoot, 'weread-audit.md');

const digitMap = new Map([
  ['0', '零'], ['1', '一'], ['2', '二'], ['3', '三'], ['4', '四'],
  ['5', '五'], ['6', '六'], ['7', '七'], ['8', '八'], ['9', '九'],
]);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(value) {
  return String(value || '')
    .replace(/\d/g, digit => digitMap.get(digit) || digit)
    .replace(/\[[^\]]+\]|【[^】]+】|（[^）]+）|\([^)]*\)/g, '')
    .replace(/[《》<>〈〉“”"'\s·•・,，.。:：;；!！?？、\-—–_]/g, '')
    .toLowerCase();
}

function authorParts(author) {
  return String(author || '')
    .split(/[,，、/]/)
    .map(normalize)
    .filter(part => part.length >= 2);
}

function scoreCandidate(book, candidate) {
  const bookTitle = normalize(book.title);
  const candidateTitle = normalize(candidate.title);
  const bookAuthors = authorParts(book.author);
  const candidateAuthor = normalize(candidate.author);
  let titleScore = 0;
  if (candidateTitle === bookTitle) titleScore = 100;
  else if (candidateTitle.includes(bookTitle) && bookTitle.length >= 3) titleScore = 80;
  else if (bookTitle.includes(candidateTitle) && candidateTitle.length >= 3) titleScore = 70;
  const matchedAuthors = bookAuthors.filter(part => candidateAuthor.includes(part) || part.includes(candidateAuthor));
  const authorScore = matchedAuthors.length > 0 ? 30 : 0;
  return { score: titleScore + authorScore, titleScore, authorScore };
}

function scanMarkdownFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...scanMarkdownFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

function parseScalar(raw) {
  let value = raw.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return value;
}

function readBook(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/m)?.[1] || '';
  const get = key => {
    const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return match ? parseScalar(match[1]) : '';
  };
  return {
    slug: get('slug'),
    title: get('title'),
    author: get('author'),
    path: path.relative(repoRoot, filePath).split(path.sep).join('/'),
  };
}

function loadBooks() {
  return scanMarkdownFiles(booksDir)
    .map(readBook)
    .filter(book => book.slug && book.title && book.author)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.7',
          accept: 'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
      });
      const text = await response.text();
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return { ok: true, status: response.status, text, finalUrl: response.url };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(800 * attempt);
    }
  }
  return { ok: false, error: String(lastError?.message || lastError || 'unknown error') };
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
    const id = idMatch?.[1] || '';
    return {
      title: titleMatch ? decodeHtml(titleMatch[1]) : '',
      author: authorMatch ? decodeHtml(authorMatch[1]) : '',
      id,
      url: id ? `https://weread.qq.com/web/bookDetail/${id}` : '',
    };
  }).filter(item => item.title && item.id);
}

function matchFirst(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }
  return '';
}

function parseDetail(html, url) {
  const text = decodeHtml(html);
  const title = matchFirst(html, [
    /<h2[^>]*class="[^"]*wr_bookCover_title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i,
    /<h2[^>]*>([\s\S]*?)<\/h2>/i,
    /<title[^>]*>([\s\S]*?)<\/title>/i,
  ]).replace(/\s*-\s*微信读书\s*$/i, '');
  const author = matchFirst(html, [
    /<a[^>]*class="[^"]*wr_bookCover_author[^"]*"[^>]*>([\s\S]*?)<\/a>/i,
    /<p[^>]*class="[^"]*wr_bookCover_author[^"]*"[^>]*>([\s\S]*?)<\/p>/i,
  ]);
  const publisher = text.match(/出版社\s*([^\s]{2,40})/)?.[1] || '';
  const publishTime = text.match(/出版时间\s*(\d{4}年(?:\d{1,2}月)?)/)?.[1] || '';
  const hasShelfAction = text.includes('加入书架');
  const hasReadAction = /开始阅读|免费阅读|立即阅读/.test(text);
  const unavailableHint = /已下架|暂无版权|版权到期|暂不支持阅读|无法阅读|暂不可读/.test(text);
  return {
    url,
    title,
    author,
    publisher,
    publishTime,
    hasShelfAction,
    hasReadAction,
    unavailableHint,
    available: hasShelfAction && hasReadAction && !unavailableHint,
  };
}

function yearOf(value) {
  const match = String(value || '').match(/(\d{4})/);
  return match ? Number(match[1]) : null;
}

const books = loadBooks();
const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
const rows = [];

console.log(`Auditing ${books.length} books...`);

for (const [index, book] of books.entries()) {
  const entry = links[book.slug] || null;
  const row = { book, entry, current: null, searchError: null, candidates: [], reviewReasons: [] };

  if (!entry) row.reviewReasons.push('missing_link_entry');

  if (entry?.status === 'found' && entry.url) {
    const currentFetch = await fetchText(entry.url);
    if (currentFetch.ok) {
      row.current = parseDetail(currentFetch.text, entry.url);
      if (!row.current.available) row.reviewReasons.push('current_not_readable');
      const scoredCurrent = scoreCandidate(book, row.current);
      if (scoredCurrent.titleScore < 70 || scoredCurrent.authorScore === 0) {
        row.reviewReasons.push('current_title_or_author_mismatch');
      }
    } else {
      row.current = { url: entry.url, fetchError: currentFetch.error };
      row.reviewReasons.push('current_fetch_error');
    }
    await sleep(180);
  }

  const searchUrl = `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent(book.title)}`;
  const searchFetch = await fetchText(searchUrl);
  if (!searchFetch.ok) {
    row.searchError = searchFetch.error;
    row.reviewReasons.push('search_error');
  } else {
    const searchCandidates = parseSearchResults(searchFetch.text)
      .map(candidate => ({ ...candidate, ...scoreCandidate(book, candidate) }))
      .filter(candidate => candidate.titleScore >= 70 && candidate.authorScore > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    for (const candidate of searchCandidates) {
      const detailFetch = await fetchText(candidate.url);
      let detail;
      if (detailFetch.ok) detail = parseDetail(detailFetch.text, candidate.url);
      else detail = { url: candidate.url, fetchError: detailFetch.error, available: false };
      row.candidates.push({ ...candidate, detail });
      await sleep(180);
    }
  }

  const availableCandidates = row.candidates.filter(candidate => candidate.detail?.available);
  if (entry?.status === 'not_found' && availableCandidates.length > 0) {
    row.reviewReasons.push('not_found_now_has_candidate');
  }
  if (entry?.status === 'found' && row.current && !row.current.available && availableCandidates.length > 0) {
    row.reviewReasons.push('replacement_candidate_available');
  }
  if (entry?.status === 'found' && row.current?.available) {
    const currentYear = yearOf(row.current.publishTime);
    const newer = availableCandidates.find(candidate => {
      if (candidate.url === entry.url) return false;
      const candidateYear = yearOf(candidate.detail?.publishTime);
      return currentYear && candidateYear && candidateYear >= currentYear + 2;
    });
    if (newer) row.reviewReasons.push('newer_available_edition_exists');
  }

  row.reviewReasons = [...new Set(row.reviewReasons)];
  rows.push(row);
  console.log(`[${index + 1}/${books.length}] ${book.slug} ${row.reviewReasons.join(',') || 'ok'}`);
  await sleep(220);
}

const report = {
  generatedAt: new Date().toISOString(),
  bookCount: books.length,
  foundCount: Object.values(links).filter(entry => entry?.status === 'found').length,
  notFoundCount: Object.values(links).filter(entry => entry?.status === 'not_found').length,
  reviewCount: rows.filter(row => row.reviewReasons.length > 0).length,
  rows,
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);

const reviewRows = rows.filter(row => row.reviewReasons.length > 0);
const md = [
  '# WeRead audit helper report',
  '',
  `Generated: ${report.generatedAt}`,
  `Books: ${report.bookCount}; found: ${report.foundCount}; not_found: ${report.notFoundCount}; review flags: ${report.reviewCount}`,
  '',
  '> This report is evidence for AI review only. It does not make or apply mapping decisions.',
  '',
  '## Review queue',
  '',
  ...reviewRows.flatMap(row => {
    const candidateLines = row.candidates.map(candidate => {
      const d = candidate.detail || {};
      return `  - ${candidate.title} / ${candidate.author} / ${candidate.url} / available=${Boolean(d.available)} / ${d.publishTime || ''}`;
    });
    return [
      `### ${row.book.title} (${row.book.slug})`,
      `- Author: ${row.book.author}`,
      `- Existing: ${row.entry?.status || 'missing'}${row.entry?.url ? ` / ${row.entry.url}` : ''}`,
      `- Current detail: ${row.current?.title || ''} / ${row.current?.author || ''} / available=${Boolean(row.current?.available)} / ${row.current?.publishTime || ''}${row.current?.fetchError ? ` / error=${row.current.fetchError}` : ''}`,
      `- Flags: ${row.reviewReasons.join(', ')}`,
      '- Candidates:',
      ...(candidateLines.length ? candidateLines : ['  - none']),
      '',
    ];
  }),
].join('\n');

fs.writeFileSync(outMd, md);
console.log(`Wrote ${outJson} and ${outMd}`);
