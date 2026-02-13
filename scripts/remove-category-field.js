#!/usr/bin/env node

/**
 * 批量移除所有 markdown 文件中的 category 字段
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOOKS_DIR = path.join(__dirname, '..', 'books');

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // 检查是否有 frontmatter
    if (!content.startsWith('---')) {
      return { processed: false, reason: 'no frontmatter' };
    }

    // 提取 frontmatter
    const parts = content.split('---');
    if (parts.length < 3) {
      return { processed: false, reason: 'invalid frontmatter' };
    }

    const frontmatter = parts[1];
    const body = parts.slice(2).join('---');

    // 检查是否有 category 字段
    if (!frontmatter.includes('category:')) {
      return { processed: false, reason: 'no category field' };
    }

    // 移除 category 行
    const lines = frontmatter.split('\n');
    const filteredLines = lines.filter(line => {
      const trimmed = line.trim();
      return !trimmed.startsWith('category:');
    });

    // 重新组装文件
    const newContent = `---\n${filteredLines.join('\n')}\n---${body}`;

    // 写回文件
    fs.writeFileSync(filePath, newContent, 'utf-8');

    return { processed: true };
  } catch (error) {
    return { processed: false, reason: error.message };
  }
}

function scanDirectory(dir) {
  const stats = {
    total: 0,
    processed: 0,
    skipped: 0,
    errors: 0,
  };

  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        stats.total++;
        const result = processFile(fullPath);

        if (result.processed) {
          stats.processed++;
          console.log(`✓ ${path.relative(BOOKS_DIR, fullPath)}`);
        } else {
          stats.skipped++;
          if (result.reason !== 'no category field' && result.reason !== 'no frontmatter') {
            stats.errors++;
            console.log(`✗ ${path.relative(BOOKS_DIR, fullPath)}: ${result.reason}`);
          }
        }
      }
    }
  }

  scan(dir);
  return stats;
}

console.log('开始清理 category 字段...\n');

const stats = scanDirectory(BOOKS_DIR);

console.log('\n统计:');
console.log(`总文件数: ${stats.total}`);
console.log(`已处理: ${stats.processed}`);
console.log(`跳过: ${stats.skipped}`);
console.log(`错误: ${stats.errors}`);
console.log('\n完成!');
