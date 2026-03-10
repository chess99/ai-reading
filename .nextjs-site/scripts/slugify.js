/**
 * slug 生成与校验脚本
 * 用法：node .nextjs-site/scripts/slugify.js [--check]
 *   --check  仅校验，不修改文件（用于 pre-commit hook）
 *
 * 功能：
 *   1. 扫描 books/ 下所有 .md 文件
 *   2. 缺少 slug 的文件自动生成并写入
 *   3. 检测 slug 冲突，冲突时报错并退出（需人工解决）
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { pinyin } from 'pinyin-pro';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BOOKS_DIR = path.resolve(__dirname, '../../books');
const CHECK_ONLY = process.argv.includes('--check');

// 生成 slug：中文转拼音，英文转 kebab-case
function generateSlug(title) {
  if (!title) return '';

  // 判断是否含中文
  const hasChinese = /[\u4e00-\u9fff]/.test(title);

  if (hasChinese) {
    return pinyin(title, {
      toneType: 'none',
      separator: '-',
      nonZh: 'consecutive', // 非中文字符保留，连续处理
    })
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  } else {
    // 英文：转小写 kebab-case
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

// 从文件名解析书名
function titleFromFilename(filename) {
  const name = filename.replace(/\.md$/, '');
  const dashIndex = name.indexOf('-');
  return dashIndex === -1 ? name : name.substring(dashIndex + 1);
}

// 递归扫描 books/ 目录
function scanBooks(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanBooks(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function main() {
  const files = scanBooks(BOOKS_DIR);
  const slugMap = new Map(); // slug -> [filePath, ...]
  const toWrite = []; // { filePath, newSlug, fileContent }
  let hasError = false;

  // 第一遍：收集现有 slug，生成缺失的 slug
  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    let slug = data.slug?.trim();
    let generated = false;

    if (!slug) {
      const title = data.title?.trim() || titleFromFilename(path.basename(filePath));
      slug = generateSlug(title);
      generated = true;
    }

    if (!slug) {
      console.error(`❌ 无法生成 slug：${path.relative(BOOKS_DIR, filePath)}`);
      hasError = true;
      continue;
    }

    if (!slugMap.has(slug)) slugMap.set(slug, []);
    slugMap.get(slug).push({ filePath, generated, data, content, raw });

    if (generated) {
      toWrite.push({ filePath, slug, data, content });
    }
  }

  // 检测冲突
  for (const [slug, entries] of slugMap) {
    if (entries.length > 1) {
      console.error(`\n❌ slug 冲突："${slug}" 被以下文件使用：`);
      for (const e of entries) {
        console.error(`   ${path.relative(BOOKS_DIR, e.filePath)}`);
      }
      console.error(`   请手动修改其中一个文件的 slug（如加作者前缀区分）\n`);
      hasError = true;
    }
  }

  if (hasError) {
    process.exit(1);
  }

  // 写入自动生成的 slug
  if (CHECK_ONLY) {
    if (toWrite.length > 0) {
      console.error(`\n❌ 以下文件缺少 slug，请运行 node .nextjs-site/scripts/slugify.js 自动生成：`);
      for (const { filePath, slug } of toWrite) {
        console.error(`   ${path.relative(BOOKS_DIR, filePath)} → ${slug}`);
      }
      process.exit(1);
    }
  } else {
    for (const { filePath, slug, data, content } of toWrite) {
      const newFrontmatter = { slug, ...data };
      const newContent = matter.stringify(content, newFrontmatter);
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`✅ 已生成 slug：${path.relative(BOOKS_DIR, filePath)} → ${slug}`);
    }
    if (toWrite.length === 0) {
      console.log('✅ 所有文件 slug 完整，无冲突');
    }
  }
}

main();
