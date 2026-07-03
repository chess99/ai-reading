import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const topicsDir = path.join(repoRoot, 'topics');
const booksDir = path.join(repoRoot, 'books');
const panoramaPath = path.join(repoRoot, 'docs/superpowers/plans/2026-06-01-topic-reading-panorama.md');

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}
const topicLayers = new Set(['入门', '框架', '系统']);
const slugByTitle = new Map([
  ['如何做重大决策', 'zhong-da-jue-ce'],
  ['什么是系统思维与复杂性', 'xi-tong-fu-za-xing'],
  ['如何建立批判性与证据判断', 'zheng-ju-pan-duan'],
  ['如何识别偏见、从众与服从', 'pian-jian-cong-zhong-fu-cong'],
  ['如何理解概率、风险与预测', 'gai-lv-feng-xian-yu-ce'],
  ['如何建立科学世界观', 'ke-xue-shi-jie-guan'],
  ['如何建立可持续习惯', 'ke-chi-xu-xi-guan'],
  ['如何提高深度工作能力', 'shen-du-gong-zuo'],
  ['如何管理时间、精力与个人系统', 'shi-jian-jing-li-xi-tong'],
  ['如何长期坚持学习', 'chang-qi-xue-xi'],
  ['阅读、笔记与输出系统', 'yue-du-bi-ji-shu-chu'],
  ['写作与创意工作', 'xie-zuo-chuang-yi'],
  ['如何理解情绪', 'qing-xu'],
  ['理解焦虑与抑郁', 'jiao-lv-yi-yu'],
  ['如何停止精神内耗', 'jing-shen-nei-hao'],
  ['如何建立稳定的自尊', 'wen-ding-zi-zun'],
  ['如何面对创伤与自我修复', 'chuang-shang-xiu-fu'],
  ['面对丧失、哀伤与死亡', 'sang-shi-ai-shang-si-wang'],
  ['成瘾、自控与意义重建', 'cheng-yin-zi-kong'],
  ['亲密关系阅读路径', 'qin-mi-guan-xi'],
  ['如何处理亲密关系中的冲突', 'qin-mi-chong-tu'],
  ['如何识别关系中的安全、边界与退出风险', 'guan-xi-an-quan-bian-jie'],
  ['如何提升沟通与表达', 'gou-tong-biao-da'],
  ['如何做足够好的父母', 'zu-gou-hao-de-fu-mu'],
  ['如何理解儿童安全感与教育成长', 'er-tong-an-quan-gan'],
  ['职业选择阅读路径', 'zhi-ye-xuan-ze'],
  ['如何建立长期职业资本', 'zhi-ye-zi-ben'],
  ['如何成为有效管理者', 'you-xiao-guan-li-zhe'],
  ['如何建立领导力与团队协作', 'ling-dao-li-tuan-dui'],
  ['看懂组织运转', 'zu-zhi-yun-zhuan'],
  ['如何理解组织中的权力与变革', 'quan-li-bian-ge'],
  ['如何验证产品机会', 'chan-pin-ji-hui'],
  ['如何做好产品发现', 'chan-pin-fa-xian'],
  ['产品从 0 到 1', 'chan-pin-0-dao-1'],
  ['如何建立产品组织与交付系统', 'chan-pin-zu-zhi-jiao-fu'],
  ['如何做增长与营销', 'zeng-zhang-ying-xiao'],
  ['如何设计商业模式与理解公司经营', 'shang-ye-mo-shi-jing-ying'],
  ['如何理解商业竞争、战略与平台效应', 'jing-zheng-zhan-lve-ping-tai'],
  ['建立财务常识', 'cai-wu-chang-shi'],
  ['普通人如何长期投资', 'chang-qi-tou-zi'],
  ['如何理解价值投资', 'jia-zhi-tou-zi'],
  ['如何理解交易、周期与市场风险', 'jiao-yi-zhou-qi-feng-xian'],
  ['如何理解经济运行', 'jing-ji-yun-xing'],
  ['如何理解行为经济学与金钱心理', 'xing-wei-jing-ji-xue'],
  ['看懂消费主义、财富与阶层机会', 'xiao-fei-zhu-yi-jie-ceng'],
  ['社会学如何看共同生活', 'she-hui-xue-gong-tong-sheng-huo'],
  ['如何理解公平与正义', 'gong-ping-zheng-yi'],
  ['如何识别制度与权力', 'zhi-du-quan-li'],
  ['如何建立法律常识', 'fa-lv-chang-shi'],
  ['如何理解媒体、舆论与公共讨论', 'mei-ti-gong-gong-tao-lun'],
  ['城市、空间与生活方式', 'cheng-shi-kong-jian'],
  ['如何理解性别与社会结构', 'xing-bie-she-hui-jie-gou'],
  ['中国社会的现代转型', 'zhong-guo-xian-dai-zhuan-xing'],
  ['中国历史入门', 'zhong-guo-li-shi'],
  ['如何理解世界历史', 'shi-jie-li-shi'],
  ['如何理解文明兴衰', 'wen-ming-xing-shuai'],
  ['如何理解国际秩序与地缘风险', 'guo-ji-zhi-xu-di-yuan'],
  ['技术社会读什么', 'ji-shu-she-hui'],
  ['普通人如何理解 AI 变革', 'ai-bian-ge'],
  ['AI 风险、治理与技术权力', 'ai-feng-xian-zhi-li'],
  ['看懂平台、算法与注意力风险', 'ping-tai-suan-fa-zhu-yi-li'],
  ['数字公共生活与信息网络', 'shu-zi-gong-gong-sheng-huo'],
  ['文学与人文阅读入门', 'wen-xue-ren-wen'],
  ['艺术与审美入门', 'yi-shu-shen-mei'],
  ['如何理解幸福', 'xing-fu'],
  ['人生哲学入门', 'ren-sheng-zhe-xue'],
  ['如何读懂痛苦、自由与意义', 'tong-ku-zi-you-yi-yi'],
  ['如何建立健康生活方式', 'jian-kang-sheng-huo'],
  ['如何理解压力、恢复与身体信号', 'ya-li-hui-fu'],
  ['如何理解运动与体能', 'yun-dong-ti-neng'],
  ['如何理解饮食与代谢', 'yin-shi-dai-xie'],
  ['面对衰老、疾病与照护', 'shuai-lao-ji-bing-zhao-hu'],
  ['如何理解环境、气候与可持续生活', 'huan-jing-qi-hou-ke-chi-xu'],
]);
const bannedTemplatePhrases = [
  '难点，通常不在于缺少信息',
  '它让前面的入口判断继续向前推进',
  '从一个模糊感受整理成可以分析',
  '真正有用的阅读路径，需要先让问题变清楚',
];

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

function extractBookTitles(readingPath) {
  return [...readingPath.matchAll(/《([^》]+)》/g)].map(match => match[1]);
}

function loadBooksBySlug() {
  const booksBySlug = new Map();
  for (const filePath of scanMarkdownFiles(booksDir)) {
    const relativePath = toRepoPath(filePath);
    const { data } = matter(readFileSync(filePath, 'utf8'));

    if (typeof data.slug === 'string' && data.slug.trim()) {
      booksBySlug.set(data.slug, { ...data, relativePath });
    }
  }
  return booksBySlug;
}

function loadExpectedTopics() {
  const rows = [];
  const rawPlan = readFileSync(panoramaPath, 'utf8');

  for (const line of rawPlan.split(/\r?\n/)) {
    if (!line.startsWith('|') || !line.includes(' -> ')) continue;

    const columns = line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(column => column.trim());

    const [layer, title, readingPath, gradient] = columns;
    if (!topicLayers.has(layer)) continue;

    const slug = slugByTitle.get(title);
    assert.ok(slug, `topic title should have an approved concise slug: ${title}`);
    rows.push({
      layer,
      title,
      slug,
      books: extractBookTitles(readingPath),
      gradient,
    });
  }

  return rows;
}

test('topic markdown files follow the panorama production model', () => {
  assert.equal(existsSync(topicsDir), true, 'topics/ directory should exist');

  const expectedTopics = loadExpectedTopics();
  assert.equal(expectedTopics.length, 73, 'panorama should define 73 topic candidates');

  const expectedBySlug = new Map(expectedTopics.map(topic => [topic.slug, topic]));
  const booksBySlug = loadBooksBySlug();
  const topicFiles = scanMarkdownFiles(topicsDir);
  assert.equal(topicFiles.length, expectedBySlug.size, 'topics/ should ship every panorama topic article');

  const slugs = new Set();

  for (const filePath of topicFiles) {
    const relativePath = toRepoPath(filePath);
    const { data, content } = matter(readFileSync(filePath, 'utf8'));

    assert.equal(typeof data.slug, 'string', `${relativePath} should have a slug`);
    assert.match(data.slug, /^[a-z0-9-]+$/, `${relativePath} slug should be URL-safe`);
    assert.equal(slugs.has(data.slug), false, `${relativePath} slug should be unique`);
    slugs.add(data.slug);

    const expected = expectedBySlug.get(data.slug);
    assert.ok(expected, `${relativePath} slug should match a panorama topic`);
    assert.equal(data.title, expected.title, `${relativePath} title should match the panorama`);
    assert.equal(typeof data.description, 'string', `${relativePath} should have a description`);
    assert.ok(Array.isArray(data.tags) && data.tags.length > 0, `${relativePath} should have tags`);
    assert.equal(typeof data.date, 'string', `${relativePath} should have a date`);
    assert.match(data.date, /^\d{4}-\d{2}-\d{2}$/, `${relativePath} date should use YYYY-MM-DD`);
    const topicBooks = data.books || [];
    assert.ok(Array.isArray(topicBooks), `${relativePath} books should be an array when present`);
    assert.ok(content.trim().length > 300, `${relativePath} should include a substantive guide body`);
    assert.match(content, /^#\s+/m, `${relativePath} should include a first-level title`);
    assert.match(content, /## 建议读法/, `${relativePath} should include reading advice`);
    for (const phrase of bannedTemplatePhrases) {
      assert.equal(content.includes(phrase), false, `${relativePath} should not contain template phrase: ${phrase}`);
    }

    for (const [index, book] of topicBooks.entries()) {
      const label = `${relativePath} books[${index}]`;
      assert.equal(typeof book.title, 'string', `${label} should have a title`);
      assert.equal(typeof book.author, 'string', `${label} should have an author`);
      assert.equal(typeof book.role, 'string', `${label} should have a role`);
      assert.equal(typeof book.reason, 'string', `${label} should have a reason`);
      assert.match(book.status, /^(in_library|planned)$/, `${label} should have a supported status`);

      if (book.slug || book.status === 'in_library') {
        assert.equal(typeof book.slug, 'string', `${label} in-library reference should have a slug`);
        const referencedBook = booksBySlug.get(book.slug);
        assert.ok(referencedBook, `${label} should reference an existing book slug: ${book.slug}`);

        if (book.path) {
          assert.equal(book.path, referencedBook.relativePath, `${label} path should match referenced book file`);
        }
      }
    }
  }

  assert.deepEqual(slugs, new Set(expectedBySlug.keys()), 'topics/ should include exactly the panorama slugs');
});
