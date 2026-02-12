import fs from 'fs';
import path from 'path';

/**
 * 递归查找所有 .md 文件
 */
function findMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * 从文件内容中提取 slug
 */
function extractSlug(content: string): string | null {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  const frontmatter = match[1];
  const slugMatch = frontmatter.match(/^slug:\s*(.+)$/m);

  return slugMatch ? slugMatch[1].trim() : null;
}

/**
 * 验证所有书籍的 slug 是否唯一
 */
async function validateSlugs() {
  const booksDir = path.join(process.cwd(), '..', 'books');
  const bookFiles = findMarkdownFiles(booksDir);

  const slugMap = new Map<string, string[]>();
  const missingSlug: string[] = [];

  console.log(`Validating slugs for ${bookFiles.length} books...\n`);

  // 收集所有 slug 及其对应的书籍
  for (const filePath of bookFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const slug = extractSlug(content);
    const filename = path.basename(filePath);

    if (!slug) {
      missingSlug.push(filename);
      continue;
    }

    if (!slugMap.has(slug)) {
      slugMap.set(slug, []);
    }
    slugMap.get(slug)!.push(filename);
  }

  // 检查缺失的 slug
  if (missingSlug.length > 0) {
    console.error('❌ Books missing slug field:\n');
    missingSlug.forEach(f => console.error(`  - ${f}`));
    console.error('');
    throw new Error(`${missingSlug.length} books are missing slug field`);
  }

  // 查找冲突
  const conflicts = Array.from(slugMap.entries())
    .filter(([_, files]) => files.length > 1);

  if (conflicts.length > 0) {
    console.error('❌ Slug conflicts detected:\n');
    conflicts.forEach(([slug, files]) => {
      console.error(`  Slug: "${slug}"`);
      files.forEach(f => console.error(`    - ${f}`));
      console.error('');
    });
    console.error('Please manually resolve these conflicts by editing the slug field in the frontmatter.\n');
    throw new Error('Slug validation failed: duplicate slugs found');
  }

  console.log('✅ All slugs are unique');
  console.log(`   Total books: ${bookFiles.length}`);
  console.log(`   Unique slugs: ${slugMap.size}\n`);
}

// 运行验证
validateSlugs().catch(error => {
  console.error(error.message);
  process.exit(1);
});
