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

test('layout uses the browser window as the primary page scroll container', () => {
  assert.doesNotMatch(
    layoutClientSource,
    /\bmainRef\b/,
    'LayoutClient should not manage a persistent main scroll container.',
  );
  assert.doesNotMatch(
    layoutClientSource,
    /mainRef\.current\?\.scrollTo/,
    'Route changes should rely on browser and Next.js page scrolling, not manual main scrolling.',
  );
  assert.doesNotMatch(
    layoutClientSource,
    /<main[^>]+ref=\{/,
    'The main element should not be wired as a custom scroll container.',
  );
  assert.doesNotMatch(
    layoutClientSource,
    /<main[^>]+className="[^"]*\boverflow-auto\b/,
    'Main content should not have its own vertical overflow scrolling.',
  );
  assert.match(
    layoutClientSource,
    /<div className="[^"]*\bmin-h-screen\b[^"]*"/,
    'The app shell should size with content so the document can scroll.',
  );
});

test('table of contents targets window scrolling instead of the old main container', () => {
  assert.doesNotMatch(
    tableOfContentsSource,
    /document\.querySelector\('main\.overflow-auto'\)/,
    'TOC should not look for the removed custom main scroll container.',
  );
  assert.doesNotMatch(
    tableOfContentsSource,
    /scrollContainer\.scrollTo/,
    'TOC section jumps should use the browser window scroll API.',
  );
  assert.doesNotMatch(
    tableOfContentsSource,
    /scrollContainer\.scrollTop/,
    'TOC active-section tracking should use window scroll state.',
  );
  assert.match(
    tableOfContentsSource,
    /window\.scrollTo\(\{\s*top,\s*behavior:\s*'smooth'\s*\}\)/,
    'TOC section jumps should scroll the document window.',
  );
  assert.match(
    tableOfContentsSource,
    /window\.addEventListener\('scroll'/,
    'TOC active-section tracking should listen to document scrolling.',
  );
});

test('layout does not trap the whole page inside a fixed-height app shell', () => {
  assert.doesNotMatch(
    layoutClientSource,
    /<div className="(?:[^"]*\s)?h-screen(?:\s|")/,
    'The app shell should not pin the document to the viewport height.',
  );
  assert.doesNotMatch(
    layoutClientSource,
    /<div className="[^"]*\boverflow-hidden\b[^"]*"/,
    'The app shell should not hide browser-level page overflow.',
  );
});
