import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const root = fileURLToPath(new URL('../..', import.meta.url));
const output = path.join(root, 'docs/topic-book-backlog.md');
const topics = fs.readdirSync(path.join(root, 'topics')).filter(file => file.endsWith('.md'))
  .map(file => matter(fs.readFileSync(path.join(root, 'topics', file), 'utf8')).data);
const pending = new Map();
for (const topic of topics) {
  for (const book of topic.books.filter(item => item.status === 'planned')) {
    const key = `${book.title}|${book.author}`;
    const entry = pending.get(key) || { ...book, topics: [], starts: 0 };
    entry.topics.push(topic);
    if (book.reading === 'start') entry.starts++;
    pending.set(key, entry);
  }
}
const books = [...pending.values()].sort((a, b) => b.starts - a.starts || b.topics.length - a.topics.length || a.title.localeCompare(b.title, 'zh-CN'));
const cell = text => String(text || '—').replaceAll('|', '\\|').replaceAll('\n', ' ');
const lines = [
  '# 主题书单待入库作品', '',
  `当前有 ${books.length} 部作品待补解读，涉及 ${new Set(books.flatMap(book => book.topics.map(topic => topic.slug))).size} 个主题。`, '',
  '本表从主题书单汇总，以作品与作者区分同名书；起读用途和出现次数用于安排入库，不代表作品质量排名。版本、译名和购买信息需在入库时核对，不能把同名馆藏直接替换进来。', '',
  '更新方式：运行 `.nextjs-site/scripts/generate-topic-backlog.mjs`；使用 `--check` 可检查本表是否与主题一致。', '',
  '| 作品 | 作者 | 原作标题 | 起读用途 | 所在主题 |', '|---|---|---|---:|---|',
  ...books.map(book => `| ${cell(book.title)} | ${cell(book.author)} | ${cell(book.originalTitle)} | ${book.starts} | ${book.topics.map(topic => `[${topic.title}](../topics/${topic.slug}.md)`).join('、')} |`), '',
];
const content = lines.join('\n');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8').replaceAll('\r\n', '\n') !== content) {
    console.error('Topic book backlog is out of date.');
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(output, content);
  console.log(`Updated backlog: ${books.length} works.`);
}
