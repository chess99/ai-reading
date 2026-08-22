import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const booksDir = path.join(root, 'books');
const queue = new Set(JSON.parse(fs.readFileSync(path.join(root, '.github/scripts/weread-unreadable-slugs.json'), 'utf8')));
const out = path.join(root, 'weread-audit-fast.json');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const decode = value => String(value || '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const normalize = value => String(value || '')
  .replace(/\[[^\]]+\]|【[^】]+】|（[^）]+）|\([^)]*\)/g, '')
  .replace(/[《》<>〈〉“”"'\s·•・,，.。:：;；!！?？、\-—–_]/g, '').toLowerCase();
const authorParts = value => String(value || '').split(/[,，、/]/).map(decode).map(x => x.replace(/^\[[^\]]+\]/, '')).map(x => x.trim()).filter(x => x.length >= 2);

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? files(full) : entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}
function fm(raw, key) {
  const block = raw.match(/^---\n([\s\S]*?)\n---/m)?.[1] || '';
  let value = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() || '';
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
  return value;
}
const books = files(booksDir).map(file => {
  const raw = fs.readFileSync(file, 'utf8');
  return { slug: fm(raw, 'slug'), title: fm(raw, 'title'), author: fm(raw, 'author') };
}).filter(book => queue.has(book.slug)).sort((a,b) => a.slug.localeCompare(b.slug));

function searchResults(html) {
  const items = html.match(/<li class="wr_bookList_item">[\s\S]*?<\/li>/g) || [];
  return items.map(item => {
    const title = decode(item.match(/<p class="wr_bookList_item_title">([\s\S]*?)<\/p>/)?.[1]);
    const author = decode(item.match(/<p class="wr_bookList_item_author">([\s\S]*?)<\/p>/)?.[1]);
    const href = item.match(/href="([^"]*(?:bookDetail|reader)[^"]*)"/)?.[1] || '';
    const id = item.match(/[?&]amp;ii=([^"&]+)/)?.[1] || item.match(/[?&]ii=([^"&]+)/)?.[1] || href.match(/\/(?:bookDetail|reader)\/([^?"/]+)/)?.[1] || '';
    return { title, author, id, url: id ? `https://weread.qq.com/web/bookDetail/${id}` : '' };
  }).filter(item => item.title && item.id);
}
async function search(keyword) {
  try {
    const response = await fetch(`https://weread.qq.com/web/search/books?keyword=${encodeURIComponent(keyword)}`, {
      headers: {
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
        'accept-language':'zh-CN,zh;q=0.9',
      },
    });
    if (!response.ok) return { error: `${response.status} ${response.statusText}`, results: [] };
    return { results: searchResults(await response.text()) };
  } catch (error) {
    return { error: String(error?.message || error), results: [] };
  }
}
function looksSameAuthor(book, candidate) {
  const ca = normalize(candidate.author);
  return authorParts(book.author).some(part => {
    const p = normalize(part);
    return p && (ca.includes(p) || p.includes(ca));
  });
}
function titleRelation(book, candidate) {
  const bt = normalize(book.title);
  const ct = normalize(candidate.title);
  if (ct === bt) return 'exact';
  if (ct.includes(bt) || bt.includes(ct)) return 'contains';
  return 'renamed_or_other_work';
}

const rows = [];
for (const [index, book] of books.entries()) {
  const keywords = [book.title, ...authorParts(book.author)].filter((value, i, arr) => value && arr.indexOf(value) === i);
  const merged = new Map();
  const errors = [];
  for (const keyword of keywords) {
    const response = await search(keyword);
    if (response.error) errors.push(`${keyword}: ${response.error}`);
    for (const candidate of response.results) {
      if (!merged.has(candidate.url)) merged.set(candidate.url, candidate);
    }
    await sleep(100);
  }
  const authorMatched = [...merged.values()]
    .filter(candidate => looksSameAuthor(book, candidate))
    .map(candidate => ({ ...candidate, relation: titleRelation(book, candidate) }))
    .slice(0, 30);
  rows.push({ book, keywords, errors, candidates: authorMatched });
  console.log(`[${index + 1}/${books.length}] ${book.slug} candidates=${authorMatched.length} errors=${errors.length}`);
}

fs.writeFileSync(out, `${JSON.stringify({ generatedAt: new Date().toISOString(), bookCount: books.length, rows }, null, 2)}\n`);
console.log(`Wrote ${out}`);
