import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadFulltextPage, searchFulltext } from '../lib/fulltext-search.mjs';
import { rehypeSearchAnchors } from '../lib/search-anchors.mjs';

test('full phrase matches precede word matches without downloading documents', async () => {
  let downloads = 0;
  const result = id => ({ id, data: () => { downloads++; } });
  const phrase = result('novel');
  const words = result('novel');
  const calls = [];
  const results = await searchFulltext({ search: async query => {
    calls.push(query);
    return { results: query.startsWith('"') ? [phrase] : [result('other'), words] };
  } }, ' 贝尔纳黛 ');
  assert.deepEqual(calls, ['"贝尔纳黛"', '贝尔纳黛']);
  assert.deepEqual(results.map(result => result.id), ['novel', 'other']);
  assert.equal(results[0].data, phrase.data, 'Retain the phrase result locations and excerpt.');
  assert.equal(results[0].phraseMatch, true);
  assert.equal(results[1].phraseMatch, false);
  assert.equal(downloads, 0);
});

test('explicit phrases retain their meaning and empty input does no search', async () => {
  const calls = [];
  const pagefind = { search: async query => { calls.push(query); return { results: [] }; } };
  await searchFulltext(pagefind, '"长期 投资"');
  await searchFulltext(pagefind, '   ');
  assert.deepEqual(calls, ['"长期 投资"']);
});

test('page loading fetches only ten details and keeps later pages lazy', async () => {
  const downloads = [];
  const results = Array.from({ length: 53 }, (_, index) => ({
    id: String(index),
    data: async () => {
      downloads.push(index);
      return { url: `/books/book-${index}/`, meta: { title: `Book ${index}` }, excerpt: 'Text' };
    },
  }));
  const first = await loadFulltextPage(results, '人物 & 概念');
  assert.equal(first.length, 10);
  assert.deepEqual(downloads, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.equal(new URL(first[0].url, 'https://test.local').searchParams.get('highlight'), '人物 & 概念');
  const next = await loadFulltextPage(results, '人物 & 概念', 10);
  assert.equal(next[0].id, '10');
  assert.equal(downloads.length, 20);
});

test('result links and snippets target the section containing the full phrase', async () => {
  const items = await loadFulltextPage([{
    id: 'novel',
    data: async () => ({
      url: '/books/gui-mi-zhi-zhu/', meta: { title: '诡秘之主' }, excerpt: 'Whole book',
      sub_results: [
        { url: '/books/gui-mi-zhi-zhu/#wrong', title: '其他人物', excerpt: '<mark>贝尔</mark>', locations: [1, 2, 3, 4] },
        { url: '/books/gui-mi-zhi-zhu/#right', title: '神秘女王', excerpt: '她是<mark>贝尔</mark><mark>纳</mark><mark>黛</mark>。', locations: [5, 6, 7] },
      ],
    }),
  }], '贝尔纳黛');
  const url = new URL(items[0].url, 'https://test.local');
  assert.equal(url.hash, '#right');
  assert.equal(items[0].title, '诡秘之主');
  assert.equal(items[0].section, '神秘女王');
  assert.match(items[0].excerptHtml, /<mark>纳<\/mark>/);
});

test('build-time heading anchors remain unique and retain existing anchors', () => {
  const heading = (value, id) => ({ type: 'element', tagName: 'h2', properties: id ? { id } : {}, children: [{ type: 'text', value }] });
  const tree = { type: 'root', children: [heading('重复标题'), heading('重复标题'), heading('重复标题', '重复标题-2'), heading('') ] };
  rehypeSearchAnchors()(tree);
  assert.deepEqual(tree.children.map(node => node.properties.id), ['重复标题', '重复标题-3', '重复标题-2', 'heading']);
});
