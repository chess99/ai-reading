import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';

const siteRoot = path.resolve(import.meta.dirname, '..');

async function assertOpaquePng(relativePath) {
  const imagePath = path.join(siteRoot, relativePath);
  const metadata = await sharp(imagePath).metadata();

  assert.equal(metadata.format, 'png', `${relativePath} should be a PNG file`);
  assert.equal(metadata.width, 512, `${relativePath} should be 512px wide`);
  assert.equal(metadata.height, 512, `${relativePath} should be 512px tall`);
  assert.equal(metadata.hasAlpha, false, `${relativePath} should not contain an alpha channel`);
}

test('PNG app and share icons use opaque square backgrounds', async () => {
  await Promise.all([
    assertOpaquePng('public/icon.png'),
    assertOpaquePng('public/icon-512.png'),
    assertOpaquePng('public/apple-touch-icon.png'),
    assertOpaquePng('public/maskable-icon.png'),
    assertOpaquePng('public/share-image.png'),
  ]);
});

test('metadata uses the dedicated share image instead of the app icon', async () => {
  const files = [
    'app/layout.tsx',
    'app/books/[slug]/page.tsx',
    'app/topics/[slug]/page.tsx',
  ];

  for (const file of files) {
    const content = await fs.readFile(path.join(siteRoot, file), 'utf8');
    assert.match(content, /share-image\.png/, `${file} should reference share-image.png`);
    assert.doesNotMatch(content, /\/icon\.png/, `${file} should not use icon.png as a social image`);
  }
});

test('web app manifest separates standard and maskable PNG icons', async () => {
  const manifestPath = path.join(siteRoot, 'public/manifest.webmanifest');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const icons = manifest.icons ?? [];

  assert.ok(
    icons.some(icon => icon.src === '/icon-512.png' && icon.purpose === 'any'),
    'manifest should expose /icon-512.png for standard app icon use'
  );
  assert.ok(
    icons.some(icon => icon.src === '/maskable-icon.png' && icon.purpose === 'maskable'),
    'manifest should expose /maskable-icon.png for maskable app icon use'
  );
  assert.equal(
    icons.some(icon => String(icon.purpose).includes('any maskable')),
    false,
    'manifest should not reuse one asset for both any and maskable purposes'
  );
});
