import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadFulltextBatch, searchFulltext } from '../lib/fulltext-search.mjs';
import { rehypeSearchAnchors } from '../lib/search-anchors.mjs';

async function readPage(...args) {
  const batch = await loadFulltextBatch(...args);
  assert.ok(batch.entries.every(entry => entry.status === 'ready'));
  return batch.entries.map(entry => entry.item);
}

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
  assert.equal(results[0], phrase, 'Retain Pagefind objects so worker data callbacks remain alive.');
  assert.equal(results[0].phraseMatch, true);
  assert.equal(results[1].phraseMatch, false);
  assert.equal(downloads, 0);
});

test('explicit phrases retain their meaning and empty input does no search', async () => {
  const calls = [];
  const handle = { id: 'phrase', data: async () => record(0) };
  const pagefind = { search: async query => { calls.push(query); return { results: [handle] }; } };
  assert.equal((await searchFulltext(pagefind, '"长期 投资"'))[0], handle);
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
  const first = await readPage(results, '人物 & 概念');
  assert.equal(first.length, 10);
  assert.deepEqual(downloads, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.equal(new URL(first[0].url, 'https://test.local').searchParams.get('highlight'), '人物 & 概念');
  const next = await readPage(results, '人物 & 概念', 10);
  assert.equal(next[0].id, '10');
  assert.equal(downloads.length, 20);
});

test('result links and snippets target the section containing the full phrase', async () => {
  const items = await readPage([{
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

const record = index => ({ url: `/books/book-${index}/`, meta: { title: `Book ${index}` }, excerpt: 'Text' });

test('a failed or slow result does not hide successful results or change the next cursor', async () => {
  let release;
  const blocked = new Promise(resolve => { release = resolve; });
  let sawLast;
  const progressed = new Promise(resolve => { sawLast = resolve; });
  const delivered = [];
  const results = Array.from({ length: 30 }, (_, index) => ({
    id: String(index), data: async () => {
      if (index === 11) throw new Error('temporary network failure');
      if (index === 12) await blocked;
      return record(index);
    },
  }));
  const pending = loadFulltextBatch(results, '人物', 10, {
    retries: 0,
    onSettled: entry => { delivered.push(entry); if (entry.id === '19') sawLast(); },
  });
  await progressed;
  assert.equal(delivered.filter(entry => entry.status === 'ready').length, 8);
  assert.ok(!delivered.some(entry => entry.id === '12'));
  release();
  const batch = await pending;
  assert.equal(batch.nextOffset, 20);
  assert.deepEqual(batch.entries.map(entry => entry.id), ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19']);
  assert.equal(batch.entries[1].status, 'error');
  assert.equal(batch.entries[2].status, 'ready');
});

test('transient failures retry once and permanent failures remain individually retryable', async () => {
  let attempts = 0;
  const result = { id: 'transient', data: async () => {
    if (++attempts === 1) throw new Error('temporary failure');
    return record(0);
  } };
  const recovered = await loadFulltextBatch([result], '人物', 0, { retryDelayMs: 0 });
  assert.equal(attempts, 2);
  assert.equal(recovered.entries[0].status, 'ready');
  let unavailable = true;
  attempts = 0;
  const persistent = { id: 'failed', data: async () => {
    attempts++;
    if (unavailable) throw new Error('offline');
    return record(1);
  } };
  const failed = await loadFulltextBatch([persistent], '人物', 0, { retryDelayMs: 0 });
  assert.equal(failed.entries[0].status, 'error');
  assert.equal(attempts, 2, 'Stop automatic retries after one extra attempt.');
  unavailable = false;
  const retried = await loadFulltextBatch([persistent], '人物');
  assert.equal(retried.entries[0].status, 'ready');
  assert.equal(retried.entries[0].id, failed.entries[0].id);
});

test('detail requests stay bounded to three concurrent reads', async () => {
  let active = 0;
  let maximum = 0;
  const results = Array.from({ length: 10 }, (_, index) => ({ id: String(index), data: async () => {
    active++;
    maximum = Math.max(maximum, active);
    await new Promise(resolve => setTimeout(resolve, 2));
    active--;
    return record(index);
  } }));
  const batch = await loadFulltextBatch(results, '人物');
  assert.equal(maximum, 3);
  assert.equal(batch.entries.length, 10);
});

test('a stalled request times out without losing the other results', async () => {
  const delivered = [];
  const batch = await loadFulltextBatch([
    { id: 'slow', data: () => new Promise(() => {}) },
    { id: 'ready', data: async () => record(1) },
  ], '人物', 0, { timeoutMs: 20, retries: 0, onSettled: entry => delivered.push(entry) });
  assert.equal(delivered[0].id, 'ready');
  assert.equal(batch.entries[0].status, 'error');
  assert.equal(batch.entries[1].status, 'ready');
});

test('switching queries cancels delivery and prevents further queued reads', async () => {
  const controller = new AbortController();
  let reads = 0;
  const delivered = [];
  const results = Array.from({ length: 10 }, (_, index) => ({ id: String(index), data: () => {
    reads++;
    return new Promise(() => {});
  } }));
  const pending = loadFulltextBatch(results, '人物', 0, { signal: controller.signal, onSettled: entry => delivered.push(entry) });
  await Promise.resolve();
  const aborted = assert.rejects(pending, { name: 'AbortError' });
  controller.abort();
  await aborted;
  assert.equal(reads, 3);
  assert.deepEqual(delivered, []);
});
