import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildBookTopicIndex, bookPageHash } from '../lib/book-topic-index.mjs';

const known = new Set(['decision', 'other']);
const recommendation = (overrides = {}) => ({
  title: '对赌', slug: 'decision', status: 'in_library', reading: 'next', reason: '本书对当前问题的贡献', ...overrides,
});
const topic = (slug, reading = 'next', overrides = {}) => ({
  slug, title: slug, domains: ['思维'], books: [recommendation({ reading })], ...overrides,
});
const links = topics => buildBookTopicIndex(topics, known).get('decision') || [];
const hash = topics => bookPageHash('book-source-hash', links(topics));

test('only explicit in-library slugs create associations, never same titles or planned slugs', () => {
  const topics = [
    topic('real'),
    topic('planned', 'start', { books: [recommendation({ status: 'planned' })] }),
    topic('same-title', 'start', { books: [recommendation({ slug: 'other' })] }),
    topic('no-link', 'start', { books: [{ title: '对赌', status: 'planned', reading: 'start', reason: '另一位作者的书' }] }),
  ];
  assert.deepEqual(links(topics).map(t => t.slug), ['real']);
  assert.deepEqual(buildBookTopicIndex(topics, known).get('other').map(t => t.slug), ['same-title']);
  assert.equal(buildBookTopicIndex(topics, known).has('missing'), false);
  assert.deepEqual(links([]), []);
});

test('broken in-library references fail instead of emitting misleading links', () => {
  assert.throws(() => buildBookTopicIndex([topic('broken', 'next', { books: [recommendation({ slug: 'missing' })] })], known), /Unknown book reference/);
  assert.throws(() => buildBookTopicIndex([topic('broken', 'next', { books: [recommendation({ slug: undefined })] })], known), /Unknown book reference/);
});

test('rank uses reading purpose, stable domain/title order and no duplicate topic rows', () => {
  const topics = [topic('optional', 'optional'), topic('compare', 'compare'), topic('next', 'next'), topic('start', 'start'), topic('reference', 'reference')];
  assert.deepEqual(links(topics).map(t => t.slug), ['start', 'compare', 'next', 'optional', 'reference']);
  assert.deepEqual(links([...topics].reverse()), links(topics));
  assert.equal(links([topic('duplicate', 'next', { books: [recommendation(), recommendation()] })]).length, 1);
  const domains = [topic('z', 'next', { domains: ['A'] }), topic('a', 'next', { domains: ['B'] })];
  assert.deepEqual(links(domains).map(t => t.slug), ['z', 'a']);
  assert.deepEqual(Object.keys(links(topics)[0]), ['slug', 'title', 'reason']);
});

test('book page hash changes for association additions, removals and visible edits', () => {
  const original = topic('original');
  assert.equal(hash([]), 'book-source-hash');
  assert.notEqual(hash([original]), hash([]));
  assert.notEqual(hash([original, topic('added')]), hash([original]));
  assert.notEqual(hash([original]), hash([{ ...original, title: '改名' }]));
  assert.notEqual(hash([original]), hash([{ ...original, slug: 'new-url' }]));
  assert.notEqual(hash([original]), hash([{ ...original, books: [recommendation({ reason: '新的推荐理由' })] }]));
  assert.notEqual(hash([original]), bookPageHash('changed-book-source', links([original])));
});

test('hash follows displayed order but ignores edits that cannot change the module', () => {
  const original = [topic('a'), topic('z')];
  assert.notEqual(hash(original), hash([topic('a'), topic('z', 'start')]));
  assert.equal(hash(original), hash([...original].reverse()));
  assert.equal(hash(original), hash(original.map(t => ({ ...t, description: '主题的新简介', content: '新的正文', date: '2030-01-01' }))));
  assert.equal(hash(original), hash([...original, topic('unrelated', 'start', { books: [recommendation({ slug: 'other' })] })]));
  assert.equal(hash([topic('a')]), hash([topic('a', 'compare')]));
});

test('server-rendered related topics are placed outside article headings and before tags', () => {
  const client = readFileSync(new URL('../app/books/[slug]/page-client.tsx', import.meta.url), 'utf8');
  const server = readFileSync(new URL('../app/books/[slug]/page.tsx', import.meta.url), 'utf8');
  const component = readFileSync(new URL('../components/BookRelatedTopics.tsx', import.meta.url), 'utf8');
  const manifest = readFileSync(new URL('../scripts/generate-manifest.js', import.meta.url), 'utf8');
  assert.match(client, /relatedTopicCount > 0/);
  assert.match(client, /href="#book-related-topics"/);
  assert.match(client, /<Link href="#book-related-topics" prefetch=\{false\}/);
  assert.match(client, /<div className="markdown-content">\s*\{children\}\s*<\/div>\s*\{relatedTopics\}/);
  assert.ok(client.indexOf('{relatedTopics}') < client.indexOf('{/* Tag chips */}'));
  assert.match(server, /relatedTopics=\{<BookRelatedTopics topics=\{relatedTopics\} \/>\}/);
  assert.doesNotMatch(client, /getTopicsForBook|buildBookTopicIndex|allTopics/);
  assert.match(component, /if \(topics.length === 0\) return null/);
  assert.doesNotMatch(component, /use client|fetch\(|target="_blank"/);
  assert.match(manifest, /buildBookTopicIndex\(details, new Set\(Object.keys\(books\)\)\)/);
  assert.match(manifest, /info.hash = bookPageHash\(info.hash, bookTopics.get\(slug\) \|\| \[\]\)/);
});
