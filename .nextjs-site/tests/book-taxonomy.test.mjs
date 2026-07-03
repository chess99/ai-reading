import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const booksDir = path.join(repoRoot, 'books');
const topicsDir = path.join(repoRoot, 'topics');

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

const allowedTopLevel = new Set([
  '思维科学',
  '自我管理',
  '心理修复',
  '关系家庭',
  '职业组织',
  '商业产品',
  '金钱投资',
  '社会公共',
  '历史世界',
  '科技媒介',
  '人文艺术',
  '健康身体',
]);

const allowedShelves = new Set([
  '思维科学/决策判断',
  '思维科学/证据科学',
  '思维科学/系统复杂',
  '思维科学/概率风险',
  '思维科学/行为经济',
  '自我管理/习惯行动',
  '自我管理/专注效率',
  '自我管理/学习练习',
  '自我管理/时间精力',
  '自我管理/职业发展',
  '自我管理/表达输出',
  '心理修复/心理通论',
  '心理修复/情绪内耗',
  '心理修复/自尊成长',
  '心理修复/创伤修复',
  '心理修复/成瘾自控',
  '关系家庭/亲密关系',
  '关系家庭/沟通冲突',
  '关系家庭/家庭教育',
  '关系家庭/儿童发展',
  '职业组织/管理通论',
  '职业组织/组织领导',
  '职业组织/权力变革',
  '职业组织/运营流程',
  '职业组织/教练协作',
  '商业产品/商业战略',
  '商业产品/产品管理',
  '商业产品/创业方法',
  '商业产品/市场增长',
  '商业产品/用户体验',
  '商业产品/商业模式',
  '商业产品/经营财务',
  '金钱投资/理财入门',
  '金钱投资/价值投资',
  '金钱投资/交易系统',
  '金钱投资/交易心理',
  '金钱投资/宏观周期',
  '金钱投资/经济学',
  '社会公共/社会理论',
  '社会公共/法律公共',
  '社会公共/政治制度',
  '社会公共/媒介传播',
  '社会公共/性别结构',
  '社会公共/城市环境',
  '社会公共/技术社会',
  '历史世界/中国历史',
  '历史世界/世界历史',
  '历史世界/国际秩序',
  '历史世界/传记回忆',
  '科技媒介/AI变革',
  '科技媒介/平台算法',
  '科技媒介/未来技术',
  '科技媒介/信息网络',
  '人文艺术/文学阅读',
  '人文艺术/写作技艺',
  '人文艺术/叙事创作',
  '人文艺术/艺术美学',
  '人文艺术/设计视觉',
  '人文艺术/人生哲学',
  '人文艺术/中国哲学',
  '人文艺术/政治哲学',
  '健康身体/医学生理',
  '健康身体/营养代谢',
  '健康身体/睡眠恢复',
  '健康身体/运动训练',
  '健康身体/衰老照护',
]);

function scanMarkdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function loadBookBySlug() {
  const bySlug = new Map();
  const files = scanMarkdownFiles(booksDir);

  for (const filePath of files) {
    const relativePath = toRepoPath(filePath);
    const parts = relativePath.split('/');
    const categories = parts.slice(1, -1);
    const { data } = matter(readFileSync(filePath, 'utf8'));

    assert.equal(parts[0], 'books', `${relativePath} should be under books/`);
    assert.equal(categories.length, 2, `${relativePath} should use exactly two category levels`);
    assert.ok(allowedTopLevel.has(categories[0]), `${relativePath} should use an allowed top-level category`);
    assert.ok(allowedShelves.has(categories.join('/')), `${relativePath} should use an approved second-level shelf`);
    assert.equal(typeof data.slug, 'string', `${relativePath} should have slug`);
    assert.match(data.slug, /^[a-z0-9-]+$/, `${relativePath} slug should be URL-safe`);
    assert.equal(typeof data.title, 'string', `${relativePath} should have title`);
    assert.equal(typeof data.author, 'string', `${relativePath} should have author`);
    assert.ok(Array.isArray(data.tags), `${relativePath} tags should be an inline array parsed as an array`);
    assert.match(String(data.date), /^\d{4}-\d{2}-\d{2}$/, `${relativePath} date should be YYYY-MM-DD`);

    assert.equal(bySlug.has(data.slug), false, `${relativePath} slug should be unique: ${data.slug}`);
    bySlug.set(data.slug, { relativePath, data });
  }

  return bySlug;
}

test('books use the approved two-level taxonomy and stable frontmatter', () => {
  assert.equal(existsSync(booksDir), true, 'books/ directory should exist');
  loadBookBySlug();
});

test('topic book paths point to the file for the referenced slug', () => {
  const bySlug = loadBookBySlug();
  const topicFiles = scanMarkdownFiles(topicsDir);

  for (const filePath of topicFiles) {
    const relativeTopicPath = toRepoPath(filePath);
    const { data } = matter(readFileSync(filePath, 'utf8'));
    const books = data.books || [];
    assert.ok(Array.isArray(books), `${relativeTopicPath} books should be an array when present`);

    for (const [index, book] of books.entries()) {
      const label = `${relativeTopicPath} books[${index}]`;
      if (book.status !== 'in_library') continue;

      assert.equal(typeof book.slug, 'string', `${label} should include slug`);
      assert.equal(typeof book.path, 'string', `${label} should include path`);
      const referenced = bySlug.get(book.slug);
      assert.ok(referenced, `${label} should reference an existing book slug: ${book.slug}`);
      assert.equal(book.path, referenced.relativePath, `${label} path should match the referenced book slug`);
    }
  }
});
