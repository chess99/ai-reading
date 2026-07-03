import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const siteRoot = path.resolve(import.meta.dirname, '..');

test('WeRead helper reads status objects and only exposes found URLs', () => {
  const source = readFileSync(path.join(siteRoot, 'lib/external-links.ts'), 'utf8');

  assert.match(source, /status:\s*'found'\s*\|\s*'not_found'/, 'helper should model found and not_found statuses');
  assert.match(source, /entry\.status\s*!==\s*'found'|entry\.status\s*===\s*'found'/, 'helper should only expose URLs for found entries');
  assert.match(source, /entry\.url/, 'helper should read URL from the found entry object');
});
