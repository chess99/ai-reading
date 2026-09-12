import assert from 'node:assert/strict';
import { test } from 'node:test';
import { filterTopics, normalizeTopicSearch } from '../lib/topic-discovery.ts';
const topics = [
  { slug: 'care', title: '照护', description: '患者意愿', entry: '长期照顾家人', domains: ['健康', '关系'], searchText: 'the soul of care 阿瑟 克莱曼' },
  { slug: 'science', title: '物理世界', description: '时空与量子', entry: '物理阅读', domains: ['科学'], searchText: 'seven brief lessons' },
  { slug: 'anxiety', title: '理解焦虑', description: '求助与恢复', entry: '持续困扰', domains: ['心理', '健康'], searchText: 'anxiety workbook' },
];
test('topics can be discovered through every assigned domain without a parent', () => {
  assert.deepEqual(filterTopics(topics, '', '关系').map(t => t.slug), ['care']);
  assert.deepEqual(filterTopics(topics, '', '健康').map(t => t.slug), ['care', 'anxiety']);
});
test('search matches all terms, original titles, full-width text and entry situations', () => {
  assert.equal(normalizeTopicSearch('  ＡＩ   Work  '), 'ai work');
  assert.deepEqual(filterTopics(topics, 'SOUL care').map(t => t.slug), ['care']);
  assert.deepEqual(filterTopics(topics, '长期 家人').map(t => t.slug), ['care']);
  assert.deepEqual(filterTopics(topics, '焦虑', '科学'), []);
  assert.deepEqual(filterTopics(topics, '   '), topics);
  assert.deepEqual(filterTopics(topics, 'does not exist'), []);
});
