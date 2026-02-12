import fs from 'fs';
import path from 'path';

/**
 * 规范化作者名称
 * - 移除国籍前缀 【英】【美】等
 * - 多作者用逗号分隔
 * - 移除特殊字符
 */
function normalizeAuthor(author: string): string {
  if (!author) return '';

  // 移除国籍前缀
  let cleaned = author.replace(/【[^】]+】/g, '').trim();

  // 统一分隔符：将各种分隔符转为逗号
  cleaned = cleaned
    .replace(/[;；、]/g, ',')
    .replace(/\s*,\s*/g, ',') // 统一逗号前后空格
    .replace(/,+/g, ','); // 合并多个逗号

  // 移除文件系统不允许的字符
  cleaned = cleaned.replace(/[\\/:*?"<>|]/g, '');

  return cleaned;
}

/**
 * 规范化书名
 * - 移除副标题（冒号后的内容）
 * - 移除特殊字符
 */
function normalizeTitle(title: string): string {
  if (!title) return '';

  // 移除副标题
  let cleaned = title.split(/[：:]/)[0].trim();

  // 移除文件系统不允许的字符
  cleaned = cleaned.replace(/[\\/:*?"<>|]/g, '');

  // 移除多余空格
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * 从文件名生成 slug
 * 文件名格式：作者-书名.md
 */
function generateSlugFromFilename(filename: string): string {
  // 移除扩展名
  const nameWithoutExt = filename.replace(/\.md$/, '');

  // 查找第一个 '-' 分隔符
  const dashIndex = nameWithoutExt.indexOf('-');

  if (dashIndex === -1) {
    // 没有作者，只有书名
    return normalizeTitle(nameWithoutExt);
  }

  const author = normalizeAuthor(nameWithoutExt.substring(0, dashIndex));
  const title = normalizeTitle(nameWithoutExt.substring(dashIndex + 1));

  return `${author}-${title}`;
}

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
 * 为所有书籍添加 slug frontmatter
 */
async function addSlugToFrontmatter() {
  const booksDir = path.join(process.cwd(), '..', 'books');
  const bookFiles = findMarkdownFiles(booksDir);

  const slugMap = new Map<string, string[]>();
  let addedCount = 0;
  let skippedCount = 0;

  console.log(`Found ${bookFiles.length} book files\n`);

  for (const filePath of bookFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);
    const slug = generateSlugFromFilename(filename);

    // 记录 slug，用于检测冲突
    if (!slugMap.has(slug)) {
      slugMap.set(slug, []);
    }
    slugMap.get(slug)!.push(filePath);

    // 检查是否已有 frontmatter
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    let newContent: string;
    if (match) {
      // 已有 frontmatter
      const existingFrontmatter = match[1];

      // 检查是否已有 slug
      if (existingFrontmatter.includes('slug:')) {
        console.log(`⏭️  Skip ${filename}: already has slug`);
        skippedCount++;
        continue;
      }

      // 添加 slug 到 frontmatter 顶部
      newContent = content.replace(
        frontmatterRegex,
        `---\nslug: ${slug}\n${existingFrontmatter}\n---`
      );
    } else {
      // 无 frontmatter，创建新的
      newContent = `---\nslug: ${slug}\n---\n\n${content}`;
    }

    // 写入文件
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ Added slug to ${filename}`);
    console.log(`   Slug: ${slug}\n`);
    addedCount++;
  }

  // 报告统计
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Summary:`);
  console.log(`   Total files: ${bookFiles.length}`);
  console.log(`   Added slugs: ${addedCount}`);
  console.log(`   Skipped (already has slug): ${skippedCount}`);

  // 报告冲突
  const conflicts = Array.from(slugMap.entries())
    .filter(([_, files]) => files.length > 1);

  if (conflicts.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  Slug conflicts detected:\n');
    conflicts.forEach(([slug, files]) => {
      console.log(`  Slug: ${slug}`);
      files.forEach(f => console.log(`    - ${path.basename(f)}`));
      console.log('');
    });
    console.log('Please manually resolve these conflicts by editing the slug field in the frontmatter.');
  } else {
    console.log('   No conflicts detected ✨');
  }

  console.log('='.repeat(60));
}

// 运行脚本
addSlugToFrontmatter().catch(console.error);
