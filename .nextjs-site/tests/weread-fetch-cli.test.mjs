import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const scriptPath = path.join(siteRoot, 'scripts', 'fetch-weread-links.mjs');

test('candidate mode requires a target slug', () => {
  const result = spawnSync(process.execPath, [scriptPath, '--candidates'], {
    cwd: siteRoot,
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--candidates requires --slug=<slug>/);
});

test('candidate mode rejects an unknown target slug before searching', () => {
  const result = spawnSync(
    process.execPath,
    [scriptPath, '--slug=__unknown_book_slug__', '--candidates'],
    { cwd: siteRoot, encoding: 'utf8' },
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unknown book slug: __unknown_book_slug__/);
});

test('WeRead lookup helper is review-only and cannot write mappings', () => {
  const source = readFileSync(scriptPath, 'utf8');

  assert.match(source, /Review-only mode: weread-links\.json was not written/);
  assert.match(source, /An agent must inspect the real detail page/);
  assert.doesNotMatch(source, /writeFileSync/);
  assert.doesNotMatch(source, /pickBestCandidate/);
});
