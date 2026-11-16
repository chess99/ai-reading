import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import { getUpdateKind } from '../lib/pwa-updates.ts';

const rendered = { app: 'app-1', library: 'library-1', content: 'book-1' };
const manifest = {
  version: 'build-2', appVersion: 'app-1', contentVersion: 'library-2',
  content: { '/books/example/': { hash: 'book-1' } },
};

test('new books prompt on library pages without interrupting an unchanged article', () => {
  assert.equal(getUpdateKind(manifest, rendered, '/books/example'), null);
  assert.equal(getUpdateKind(manifest, rendered, '/books/example/'), null);
  assert.equal(getUpdateKind(manifest, rendered, '/'), 'library');
  assert.equal(getUpdateKind(manifest, rendered, '/library/'), 'library');
  assert.equal(getUpdateKind(manifest, rendered, '/topics'), 'library');
});

test('current article edits, removals, topic edits and app changes can be applied explicitly', () => {
  assert.equal(getUpdateKind({ ...manifest, content: { '/books/example/': { hash: 'book-2' } } }, rendered, '/books/example'), 'content');
  assert.equal(getUpdateKind({ ...manifest, content: {} }, rendered, '/books/example'), 'content');
  assert.equal(getUpdateKind({ ...manifest, content: { '/topics/example/': { hash: 'topic-2' } } }, rendered, '/topics/example/'), 'content');
  assert.equal(getUpdateKind({ ...manifest, appVersion: 'app-2' }, rendered, '/books/example'), 'app');
  assert.equal(getUpdateKind({ ...manifest, contentVersion: 'library-1' }, rendered, '/'), null);
});

function workerHarness() {
  const handlers = {};
  const entries = new Map();
  const messages = [];
  let skipCount = 0;
  let requests = 0;
  let fetchImpl = async () => new Response('new content');
  const key = request => new URL(typeof request === 'string' ? request : request.url, 'https://example.test').href;
  const cache = {
    match: async request => entries.get(key(request))?.clone(),
    put: async (request, response) => { entries.set(key(request), response.clone()); },
    addAll: async () => {},
  };
  const self = {
    location: { origin: 'https://example.test' },
    clients: { claim: async () => {} },
    skipWaiting: async () => { skipCount++; },
    addEventListener: (type, handler) => { handlers[type] = handler; },
  };
  vm.runInNewContext(readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8'), {
    self, caches: { open: async () => cache, keys: async () => [], delete: async () => {} },
    fetch: async (...args) => { requests++; return fetchImpl(...args); },
    URL, Response, setTimeout, clearTimeout,
  });
  return {
    entries, messages, cache,
    get skipCount() { return skipCount; },
    get requests() { return requests; },
    setFetch: impl => { fetchImpl = impl; },
    async dispatch(type, values = {}) {
      const pending = [];
      let response;
      handlers[type]({
        waitUntil: promise => pending.push(promise),
        respondWith: promise => { response = promise; },
        source: { postMessage: message => messages.push(message) },
        ...values,
      });
      const result = response ? await response : undefined;
      await Promise.all(pending);
      return result;
    },
  };
}

test('installed workers wait for user action; activation can be explicitly requested', async () => {
  const sw = workerHarness();
  await sw.dispatch('install');
  assert.equal(sw.skipCount, 0);
  await sw.dispatch('message', { data: { type: 'SKIP_WAITING' } });
  assert.equal(sw.skipCount, 1);
});

test('online navigation returns fresh HTML and offline navigation preserves the cached article', async () => {
  const sw = workerHarness();
  const request = { url: 'https://example.test/books/example/', mode: 'navigate', method: 'GET' };
  await sw.cache.put(request, new Response('old content'));
  assert.equal(await (await sw.dispatch('fetch', { request })).text(), 'new content');
  sw.setFetch(async () => { throw new Error('offline'); });
  assert.equal(await (await sw.dispatch('fetch', { request })).text(), 'new content');
});

test('a full cache does not discard freshly downloaded online pages', async () => {
  const sw = workerHarness();
  sw.cache.put = async () => { throw new Error('Quota exceeded'); };
  const request = { url: 'https://example.test/books/example/', mode: 'navigate', method: 'GET' };
  assert.equal(await (await sw.dispatch('fetch', { request })).text(), 'new content');
});

test('version checks bypass caches, while content-addressed assets can be read offline', async () => {
  const sw = workerHarness();
  const request = { url: 'https://example.test/build-manifest.json', method: 'GET' };
  await sw.cache.put(request, new Response('stale manifest'));
  assert.equal(await (await sw.dispatch('fetch', { request })).text(), 'new content');
  const asset = { url: 'https://example.test/_next/static/chunks/hash.js', method: 'GET', headers: new Headers() };
  await sw.cache.put(asset, new Response('cached JS'));
  const before = sw.requests;
  assert.equal(await (await sw.dispatch('fetch', { request: asset })).text(), 'cached JS');
  assert.equal(sw.requests, before);
});

test('update readiness is acknowledged only after a successful page download and cache write', async () => {
  const sw = workerHarness();
  const data = { type: 'PREPARE_UPDATE', data: { url: 'https://example.test/books/example/' } };
  await sw.dispatch('message', { data });
  assert.equal(sw.messages.at(-1).type, 'UPDATE_READY');
  assert.equal(await (await sw.cache.match(data.data.url)).text(), 'new content');
  sw.setFetch(async () => new Response('server error', { status: 503 }));
  await sw.dispatch('message', { data });
  assert.equal(sw.messages.at(-1).type, 'UPDATE_FAILED');
  assert.equal(await (await sw.cache.match(data.data.url)).text(), 'new content');
  await sw.dispatch('message', { data: { ...data, data: { url: 'https://other.test/' } } });
  assert.equal(sw.messages.at(-1).type, 'UPDATE_FAILED');
});

test('installed app permits all orientations allowed by the system', () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));
  assert.equal(manifest.orientation, 'any');
});
