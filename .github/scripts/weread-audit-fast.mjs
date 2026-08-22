import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const booksDir = path.join(root, 'books');
const linksPath = path.join(root, '.nextjs-site/data/weread-links.json');
const out = path.join(root, 'weread-audit-fast.json');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const decode = value => String(value || '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const normalize = value => String(value || '')
  .replace(/\[[^\]]+\]|【[^】]+】|（[^）]+）|\([^)]*\)/g, '')
  .replace(/[《》<>〈〉“”"'\s·•・,，.。:：;；!！?？、\-—–_]/g, '').toLowerCase();
const authorParts = value => String(value || '').split(/[,，、/]/).map(normalize).filter(x => x.length >= 2);

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : e.isFile() && e.name.endsWith('.md') ? [p] : [];
  });
}
function fm(raw, key) {
  const block = raw.match(/^---\n([\s\S]*?)\n---/m)?.[1] || '';
  let value = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() || '';
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
  return value;
}
const books = files(booksDir).map(p => {
  const raw = fs.readFileSync(p, 'utf8');
  return { slug: fm(raw, 'slug'), title: fm(raw, 'title'), author: fm(raw, 'author') };
}).filter(b => b.slug && b.title && b.author).sort((a,b) => a.slug.localeCompare(b.slug));
const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));

function score(book, candidate) {
  const bt = normalize(book.title), ct = normalize(candidate.title), ca = normalize(candidate.author);
  const titleScore = ct === bt ? 100 : ct.includes(bt) && bt.length >= 3 ? 80 : bt.includes(ct) && ct.length >= 3 ? 70 : 0;
  const authorScore = authorParts(book.author).some(a => ca.includes(a) || a.includes(ca)) ? 30 : 0;
  return titleScore + authorScore;
}
function searchResults(html) {
  const items = html.match(/<li class="wr_bookList_item">[\s\S]*?<\/li>/g) || [];
  return items.map(item => {
    const title = decode(item.match(/<p class="wr_bookList_item_title">([\s\S]*?)<\/p>/)?.[1]);
    const author = decode(item.match(/<p class="wr_bookList_item_author">([\s\S]*?)<\/p>/)?.[1]);
    const href = item.match(/href="([^"]*(?:bookDetail|reader)[^"]*)"/)?.[1] || '';
    const id = item.match(/[?&]amp;ii=([^"&]+)/)?.[1] || item.match(/[?&]ii=([^"&]+)/)?.[1] || href.match(/\/(?:bookDetail|reader)\/([^?"/]+)/)?.[1] || '';
    return { title, author, id, url: id ? `https://weread.qq.com/web/bookDetail/${id}` : '' };
  }).filter(x => x.title && x.id);
}
function detail(html) {
  const text = decode(html);
  const title = decode(html.match(/<h2[^>]*class="[^"]*wr_bookCover_title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s*-\s*微信读书\s*$/i,'');
  const author = decode(html.match(/<(?:a|p)[^>]*class="[^"]*wr_bookCover_author[^"]*"[^>]*>([\s\S]*?)<\/(?:a|p)>/i)?.[1] || '');
  const publishTime = text.match(/出版时间\s*(\d{4}年(?:\d{1,2}月)?)/)?.[1] || '';
  const charCount = text.match(/字数\s*([\d,.]+\s*[万千]?)\s*字?/)?.[1] || '';
  const available = text.includes('加入书架') && /开始阅读|立即阅读|免费阅读/.test(text) && !/已下架|暂无版权|版权到期|暂不支持阅读|无法阅读|暂不可读/.test(text);
  return { title, author, publishTime, charCount, available };
}
async function get(url) {
  try {
    const r = await fetch(url, { headers: { 'user-agent':'Mozilla/5.0 Chrome/126 Safari/537.36', 'accept-language':'zh-CN,zh;q=0.9' } });
    if (!r.ok) return { error:`${r.status} ${r.statusText}` };
    return { text: await r.text() };
  } catch (e) { return { error:String(e?.message || e) }; }
}

const rows = [];
for (const [i, book] of books.entries()) {
  const entry = links[book.slug] || null;
  const row = { book, entry, current:null, candidates:[], flags:[] };
  if (entry?.status === 'found' && entry.url) {
    const r = await get(entry.url);
    if (r.error) row.flags.push('current_fetch_error');
    else {
      row.current = detail(r.text);
      if (!row.current.available) row.flags.push('current_not_readable');
      if (score(book, row.current) < 100) row.flags.push('current_identity_needs_review');
    }
  }
  const sr = await get(`https://weread.qq.com/web/search/books?keyword=${encodeURIComponent(book.title)}`);
  if (sr.error) row.flags.push('search_error');
  else {
    row.candidates = searchResults(sr.text).map(c => ({...c, score:score(book,c)})).filter(c => c.score >= 100).sort((a,b)=>b.score-a.score).slice(0,8);
    if (entry?.status === 'not_found' && row.candidates.length) row.flags.push('not_found_has_candidate');
    if (entry?.status === 'found' && row.candidates.some(c => c.url !== entry.url)) row.flags.push('alternate_candidate_exists');
  }
  rows.push(row);
  console.log(`[${i+1}/${books.length}] ${book.slug} ${row.flags.join(',') || 'ok'}`);
  await sleep(80);
}
fs.writeFileSync(out, JSON.stringify({generatedAt:new Date().toISOString(), bookCount:books.length, rows}, null, 2));
console.log(`Wrote ${out}`);
