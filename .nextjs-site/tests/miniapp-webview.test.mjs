import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('layout supports miniapp webview embed mode through query parameter', () => {
  const source = readFileSync(new URL('../app/layout-client.tsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /useSearchParams/, 'Layout should not use useSearchParams because static export requires Suspense boundaries.');
  assert.match(source, /URLSearchParams\(window\.location\.search\)/, 'Layout should read the miniapp query from window.location on the client.');
  assert.match(source, /miniapp/, 'Layout should recognize the miniapp query parameter.');
  assert.match(source, /isMiniappEmbed/, 'Layout should derive a miniapp embed mode flag.');
  assert.match(source, /!\s*isMiniappEmbed\s*&&\s*<Header/, 'Miniapp embed mode should hide the global header.');
  assert.match(source, /!\s*isMiniappEmbed\s*&&\s*<BottomNav/, 'Miniapp embed mode should hide the mobile bottom nav.');
  assert.match(source, /!\s*isMiniappEmbed\s*&&\s*<UpdateNotification/, 'Miniapp embed mode should hide PWA update UI.');
  assert.match(source, /!\s*isMiniappEmbed\s*&&\s*<SettingsDialog/, 'Miniapp embed mode should hide settings modal wiring.');
  assert.match(source, /miniapp-embed/, 'Layout should mark the app shell when rendered in miniapp embed mode.');
  assert.match(css, /\.miniapp-embed\s+main[\s\S]*padding-bottom:\s*0/, 'Miniapp embed mode should remove bottom-nav padding in CSS.');
});
