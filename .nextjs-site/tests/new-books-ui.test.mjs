import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const newBooksSource = readFileSync(new URL('../components/NewBooks.tsx', import.meta.url), 'utf8');
const bookCardSource = readFileSync(new URL('../components/BookCard.tsx', import.meta.url), 'utf8');

test('latest books use a responsive grid instead of a horizontal rail', () => {
  assert.match(newBooksSource, /grid grid-cols-1 gap-3/);
  assert.match(newBooksSource, /sm:grid-cols-\[repeat\(auto-fit,minmax\(15rem,1fr\)\)\]/);
  assert.doesNotMatch(newBooksSource, /overflow-x-auto/);
});

test('latest books provide a compact mobile card and an explicit library exit', () => {
  assert.match(newBooksSource, /layout="latest"/);
  assert.match(newBooksSource, /href="\/library"/);
  assert.match(newBooksSource, /浏览书库/);
  assert.match(bookCardSource, /grid-cols-\[4px_minmax\(0,1fr\)_auto\]/);
  assert.match(bookCardSource, /md:flex/);
});
