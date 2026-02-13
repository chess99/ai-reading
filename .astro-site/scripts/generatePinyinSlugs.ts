import fs from 'fs';
import path from 'path';
import { pinyin } from 'pinyin-pro';

/**
 * 将中文转换为拼音 slug（保留英文）
 */
function chineseToPinyinSlug(text: string): string {
  // 检测是否包含中文字符
  const hasChinese = /[\u4e00-\u9fa5]/.test(text);

  if (!hasChinese) {
    // 纯英文，直接处理
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\-]/g, '-')  // 移除非字母数字和连字符
      .replace(/-+/g, '-')            // 合并多个连字符
      .replace(/^-|-$/g, '')          // 移除首尾连字符
      .substring(0, 60);              // 限制长度
  }

  // 包含中文，转换为拼音
  const pinyinText = pinyin(text, {
    toneType: 'none',  // 不带声调
    type: 'array',     // 返回数组
  });

  return pinyinText
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-')  // 移除非字母数字和连字符
    .replace(/-+/g, '-')            // 合并多个连字符
    .replace(/^-|-$/g, '')          // 移除首尾连字符
    .substring(0, 60);              // 限制长度
}

/**
 * 从文件名生成拼音 slug（只用书名）
 */
function generateSlugFromFilename(filename: string): string {
  // 移除 .md 扩展名
  const nameWithoutExt = filename.replace(/\.md$/, '');

  // 移除国籍前缀
  const cleaned = nameWithoutExt.replace(/^【[^】]+】/, '').trim();

  // 分割作者和书名
  const dashIndex = cleaned.indexOf('-');
  if (dashIndex === -1) {
    return chineseToPinyinSlug(cleaned);
  }

  const title = cleaned.substring(dashIndex + 1).trim();

  // 移除副标题（冒号后的内容）
  const titlePart = title.split(/[：:]/)[0].trim();

  // 提取语言标识 (En)、(Zh) 等
  const langMatch = titlePart.match(/\((?:En|Zh)\)$/i);
  const langSuffix = langMatch ? langMatch[0].toLowerCase().replace(/[()]/g, '') : '';

  // 移除括号内容（如 (En)、(Zh)）
  const cleanTitle = titlePart.replace(/\s*\([^)]+\)\s*/g, ' ').trim();

  // 转换为拼音
  const baseSlug = chineseToPinyinSlug(cleanTitle);

  // 如果有语言标识，添加到末尾
  return langSuffix ? `${baseSlug}-${langSuffix}` : baseSlug;
}

/**
 * 递归获取所有 .md 文件
 */
function getAllMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * 更新文件的 frontmatter
 */
function updateFrontmatter(filePath: string, newSlug: string): { oldSlug: string; newSlug: string } {
  const content = fs.readFileSync(filePath, 'utf-8');

  // 提取现有的 slug
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    console.log(`⚠️  No frontmatter in ${filePath}`);
    return { oldSlug: '', newSlug };
  }

  const frontmatter = match[1];
  const slugMatch = frontmatter.match(/^slug:\s*(.+)$/m);
  const oldSlug = slugMatch ? slugMatch[1].trim() : '';

  // 替换 slug
  let newContent: string;
  if (slugMatch) {
    newContent = content.replace(
      /^slug:\s*.+$/m,
      `slug: ${newSlug}`
    );
  } else {
    // 如果没有 slug，添加到 frontmatter 开头
    newContent = content.replace(
      frontmatterRegex,
      `---\nslug: ${newSlug}\n${frontmatter}\n---`
    );
  }

  fs.writeFileSync(filePath, newContent, 'utf-8');
  return { oldSlug, newSlug };
}

function main() {
  const booksDir = path.join(process.cwd(), '../books');
  const bookFiles = getAllMarkdownFiles(booksDir);

  console.log(`\n📚 Found ${bookFiles.length} books\n`);

  const slugMap = new Map<string, string[]>();
  const changes: Array<{ file: string; oldSlug: string; newSlug: string; filePath: string }> = [];

  // 第一遍：生成所有 slug 并检测冲突
  for (const filePath of bookFiles) {
    const filename = path.basename(filePath);
    const relativePath = path.relative(booksDir, filePath);
    const newSlug = generateSlugFromFilename(filename);

    if (!slugMap.has(newSlug)) {
      slugMap.set(newSlug, []);
    }
    slugMap.get(newSlug)!.push(relativePath);

    // 读取现有 slug
    const content = fs.readFileSync(filePath, 'utf-8');
    const slugMatch = content.match(/^slug:\s*(.+)$/m);
    const oldSlug = slugMatch ? slugMatch[1].trim() : '';

    changes.push({ file: relativePath, oldSlug, newSlug, filePath });
  }

  // 检测冲突
  const conflicts = Array.from(slugMap.entries())
    .filter(([_, files]) => files.length > 1);

  if (conflicts.length > 0) {
    console.log('⚠️  Slug conflicts detected:\n');
    conflicts.forEach(([slug, files]) => {
      console.log(`  ${slug}:`);
      files.forEach(f => console.log(`    - ${f}`));
    });
    console.log('\n💡 Adding author prefix to resolve conflicts...\n');

    // 解决冲突：添加作者前缀
    conflicts.forEach(([slug, files]) => {
      files.forEach((file, index) => {
        const change = changes.find(c => c.file === file);
        if (change) {
          const filename = path.basename(file);
          const nameWithoutExt = filename.replace(/\.md$/, '');
          const dashIndex = nameWithoutExt.indexOf('-');

          if (dashIndex !== -1) {
            const author = nameWithoutExt.substring(0, dashIndex).trim();
            const firstAuthor = author.split(/[,，；、]/)[0].trim();
            const authorSlug = chineseToPinyinSlug(firstAuthor);
            change.newSlug = `${authorSlug}-${slug}`;
          } else {
            // 如果没有作者，添加数字后缀
            change.newSlug = `${slug}-${index + 1}`;
          }
        }
      });
    });
  }

  // 第二遍：更新文件
  let updated = 0;
  let unchanged = 0;

  for (const { file, oldSlug, newSlug, filePath } of changes) {
    if (oldSlug === newSlug) {
      unchanged++;
      continue;
    }

    updateFrontmatter(filePath, newSlug);
    updated++;
    console.log(`✓ ${file}`);
    console.log(`  ${oldSlug || '(no slug)'} → ${newSlug}\n`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Complete!`);
  console.log(`   Updated: ${updated} books`);
  console.log(`   Unchanged: ${unchanged} books`);
  console.log('='.repeat(60) + '\n');
}

main();
