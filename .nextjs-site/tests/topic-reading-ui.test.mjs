import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { remarkTopicBookLinks, topicBookHref } from '../lib/topic-book-links.ts';
const books = [
  { title: '远见：如何规划职业生涯3大阶段', slug: 'yuan-jian', status: 'in_library' },
  { title: '对赌', status: 'planned' },
];
test('inline book titles link to available notes or real recommendation anchors', () => {
  const tree = { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value: '读《远见》，再读《对赌》。' }] }] };
  remarkTopicBookLinks(books)(tree);
  assert.deepEqual(tree.children[0].children.filter(n => n.type === 'link').map(n => n.url), ['/books/yuan-jian/', '#book-2']);
  assert.equal(topicBookHref(books[1], 1), '#book-2');
});
test('existing links and code are never rewritten into nested links', () => {
  const tree = { type: 'root', children: [{ type: 'link', url: '/original', children: [{ type: 'text', value: '《对赌》' }] }, { type: 'code', value: '《远见》' }] };
  const expected = structuredClone(tree);
  remarkTopicBookLinks(books)(tree);
  assert.deepEqual(tree, expected);
});
test('entry points appear before the guide and pending notes have visible status', () => {
  const source = readFileSync(new URL('../app/topics/[slug]/page.tsx', import.meta.url), 'utf8');
  const card = readFileSync(new URL('../components/TopicBookCard.tsx', import.meta.url), 'utf8');
  assert.ok(source.indexOf('id="starting-books"') < source.indexOf('<ReactMarkdown'));
  assert.match(source, /href="#reading-list"/);
  assert.match(card, /解读待补/);
  assert.match(card, /aria-label=\{`打开《\$\{book.title\}》`\}/);
  assert.match(source, /getTopicLegacyRoute/);
  assert.match(source, /index: false, follow: true/);
  assert.match(source, /getRelatedTopics/);
  assert.match(source, /eventAction: 'share_topic'/);
});
test('home topic carousel keeps a direct all-topics entry', () => {
  const source = readFileSync(new URL('../components/TopicReading.tsx', import.meta.url), 'utf8');
  assert.match(source, /全部主题/);
  assert.match(source, /继续浏览/);
});
