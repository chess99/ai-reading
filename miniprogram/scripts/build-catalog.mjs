#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const booksDir = path.join(repoRoot, 'books');
const topicsDir = path.join(repoRoot, 'topics');
const outputDir = path.join(repoRoot, 'miniprogram', 'data');
const catalogJsonPath = path.join(outputDir, 'catalog.json');
const catalogJsPath = path.join(outputDir, 'catalog.js');
const baseUrl = 'https://read.cearl.cc';

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) {
    return {};
  }

  const end = raw.indexOf('\n---', 3);
  if (end === -1) {
    return {};
  }

  const frontmatter = raw.slice(3, end).trim();
  const data = {};
  let currentKey = null;

  for (const line of frontmatter.split(/\r?\n/)) {
    if (/^\s+-\s+/.test(line) && currentKey) {
      data[currentKey] = data[currentKey] || [];
      data[currentKey].push(line.replace(/^\s+-\s+/, '').trim());
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      currentKey = null;
      continue;
    }

    const [, key, rawValue] = match;
    currentKey = key;
    data[key] = parseValue(rawValue);
  }

  return data;
}

function parseValue(value) {
  const trimmed = value.trim();

  if (trimmed === '') {
    return '';
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) {
      return [];
    }
    return inner.split(',').map(item => stripQuotes(item.trim())).filter(Boolean);
  }

  return stripQuotes(trimmed);
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, '');
}

function parseFilename(filename) {
  const name = filename.replace(/\.md$/, '');
  const dashIndex = name.indexOf('-');
  if (dashIndex === -1) {
    return { author: '', title: name };
  }
  return {
    author: name.slice(0, dashIndex),
    title: name.slice(dashIndex + 1),
  };
}

function scanMarkdownFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function buildBooks() {
  return scanMarkdownFiles(booksDir)
    .map(filePath => {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = parseFrontmatter(raw);
      const fallback = parseFilename(path.basename(filePath));
      const categoryPath = path.relative(booksDir, path.dirname(filePath)).split(path.sep).filter(Boolean);
      const slug = data.slug || path.basename(filePath, '.md');

      return {
        slug,
        title: data.title || fallback.title,
        author: data.author || fallback.author,
        category: categoryPath.join('/'),
        tags: Array.isArray(data.tags) ? data.tags : [],
        url: `${baseUrl}/books/${slug}/?miniapp=1`,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
}

function extractTopicBookCount(raw) {
  const match = raw.match(/^books:\s*$/m);
  if (!match) {
    return 0;
  }

  const section = raw.slice(match.index);
  const nextTopLevel = section.slice(1).search(/\n[A-Za-z0-9_-]+:\s*/);
  const booksBlock = nextTopLevel === -1 ? section : section.slice(0, nextTopLevel + 1);
  return (booksBlock.match(/^\s+-\s+title:/gm) || []).length;
}

function buildTopics() {
  return scanMarkdownFiles(topicsDir)
    .map(filePath => {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = parseFrontmatter(raw);
      const slug = data.slug || path.basename(filePath, '.md');

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        bookCount: extractTopicBookCount(raw),
        url: `${baseUrl}/topics/${slug}/?miniapp=1`,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
}

function buildCatalog() {
  const books = buildBooks();
  const topics = buildTopics();
  const contentHash = crypto
    .createHash('sha1')
    .update(JSON.stringify({ books, topics }))
    .digest('hex')
    .slice(0, 12);

  return {
    version: contentHash,
    books,
    topics,
  };
}

function writeCatalog() {
  const catalog = buildCatalog();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(catalogJsonPath, JSON.stringify(catalog, null, 2));
  fs.writeFileSync(catalogJsPath, `module.exports = ${JSON.stringify(catalog, null, 2)};\n`);
  console.log(`Catalog generated: ${catalog.books.length} books, ${catalog.topics.length} topics`);
}

writeCatalog();
