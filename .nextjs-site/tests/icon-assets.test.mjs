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
    assertOpaquePng('public/apple-touch-icon.png'),
    assertOpaquePng('public/share-image.png'),
  ]);
});

test('every Android install candidate has a transparent margin and a centered, legible book', async () => {
  const publicDir = path.join(siteRoot, 'public');
  const manifest = JSON.parse(await fs.readFile(path.join(publicDir, 'manifest.webmanifest'), 'utf8'));
  assert.deepEqual(manifest.icons.map(icon => icon.sizes).sort(), ['192x192', '512x512']);
  for (const icon of manifest.icons) {
    const file = new URL(icon.src, 'https://example.test').pathname;
    const { data, info } = await sharp(path.join(publicDir, file)).raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.channels, 4, file);
    assert.equal(icon.sizes, `${info.width}x${info.height}`);
    let left = info.width, right = -1, top = info.height, bottom = -1;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (!data[(y * info.width + x) * 4 + 3]) continue;
        left = Math.min(x, left);
        right = Math.max(x, right);
        top = Math.min(y, top);
        bottom = Math.max(y, bottom);
      }
    }
    const height = (bottom - top + 1) / info.height;
    assert.ok(height > 0.42 && height < 0.53, file);
    assert.ok(left > info.width * 0.2 && right < info.width * 0.8, file);
    assert.ok(Math.abs(left + right + 1 - info.width) < info.width * 0.08, file);
    assert.ok(Math.abs(top + bottom + 1 - info.height) < info.height * 0.08, file);
  }
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
