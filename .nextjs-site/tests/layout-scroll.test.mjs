import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const layoutClientSource = readFileSync(
  new URL('../app/layout-client.tsx', import.meta.url),
  'utf8',
);

test('layout resets the persistent main scroll container on route changes', () => {
  assert.match(
    layoutClientSource,
    /const\s+mainRef\s*=\s*useRef<HTMLElement\s*\|\s*null>\(null\)/,
    'LayoutClient should keep a ref to the persistent main scroll container.',
  );
  assert.match(
    layoutClientSource,
    /mainRef\.current\?\.scrollTo\(\{\s*top:\s*0,\s*left:\s*0/,
    'Route changes should scroll the main container back to the top-left.',
  );
  assert.match(
    layoutClientSource,
    /<main[^>]+ref=\{mainRef\}/,
    'The main element should be wired to the scroll reset ref.',
  );
});
