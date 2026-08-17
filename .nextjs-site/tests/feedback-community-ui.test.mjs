import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';

test('feedback and community dialog is available from desktop and mobile navigation', () => {
  const layoutSource = readFileSync(new URL('../app/layout-client.tsx', import.meta.url), 'utf8');
  const headerSource = readFileSync(new URL('../components/Header.tsx', import.meta.url), 'utf8');
  const bottomNavSource = readFileSync(new URL('../components/BottomNav.tsx', import.meta.url), 'utf8');

  assert.match(layoutSource, /<FeedbackDialog/, 'The global layout should render the feedback dialog.');
  assert.match(headerSource, /反馈与交流/, 'Desktop navigation should expose feedback and community.');
  assert.match(bottomNavSource, /label:\s*'交流'/, 'Mobile navigation should expose the community entry.');
  assert.match(bottomNavSource, /grid-cols-5/, 'Mobile navigation should make room for the community entry.');
});

test('dialog explains the stable WeChat path and retains low-friction feedback options', () => {
  const dialogSource = readFileSync(new URL('../components/FeedbackDialog.tsx', import.meta.url), 'utf8');

  assert.match(dialogSource, /src="\/wechat-qr\.jpg"/, 'The dialog should use the copied official-account QR code.');
  assert.match(dialogSource, /极客小屋/, 'The dialog should identify the official account.');
  assert.match(dialogSource, /晨笙阅读/, 'The dialog should show the source-specific reply keyword.');
  assert.match(dialogSource, /href="\/request-book"/, 'Readers should still be able to recommend a book directly.');
  assert.match(dialogSource, /github\.com\/chess99\/ai-reading\/issues\/new/, 'Readers should still be able to submit issue feedback.');
  assert.match(dialogSource, /role="dialog"/, 'The overlay should expose dialog semantics.');
  assert.match(dialogSource, /event\.key === 'Escape'/, 'The dialog should close with the Escape key.');
});

test('official-account QR image is shipped as a local static asset', () => {
  const qrUrl = new URL('../public/wechat-qr.jpg', import.meta.url);
  const qr = statSync(qrUrl);

  assert.ok(qr.isFile(), 'The QR image should exist in the static assets directory.');
  assert.ok(qr.size > 10_000, 'The QR image should not be an empty placeholder.');
});
