#!/usr/bin/env node

/**
 * 生成构建清单，用于 PWA 缓存版本管理
 * 为每本书生成内容 hash，用于检测更新
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOOKS_DIR = path.join(__dirname, '..', '..', 'books');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'build-manifest.json');

function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

function parseFilename(filename) {
  const nameWithoutExt = filename.replace(/\.md$/, '');
  const dashIndex = nameWithoutExt.indexOf('-');

  if (dashIndex === -1) {
    return { author: '', title: nameWithoutExt };
  }

  return {
    author: nameWithoutExt.substring(0, dashIndex),
    title: nameWithoutExt.substring(dashIndex + 1),
  };
}

function scanBooks(dir) {
  const books = {};

  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const hash = generateHash(content);

          // 生成 slug（与 Next.js 逻辑一致）
          const slug = entry.name.replace(/\.md$/, '');
          const { title, author } = parseFilename(entry.name);

          books[slug] = {
            hash,
            title,
            author,
            path: path.relative(BOOKS_DIR, fullPath),
          };
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error.message);
        }
      }
    }
  }

  scan(dir);
  return books;
}

function generateManifest() {
  console.log('🔨 Generating build manifest...');

  const books = scanBooks(BOOKS_DIR);
  const manifest = {
    version: new Date().toISOString(),
    buildTime: Date.now(),
    booksCount: Object.keys(books).length,
    books,
  };

  // 确保 public 目录存在
  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

  console.log(`✅ Manifest generated: ${Object.keys(books).length} books`);
  console.log(`📝 Output: ${OUTPUT_FILE}`);
}

generateManifest();
