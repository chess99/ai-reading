import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadFulltextBatch, searchFulltext } from '../lib/fulltext-search.mjs';

async function readPage(...args) {
  const batch = await loadFulltextBatch(...args);
  assert.ok(batch.entries.every(entry => entry.status === 'ready'));
  return batch.entries.map(entry => entry.item);
}

const out = resolve(process.argv[2] ?? 'out');
const requests = [];
const originalFetch = globalThis.fetch;
const originalDocument = globalThis.document;
// The browser API reads <html lang>, rather than its options, to select the
// query tokenizer. Keep this headless check aligned with the real zh-CN page.
globalThis.document = {
  currentScript: null,
  querySelector: selector => selector === 'html' ? { getAttribute: () => 'zh-CN' } : null,
};
globalThis.fetch = async input => {
  const path = new URL(String(input), 'https://search.local').pathname;
  const body = await readFile(resolve(out, `.${path}`));
  requests.push({ path, bytes: body.length });
  return new Response(body);
};

let pagefind;
try {
  pagefind = await import(pathToFileURL(resolve(out, 'pagefind/pagefind.js')));
  await pagefind.options({ basePath: '/pagefind/', language: 'zh-cn' });

  const people = await searchFulltext(pagefind, '贝尔纳黛');
  const peopleItems = await readPage(people, '贝尔纳黛');
  assert.equal(peopleItems[0]?.title, '诡秘之主');
  assert.match(peopleItems[0].excerptHtml.replace(/<\/?mark>/g, ''), /贝尔纳黛/);
  const target = new URL(peopleItems[0].url, 'https://search.local');
  assert.ok(target.hash, 'A matching chapter must have a static anchor.');
  const bookHtml = await readFile(resolve(out, 'books/gui-mi-zhi-zhu/index.html'), 'utf8');
  assert.ok(bookHtml.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`));

  const before = requests.filter(request => request.path.includes('/fragment/')).length;
  const broad = await searchFulltext(pagefind, '心理');
  assert.ok(broad.length > 20, 'Use a real query requiring multiple pages.');
  await readPage(broad, '心理');
  const downloaded = requests.filter(request => request.path.includes('/fragment/')).length - before;
  assert.ok(downloaded <= 10, `First page downloaded ${downloaded} fragments.`);
  const second = await readPage(broad, '心理', 10);
  assert.equal(second.length, 10);
  const title = await searchFulltext(pagefind, '诡秘之主');
  assert.equal((await readPage(title, '诡秘之主'))[0]?.title, '诡秘之主');
  assert.ok((await readPage(title, '诡秘之主')).every(item => /^\/(books|topics)\//.test(item.url)));
  assert.equal((await searchFulltext(pagefind, '不存在的人物甲乙丙丁戊己')).length, 0);
  const bell = await searchFulltext(pagefind, '贝尔');
  const seen = new Set();
  for (let cursor = 0; cursor < bell.length;) {
    const batch = await loadFulltextBatch(bell, '贝尔', cursor);
    assert.ok(batch.entries.every(entry => entry.status === 'ready'));
    batch.entries.forEach(entry => {
      assert.ok(!seen.has(entry.id), `Duplicate result: ${entry.id}`);
      seen.add(entry.id);
    });
    assert.ok(batch.nextOffset > cursor);
    cursor = batch.nextOffset;
  }
  assert.equal(seen.size, bell.length);
  console.log(`全文索引验证通过：贝尔纳黛 → 诡秘之主；首批最多 10 条详情；分页、正文范围和章节锚点有效。`);
} finally {
  await pagefind?.destroy();
  globalThis.fetch = originalFetch;
  if (originalDocument === undefined) delete globalThis.document;
  else globalThis.document = originalDocument;
}
