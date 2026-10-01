#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { pinyin } from 'pinyin-pro';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SITE_ROOT, '..');

export const DEFAULT_SITE_URL = 'https://read.cearl.cc';
export const DEFAULT_RECENT_LIMIT = 100;

function scanMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return scanMarkdownFiles(fullPath);
    return entry.isFile() && entry.name.endsWith('.md') ? [fullPath] : [];
  });
}

function parseFilename(filename) {
  const name = filename.replace(/\.md$/, '');
  const dashIndex = name.indexOf('-');
  return dashIndex === -1
    ? { author: '', title: name }
    : { author: name.slice(0, dashIndex), title: name.slice(dashIndex + 1) };
}

export function slugifyFeedName(value) {
  return pinyin(value, {
    toneType: 'none',
    separator: '-',
    nonZh: 'consecutive',
  })
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cdata(value = '') {
  return `<![CDATA[${String(value).replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

function stripLeadingH1(markdown) {
  const lines = String(markdown).split(/\r?\n/);
  const firstContentLine = lines.findIndex(line => line.trim().length > 0);
  if (firstContentLine >= 0 && /^#\s+/.test(lines[firstContentLine])) {
    lines.splice(firstContentLine, 1);
  }
  return lines.join('\n').trim();
}

function toAbsoluteUrl(url, siteUrl) {
  if (!url || url.startsWith('#') || /^(?:https?:|mailto:|tel:|data:)/i.test(url)) {
    return url;
  }
  try {
    return new URL(url, `${siteUrl}/`).toString();
  } catch {
    return url;
  }
}

export function markdownToFeedHtml(markdown, { siteUrl = DEFAULT_SITE_URL } = {}) {
  const body = stripLeadingH1(markdown);
  return renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeRaw, rehypeSanitize],
        urlTransform: url => toAbsoluteUrl(url, siteUrl),
      },
      body,
    ),
  );
}

function markdownToSummary(markdown, maxLength = 240) {
  const text = stripLeadingH1(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

function parseDate(value, fallbackMs) {
  const parsed = value ? new Date(value) : new Date(fallbackMs);
  return Number.isNaN(parsed.getTime()) ? new Date(fallbackMs) : parsed;
}

function loadBooks(booksDir, siteUrl) {
  return scanMarkdownFiles(booksDir).map(filePath => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const fallback = parseFilename(path.basename(filePath));
    const relativeDir = path.relative(booksDir, path.dirname(filePath));
    const categoryPath = relativeDir && relativeDir !== '.' ? relativeDir.split(path.sep) : [];
    const slug = data.slug || path.basename(filePath, '.md');
    const title = data.title || fallback.title;
    const author = data.author || fallback.author;
    const stat = fs.statSync(filePath);
    const date = parseDate(data.date, stat.mtimeMs);

    return {
      type: 'book',
      slug,
      title,
      author,
      date,
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: categoryPath[0] || '未分类',
      categoryPath,
      url: `${siteUrl}/books/${encodeURIComponent(slug)}/`,
      summary: markdownToSummary(content),
      html: markdownToFeedHtml(content, { siteUrl }),
    };
  });
}

function topicReadingListHtml(data, siteUrl) {
  const books = Array.isArray(data.books) ? data.books : [];
  if (books.length === 0) return '';

  const items = books.map(book => {
    const title = escapeXml(book.title || '未命名书籍');
    const author = book.author ? ` · ${escapeXml(book.author)}` : '';
    const bookLabel = book.status === 'in_library' && book.slug
      ? `<a href="${escapeXml(`${siteUrl}/books/${encodeURIComponent(book.slug)}/`)}">《${title}》</a>${author}`
      : `《${title}》${author}`;
    const role = book.role ? `<strong>${escapeXml(book.role)}</strong>：` : '';
    const reason = book.reason ? `${role}${escapeXml(book.reason)}` : role;

    return `<li><p>${bookLabel}</p>${reason ? `<p>${reason}</p>` : ''}</li>`;
  }).join('');

  return `<h2>书单与读法</h2><ol>${items}</ol>`;
}

function loadTopics(topicsDir, siteUrl) {
  return scanMarkdownFiles(topicsDir).map(filePath => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const slug = data.slug || path.basename(filePath, '.md');
    const title = data.title || slug;
    const stat = fs.statSync(filePath);
    const date = parseDate(data.date, stat.mtimeMs);
    const description = data.description || markdownToSummary(content);
    const entry = data.entry
      ? `<p><strong>从这里开始：</strong>${escapeXml(data.entry)}</p>`
      : '';
    const structuredHtml = [
      description ? `<p><strong>主题简介：</strong>${escapeXml(description)}</p>` : '',
      entry,
      topicReadingListHtml(data, siteUrl),
    ].join('');

    return {
      type: 'topic',
      slug,
      title,
      author: '晨笙阅读',
      date,
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: '主题阅读',
      categoryPath: [],
      url: `${siteUrl}/topics/${encodeURIComponent(slug)}/`,
      summary: description,
      structuredHtml,
      html: markdownToFeedHtml(content, { siteUrl }),
    };
  });
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => b.date.getTime() - a.date.getTime() || a.url.localeCompare(b.url));
}

function feedItemTitle(item) {
  return item.type === 'book' && item.author
    ? `《${item.title}》｜${item.author}`
    : item.type === 'topic'
      ? `主题阅读：${item.title}`
      : item.title;
}

function itemContent(item) {
  const meta = item.type === 'book'
    ? `<p><strong>作者：</strong>${escapeXml(item.author)}</p>`
    : `<p><strong>类型：</strong>主题阅读</p>${item.structuredHtml || ''}`;
  return `${meta}${item.html}`;
}

export function buildRss({ title, description, feedUrl, siteUrl = DEFAULT_SITE_URL, items }) {
  const sortedItems = sortByDateDesc(items);
  const lastBuildDate = sortedItems[0]?.date ?? new Date(0);
  const itemXml = sortedItems.map(item => {
    const categories = [item.category, ...item.tags]
      .filter(Boolean)
      .map(category => `      <category>${escapeXml(category)}</category>`)
      .join('\n');

    return [
      '    <item>',
      `      <title>${escapeXml(feedItemTitle(item))}</title>`,
      `      <link>${escapeXml(item.url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(item.url)}</guid>`,
      `      <pubDate>${item.date.toUTCString()}</pubDate>`,
      `      <dc:creator>${escapeXml(item.author)}</dc:creator>`,
      `      <description>${escapeXml(item.summary)}</description>`,
      categories,
      `      <content:encoded>${cdata(itemContent(item))}</content:encoded>`,
      '    </item>',
    ].filter(Boolean).join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"',
    '  xmlns:atom="http://www.w3.org/2005/Atom"',
    '  xmlns:content="http://purl.org/rss/1.0/modules/content/"',
    '  xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(siteUrl)}/</link>`,
    `    <description>${escapeXml(description)}</description>`,
    '    <language>zh-CN</language>',
    `    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    '    <generator>晨笙阅读 feed generator</generator>',
    '    <image>',
    `      <url>${escapeXml(siteUrl)}/icon-512.png</url>`,
    `      <title>${escapeXml(title)}</title>`,
    `      <link>${escapeXml(siteUrl)}/</link>`,
    '    </image>',
    itemXml,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

function buildOpml({ siteUrl, categories }) {
  const categoryOutlines = categories.map(category => {
    const slug = slugifyFeedName(category);
    return `      <outline type="rss" text="${escapeXml(category)}" title="${escapeXml(category)}" xmlUrl="${escapeXml(`${siteUrl}/feeds/categories/${slug}.xml`)}" htmlUrl="${escapeXml(`${siteUrl}/library/`)}" />`;
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<opml version="2.0">',
    '  <head>',
    '    <title>晨笙阅读完整订阅</title>',
    '  </head>',
    '  <body>',
    '    <outline text="书籍解读" title="书籍解读">',
    categoryOutlines,
    '    </outline>',
    `    <outline type="rss" text="主题阅读" title="主题阅读" xmlUrl="${escapeXml(`${siteUrl}/feeds/topics.xml`)}" htmlUrl="${escapeXml(`${siteUrl}/topics/`)}" />`,
    '  </body>',
    '</opml>',
    '',
  ].join('\n');
}

function writeText(outputPath, content) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, 'utf8');
}

export function generateFeeds({
  booksDir = path.join(REPO_ROOT, 'books'),
  topicsDir = path.join(REPO_ROOT, 'topics'),
  outputDir = path.join(SITE_ROOT, 'public'),
  siteUrl = DEFAULT_SITE_URL,
  recentLimit = DEFAULT_RECENT_LIMIT,
} = {}) {
  const books = sortByDateDesc(loadBooks(booksDir, siteUrl));
  const topics = sortByDateDesc(loadTopics(topicsDir, siteUrl));
  const combined = sortByDateDesc([...books, ...topics]);
  const recentCombined = combined.slice(0, recentLimit);
  const recentBooks = books.slice(0, recentLimit);

  writeText(path.join(outputDir, 'feed.xml'), buildRss({
    title: '晨笙阅读',
    description: '晨笙阅读最新书籍解读与主题阅读的全文 RSS，可在支持 RSS 与文字朗读的客户端中订阅。',
    feedUrl: `${siteUrl}/feed.xml`,
    siteUrl,
    items: recentCombined,
  }));

  writeText(path.join(outputDir, 'feeds', 'books.xml'), buildRss({
    title: '晨笙阅读 · 书籍解读',
    description: `最近 ${recentLimit} 篇书籍解读的全文 RSS。完整书库可通过分类 Feed 或 OPML 订阅。`,
    feedUrl: `${siteUrl}/feeds/books.xml`,
    siteUrl,
    items: recentBooks,
  }));

  writeText(path.join(outputDir, 'feeds', 'topics.xml'), buildRss({
    title: '晨笙阅读 · 主题阅读',
    description: '围绕真实问题组织的主题阅读路径全文 RSS。',
    feedUrl: `${siteUrl}/feeds/topics.xml`,
    siteUrl,
    items: topics,
  }));

  const categories = [...new Set(books.map(book => book.category))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
  for (const category of categories) {
    const slug = slugifyFeedName(category);
    const categoryItems = books.filter(book => book.category === category);
    writeText(path.join(outputDir, 'feeds', 'categories', `${slug}.xml`), buildRss({
      title: `晨笙阅读 · ${category}`,
      description: `${category}书架的完整书籍解读全文 RSS。`,
      feedUrl: `${siteUrl}/feeds/categories/${slug}.xml`,
      siteUrl,
      items: categoryItems,
    }));
  }

  writeText(path.join(outputDir, 'feeds', 'ai-reading.opml'), buildOpml({ siteUrl, categories }));

  return {
    books: books.length,
    topics: topics.length,
    recent: recentCombined.length,
    categories,
  };
}

function isDirectExecution() {
  return process.argv[1] && path.resolve(process.argv[1]) === __filename;
}

if (isDirectExecution()) {
  const result = generateFeeds();
  console.log(`✅ Feeds generated: ${result.books} books, ${result.topics} topics, ${result.categories.length} categories`);
}
