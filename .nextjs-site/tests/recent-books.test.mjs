import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getNextBeijingMidnight, selectRecentBooks } from '../lib/recent-books.mjs';

const now = Date.parse('2026-10-29T04:00:00Z');
const book = (slug, date) => ({ slug, addedAt: Date.parse(date), title: slug });

test('recent updates include every book in the window without a count limit', () => {
  const recent = Array.from({ length: 40 }, (_, index) => book(`recent-${index}`, '2026-10-28'));
  const result = selectRecentBooks([...recent, book('older', '2026-09-29')], now);
  assert.equal(result.length, 40);
  assert.deepEqual(new Set(result.map(item => item.slug)), new Set(recent.map(item => item.slug)));
});

test('a short recent list is not padded with older books', () => {
  const result = selectRecentBooks([
    book('older', '2026-09-29'),
    book('recent-1', '2026-10-26'),
    book('recent-2', '2026-10-28'),
    book('recent-3', '2026-10-27'),
  ], now);
  assert.deepEqual(result.map(item => item.slug), ['recent-2', 'recent-3', 'recent-1']);
});

test('only an empty recent window falls back to the latest eight books', () => {
  const older = Array.from({ length: 12 }, (_, index) => book(`older-${index}`, `2026-09-${10 + index}`));
  assert.deepEqual(
    selectRecentBooks(older, now).map(item => item.slug),
    ['older-11', 'older-10', 'older-9', 'older-8', 'older-7', 'older-6', 'older-5', 'older-4'],
  );
  assert.equal(selectRecentBooks(older.slice(0, 3), now).length, 3);
  assert.deepEqual(selectRecentBooks([], now), []);
});

test('the window contains today and the previous 29 Beijing calendar days', () => {
  const input = [book('today', '2026-10-29'), book('day-30', '2026-09-30'), book('expired', '2026-09-29')];
  assert.deepEqual(selectRecentBooks(input, now).map(item => item.slug), ['today', 'day-30']);

  const beforeMidnight = Date.parse('2026-10-29T15:59:59.999Z');
  const midnight = Date.parse('2026-10-29T16:00:00Z');
  assert.deepEqual(selectRecentBooks(input, beforeMidnight).map(item => item.slug), ['today', 'day-30']);
  assert.deepEqual(selectRecentBooks(input, midnight).map(item => item.slug), ['today']);
  assert.equal(getNextBeijingMidnight(beforeMidnight), midnight);
  assert.equal(getNextBeijingMidnight(midnight), Date.parse('2026-10-30T16:00:00Z'));
});

test('future dates and invalid dates are excluded from recent results and fallback', () => {
  const input = [book('tomorrow', '2026-10-30'), book('invalid', 'invalid'), book('recent', '2026-10-28')];
  assert.deepEqual(selectRecentBooks(input, now).map(item => item.slug), ['recent']);
  assert.deepEqual(selectRecentBooks(input.slice(0, 2), now), []);
  assert.deepEqual(
    selectRecentBooks([...input.slice(0, 2), book('older', '2026-09-29')], now).map(item => item.slug),
    ['older'],
  );
});

test('selection preserves input order and sorts equal dates consistently', () => {
  const input = [book('z', '2026-10-28'), book('a', '2026-10-28'), book('latest', '2026-10-29')];
  const original = [...input];
  assert.deepEqual(selectRecentBooks(input, now).map(item => item.slug), ['latest', 'a', 'z']);
  assert.deepEqual(input, original);
});
