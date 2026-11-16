import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadFulltextPage, searchFulltext } from '../lib/fulltext-search.mjs';

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
  const peopleItems = await loadFulltextPage(people, '贝尔纳黛');
  assert.equal(peopleItems[0]?.title, '诡秘之主');
  assert.match(peopleItems[0].excerptHtml.replace(/<\/?mark>/g, ''), /贝尔纳黛/);
  const target = new URL(peopleItems[0].url, 'https://search.local');
  assert.ok(target.hash, 'A matching chapter must have a static anchor.');
  const bookHtml = await readFile(resolve(out, 'books/gui-mi-zhi-zhu/index.html'), 'utf8');
  assert.ok(bookHtml.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`));

  const before = requests.filter(request => request.path.includes('/fragment/')).length;
  const broad = await searchFulltext(pagefind, '心理');
  assert.ok(broad.length > 20, 'Use a real query requiring multiple pages.');
  await loadFulltextPage(broad, '心理');
  const downloaded = requests.filter(request => request.path.includes('/fragment/')).length - before;
  assert.ok(downloaded <= 10, `First page downloaded ${downloaded} fragments.`);
  const second = await loadFulltextPage(broad, '心理', 10);
  assert.equal(second.length, 10);
  const title = await searchFulltext(pagefind, '诡秘之主');
  assert.equal((await loadFulltextPage(title, '诡秘之主'))[0]?.title, '诡秘之主');
  assert.ok((await loadFulltextPage(title, '诡秘之主')).every(item => /^\/(books|topics)\//.test(item.url)));
  assert.equal((await searchFulltext(pagefind, '不存在的人物甲乙丙丁戊己')).length, 0);
  console.log(`全文索引验证通过：贝尔纳黛 → 诡秘之主；首批最多 10 条详情；分页、正文范围和章节锚点有效。`);
} finally {
  await pagefind?.destroy();
  globalThis.fetch = originalFetch;
  if (originalDocument === undefined) delete globalThis.document;
  else globalThis.document = originalDocument;
}
