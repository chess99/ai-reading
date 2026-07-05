#!/usr/bin/env node

/**
 * 生成构建清单，用于 PWA 缓存版本管理
 * 为每本书生成内容 hash，用于检测更新
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOOKS_DIR = path.join(__dirname, '..', '..', 'books');
const TOPICS_DIR = path.join(__dirname, '..', '..', 'topics');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'build-manifest.json');
const LIBRARY_TREE_FILE = path.join(__dirname, '..', 'public', 'library-tree.json');
const LIBRARY_BOOKS_FILE = path.join(__dirname, '..', 'public', 'library-books.json');

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
  const metas = [];

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

          const { data } = matter(content);
          const fallback = parseFilename(entry.name);
          const slug = data.slug || entry.name.replace(/\.md$/, '');
          const title = data.title || fallback.title;
          const author = data.author || fallback.author;

          books[slug] = {
            hash,
            title,
            author,
            path: path.relative(BOOKS_DIR, fullPath),
          };
          const relativeDir = path.relative(BOOKS_DIR, path.dirname(fullPath));
          const categoryPath = relativeDir && relativeDir !== '.'
            ? relativeDir.split(path.sep)
            : [];
          metas.push({
            slug,
            title,
            author,
            category: categoryPath.join('/') || '未分类',
            categoryPath,
            tags: Array.isArray(data.tags) ? data.tags : [],
            addedAt: data.date ? new Date(data.date).getTime() : fs.statSync(fullPath).mtimeMs,
          });
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error.message);
        }
      }
    }
  }

  scan(dir);
  return { books, metas };
}

function buildBookTree(bookMetas) {
  const root = [];

  function getOrCreateCategory(parent, categoryName, fullPath) {
    let node = parent.find(n => n.name === categoryName && n.type === 'category');
    if (!node) {
      node = { name: categoryName, type: 'category', path: fullPath, children: [] };
      parent.push(node);
    }
    return node;
  }

  for (const book of bookMetas) {
    let currentLevel = root;
    let pathSoFar = '';
    for (const categoryName of book.categoryPath) {
      pathSoFar = pathSoFar ? `${pathSoFar}/${categoryName}` : categoryName;
      const categoryNode = getOrCreateCategory(currentLevel, categoryName, pathSoFar);
      currentLevel = categoryNode.children;
    }
    currentLevel.push({
      name: `${book.author} - ${book.title}`,
      type: 'book',
      path: `/books/${book.slug}`,
    });
  }

  const sortTree = nodes => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'category' ? -1 : 1;
      }
      return a.name.localeCompare(b.name, 'zh-CN');
    });
    nodes.forEach(node => {
      if (node.children) sortTree(node.children);
    });
  };

  sortTree(root);
  return root;
}

function scanTopics(dir) {
  const topics = {};

  if (!fs.existsSync(dir)) {
    return topics;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const hash = generateHash(content);
      const slug = entry.name.replace(/\.md$/, '');
      const titleMatch = content.match(/^title:\s*(.+)$/m);
      const title = titleMatch ? titleMatch[1].replace(/^['"]|['"]$/g, '') : slug;

      topics[slug] = {
        hash,
        title,
        author: '主题阅读',
        path: path.relative(dir, fullPath),
      };
    } catch (error) {
      console.error(`Error processing ${fullPath}:`, error.message);
    }
  }

  return topics;
}

function generateManifest() {
  console.log('🔨 Generating build manifest...');

  const { books, metas: bookMetas } = scanBooks(BOOKS_DIR);
  const topics = scanTopics(TOPICS_DIR);
  const content = {};

  for (const [slug, info] of Object.entries(books)) {
    content[`/books/${slug}/`] = {
      ...info,
      type: 'book',
      url: `/books/${slug}/`,
    };
  }

  for (const [slug, info] of Object.entries(topics)) {
    content[`/topics/${slug}/`] = {
      ...info,
      type: 'topic',
      url: `/topics/${slug}/`,
    };
  }

  const manifest = {
    version: new Date().toISOString(),
    buildTime: Date.now(),
    booksCount: Object.keys(books).length,
    topicsCount: Object.keys(topics).length,
    books,
    topics,
    content,
  };

  // 确保 public 目录存在
  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(LIBRARY_TREE_FILE, JSON.stringify(buildBookTree(bookMetas)));
  fs.writeFileSync(LIBRARY_BOOKS_FILE, JSON.stringify(bookMetas));

  console.log(`✅ Manifest generated: ${Object.keys(books).length} books, ${Object.keys(topics).length} topics`);
  console.log(`📝 Output: ${OUTPUT_FILE}`);
}

generateManifest();
