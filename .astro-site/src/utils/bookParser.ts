/**
 * 从文件路径解析书籍信息
 * 支持多种文件名格式：
 * - 标准格式: "作者-书名.md"
 * - 多作者: "作者1,作者2-书名.md" 或 "作者1；作者2-书名.md"
 * - 带国籍: "【英】作者-书名.md"
 * - 带副标题: "作者-书名：副标题.md"
 */

export interface BookInfo {
  id: string;
  category: string;
  author: string;
  title: string;
  slug: string;
}

export function parseBookInfo(id: string): BookInfo {
  // id 格式: "分类/文件名.md"
  const parts = id.split('/');

  if (parts.length < 2) {
    throw new Error(`Invalid book id format: ${id}`);
  }

  const category = parts[0];
  const filename = parts[parts.length - 1];
  const nameWithoutExt = filename.replace(/\.md$/, '');

  // 去除国籍前缀 【英】【美】等
  let cleaned = nameWithoutExt.replace(/^【[^】]+】/, '').trim();

  // 分割作者和书名（用 - 分隔）
  const dashIndex = cleaned.indexOf('-');
  if (dashIndex === -1) {
    // 没有 - 分隔符，整个当作书名
    return {
      id: id.replace(/\.md$/, ''),
      category,
      author: '',
      title: cleaned,
      slug: id.replace(/\.md$/, ''),
    };
  }

  let author = cleaned.substring(0, dashIndex).trim();
  let titlePart = cleaned.substring(dashIndex + 1).trim();

  // 统一作者分隔符：将 ； 替换为 ,
  author = author.replace(/；/g, ',');

  // 去除副标题（: 或 ： 之后的内容）
  const title = titlePart.split(/[：:]/)[0].trim();

  return {
    id: id.replace(/\.md$/, ''),
    category,
    author,
    title,
    slug: id.replace(/\.md$/, ''),
  };
}

/**
 * 格式化作者名称用于显示
 */
export function formatAuthor(author: string): string {
  if (!author) return '';

  // 如果有多个作者，用中文顿号分隔
  return author.split(',').map(a => a.trim()).join('、');
}

/**
 * 生成书籍的规范文件名
 * 用于 BookDistill 生成文件时参考
 */
export function generateBookFilename(authors: string[], title: string): string {
  const authorPart = authors.join(',');
  // 移除书名中的特殊字符
  const cleanTitle = title.replace(/[：:]/g, '').trim();
  return `${authorPart}-${cleanTitle}.md`;
}
