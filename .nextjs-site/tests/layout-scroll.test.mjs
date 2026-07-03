import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const layoutClientSource = readFileSync(
  new URL('../app/layout-client.tsx', import.meta.url),
  'utf8',
);
const tableOfContentsSource = readFileSync(
  new URL('../components/TableOfContents.tsx', import.meta.url),
  'utf8',
);

test('layout restores independent scroll positions for the app shell main container', () => {
  assert.match(
    layoutClientSource,
    /const\s+mainRef\s*=\s*useRef<HTMLElement\s*\|\s*null>\(null\)/,
    'LayoutClient should keep a ref to the persistent main scroll container.',
  );
  assert.match(
    layoutClientSource,
    /const\s+scrollPositionsRef\s*=\s*useRef<Record<string,\s*\{\s*top:\s*number;\s*left:\s*number\s*\}>>\(\{\}\)/,
    'LayoutClient should keep route-keyed scroll positions outside React render state.',
  );
  assert.match(
    layoutClientSource,
    /scrollPositionsRef\.current\[pathname\]\s*=\s*\{\s*top:\s*main\.scrollTop,\s*left:\s*main\.scrollLeft\s*\}/,
    'Scrolling should save the current route position before navigation happens.',
  );
  assert.match(
    layoutClientSource,
    /const\s+savedPosition\s*=\s*scrollPositionsRef\.current\[pathname\]\s*\?\?\s*\{\s*top:\s*0,\s*left:\s*0\s*\}/,
    'Route changes should restore the target route position or top for first visits.',
  );
  assert.match(
    layoutClientSource,
    /mainRef\.current\?\.scrollTo\(\{\s*top:\s*savedPosition\.top,\s*left:\s*savedPosition\.left/,
    'Route changes should restore the target route position.',
  );
  assert.doesNotMatch(
    layoutClientSource,
    /mainRef\.current\?\.scrollTo\(\{\s*top:\s*0,\s*left:\s*0\s*\}\)/,
    'Route changes should not always reset the shared main container to the top.',
  );
  assert.match(
    layoutClientSource,
    /<main[^>]+ref=\{mainRef\}[^>]+onScroll=\{saveCurrentScrollPosition\}/,
    'The main element should save its scroll position while the user scrolls.',
  );
});

test('layout keeps the app shell fixed while the main pane scrolls', () => {
  assert.match(
    layoutClientSource,
    /<div className="[^"]*h-\[100dvh\][^"]*overscroll-none[^"]*"/,
    'The app shell should use the dynamic viewport height and prevent viewport overscroll.',
  );
  assert.match(
    layoutClientSource,
    /<main[^>]+className="[^"]*overscroll-contain[^"]*"/,
    'The main scroll container should stop bottom-edge scroll chaining to the viewport.',
  );
  assert.match(
    layoutClientSource,
    /<main[^>]+className="[^"]*\boverflow-auto\b/,
    'The main pane should remain the app shell scroll container.',
  );
});

test('table of contents follows the app shell main scroll container', () => {
  assert.match(
    tableOfContentsSource,
    /document\.querySelector\('main\.overflow-auto'\)/,
    'TOC should target the app shell main scroll container.',
  );
  assert.match(
    tableOfContentsSource,
    /scrollContainer\.addEventListener\('scroll'/,
    'TOC active-section tracking should listen to the main container when present.',
  );
  assert.match(
    tableOfContentsSource,
    /scrollContainer\.scrollTo\(\{\s*top:\s*targetScroll,\s*behavior:\s*'smooth'\s*\}\)/,
    'TOC section jumps should scroll the main container.',
  );
});
