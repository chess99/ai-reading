import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
const root = fileURLToPath(new URL('../..', import.meta.url));
const scan = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? scan(path.join(dir, e.name)) : e.name.endsWith('.md') ? [path.join(dir, e.name)] : []);
const load = file => ({ ...matter(readFileSync(file, 'utf8')), file });
const topics = scan(path.join(root, 'topics')).map(load);
const library = new Map(scan(path.join(root, 'books')).map(file => { const { data } = load(file); return [data.slug, { ...data, path: path.relative(root, file).split(path.sep).join('/') }]; }));
const legacy = JSON.parse(readFileSync(new URL('../data/topic-legacy-routes.json', import.meta.url), 'utf8'));
const bySlug = new Map(topics.map(t => [t.data.slug, t]));

test('topics declare usable entry points, reading choices and valid related topics', () => {
  assert.ok(topics.length > 0);
  assert.equal(bySlug.size, topics.length, 'topic slugs must be unique');
  for (const { data: t, content, file } of topics) {
    assert.match(t.slug, /^[a-z0-9-]+$/, file);
    assert.equal(path.basename(file), `${t.slug}.md`);
    for (const field of ['title', 'description', 'entry']) assert.ok(typeof t[field] === 'string' && t[field].trim(), `${file}: ${field}`);
    assert.match(t.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(['path', 'comparison', 'collection'].includes(t.mode));
    assert.ok(t.domains.length > 0 && t.domains.every(d => typeof d === 'string' && d.trim()));
    assert.equal(new Set(t.domains).size, t.domains.length);
    assert.equal(t.domain, t.domains[0]);
    assert.ok(Array.isArray(t.tags) && t.tags.length);
    assert.equal(t.parent, undefined, 'reading access must not require a parent topic');
    assert.ok(Array.isArray(t.books) && t.books.some(b => b.reading === 'start'), `${file}: missing start`);
    assert.ok(content.trim().length > 300, `${file}: insufficient editorial content`);
    assert.ok(content.trimStart().startsWith(`# ${t.title}\n`), `${file}: title mismatch`);
    assert.equal(new Set(t.related).size, t.related.length);
    for (const slug of t.related) { assert.notEqual(slug, t.slug); assert.ok(bySlug.has(slug), `${file}: missing related ${slug}`); }
    const identities = new Set();
    for (const b of t.books) {
      const label = `${t.slug}: ${b.title}`;
      for (const field of ['title', 'author', 'role', 'reason']) assert.ok(typeof b[field] === 'string' && b[field].trim(), `${label}: ${field}`);
      assert.ok(['start', 'next', 'compare', 'optional', 'reference'].includes(b.reading), label);
      const identity = `${b.title}|${b.author}`;
      assert.equal(identities.has(identity), false, `${label}: duplicate`); identities.add(identity);
      assert.ok(['in_library', 'planned'].includes(b.status), label);
      if (b.status === 'planned') {
        assert.equal(b.slug, undefined, `${label}: planned books cannot invent library routes`);
        assert.equal(b.path, undefined, `${label}: planned books cannot invent paths`);
      } else {
        const actual = library.get(b.slug);
        assert.ok(actual, `${label}: missing book`);
        assert.equal(b.title, actual.title, `${label}: title identity`);
        assert.equal(b.author, actual.author, `${label}: author identity`);
        assert.equal(b.path, actual.path, `${label}: path identity`);
        assert.ok(existsSync(path.join(root, b.path)));
      }
    }
  }
});

test('historical URLs resolve directly to active topics, including splits', () => {
  assert.equal(new Set(legacy.map(route => route.slug)).size, legacy.length);
  for (const route of legacy) {
    assert.match(route.slug, /^[a-z0-9-]+$/);
    assert.equal(bySlug.has(route.slug), false, `${route.slug}: must not shadow active content`);
    assert.ok(route.targets.length > 0);
    assert.equal(new Set(route.targets).size, route.targets.length);
    for (const target of route.targets) assert.ok(bySlug.has(target), `${route.slug}: invalid target ${target}`);
  }
  for (const retired of ['cong-0-dao-1-zuo-chan-pin', 'qin-mi-chong-tu', 'cheng-yin-zi-kong', 'ling-dao-li-tuan-dui']) {
    assert.ok(legacy.some(route => route.slug === retired), `missing historical route ${retired}`);
  }
  assert.equal(legacy.find(route => route.slug === 'jiao-yi-zhou-qi-feng-xian').targets.length, 2);
});

test('same-title replacements preserve the intended work rather than reusing an unrelated library book', () => {
  const decisionBook = bySlug.get('zhong-da-jue-ce').data.books.find(book => book.title === '对赌');
  assert.equal(decisionBook.author, '安妮·杜克');
  assert.equal(decisionBook.originalTitle, 'Thinking in Bets');
  assert.equal(decisionBook.status, 'planned');
  const relationshipBook = bySlug.get('guan-xi-an-quan-bian-jie').data.books.find(book => book.title === '情绪勒索');
  assert.equal(relationshipBook.originalTitle, 'Emotional Blackmail');
  assert.equal(relationshipBook.status, 'planned');
  assert.equal(bySlug.get('xi-tong-fu-za-xing').data.books.some(book => book.slug === 'tan-xing'), false);
  assert.equal(bySlug.get('ya-li-hui-fu').data.books.some(book => book.slug === 'shen-ti-shi-yong-shou-ce'), false);
});

test('public guides do not contain production history or prescribed book counts', () => {
  const production = /按计划|计划中的|保持\s*\d+\s*本|本轮|上一轮|用户要求|controller|worker|不再借.{0,40}撑篇幅|从“金钱”领域移回|逐步建立框架、实践判断和系统视角/;
  for (const { data, content } of topics) {
    assert.doesNotMatch(`${data.description}\n${data.entry}\n${content}`, production, data.slug);
  }
});
