import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getReadingHistory } from '../lib/reading-state.ts';

test('已有阅读历史迁移到新书页，并按原顺序去重', () => {
  const historyKey = 'reading-state-history';
  const expected = {
    bookSlug: 'sao-di-chu-men',
    bookTitle: '扫地出门',
    bookAuthor: '马修·德斯蒙德',
    timestamp: 300,
  };
  const other = {
    bookSlug: 'shen-du-gong-zuo',
    bookTitle: '深度工作',
    bookAuthor: '卡尔·纽波特',
    timestamp: 100,
  };
  const storage = new Map([[historyKey, JSON.stringify([
    { ...expected, bookSlug: 'zhu-chu', bookTitle: '逐出' },
    { ...expected, timestamp: 200 },
    other,
  ])]]);
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: key => storage.get(key),
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key),
    },
  });
  try {
    assert.deepEqual(getReadingHistory(), [expected, other]);
    assert.deepEqual(JSON.parse(storage.get(historyKey)), [expected, other]);
  } finally {
    delete globalThis.window;
    delete globalThis.localStorage;
  }
});
