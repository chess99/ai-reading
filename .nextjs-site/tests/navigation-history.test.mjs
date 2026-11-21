import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  getStoredPreviousPath,
  updateNavigationHistory,
} from '../lib/navigation-history.js';

import { navigationCurrent } from '../lib/navigation-section.ts';

test('primary navigation distinguishes a tab from pages inside that section', () => {
  assert.equal(navigationCurrent('/', '/'), 'page');
  assert.equal(navigationCurrent('/library/', '/library'), 'page');
  assert.equal(navigationCurrent('/topics/example/', '/topics'), 'location');
  assert.equal(navigationCurrent('/books/example/', '/library'), 'location');
  assert.equal(navigationCurrent('/request-book/', '/settings'), 'location');
  assert.equal(navigationCurrent('/search/', '/'), undefined);
  assert.equal(navigationCurrent('/topicstore/', '/topics'), undefined);
});

function createStorage(entries = []) {
  const data = new Map(entries);

  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

test('first external page load records current path without creating a previous path', () => {
  const storage = createStorage();

  updateNavigationHistory(storage, '/books/example', {
    isInitialLoad: true,
    referrer: 'https://www.google.com/search?q=example',
    origin: 'https://example.com',
  });

  assert.equal(getStoredPreviousPath(storage), null);
});

test('client-side route changes record the last internal path', () => {
  const storage = createStorage();

  updateNavigationHistory(storage, '/', {
    isInitialLoad: true,
    referrer: '',
    origin: 'https://example.com',
  });
  updateNavigationHistory(storage, '/books/example', {
    isInitialLoad: false,
    referrer: '',
    origin: 'https://example.com',
  });

  assert.equal(getStoredPreviousPath(storage), '/');
});

test('repeating the same path does not overwrite the stored previous path', () => {
  const storage = createStorage();

  updateNavigationHistory(storage, '/', {
    isInitialLoad: true,
    referrer: '',
    origin: 'https://example.com',
  });
  updateNavigationHistory(storage, '/library', {
    isInitialLoad: false,
    referrer: '',
    origin: 'https://example.com',
  });
  updateNavigationHistory(storage, '/library', {
    isInitialLoad: false,
    referrer: '',
    origin: 'https://example.com',
  });

  assert.equal(getStoredPreviousPath(storage), '/');
});

test('header fallback replaces with home and does not inspect browser history length', () => {
  const headerSource = readFileSync(new URL('../components/Header.tsx', import.meta.url), 'utf8');

  assert.match(
    headerSource,
    /router\.replace\('\/'\)/,
    'External-entry fallback should replace the book page with home.',
  );
  assert.doesNotMatch(
    headerSource,
    /history\.length/,
    'Header back behavior should not use browser history length to infer same-origin history.',
  );
});
