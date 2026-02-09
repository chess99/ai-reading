import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')

// 忽略的文件和目录
const ignorePatterns = [
  'node_modules',
  '.vitepress',
  '.git',
  '.DS_Store',
  'package.json',
  'package-lock.json',
  '.gitignore'
]

function shouldIgnore(name) {
  return ignorePatterns.some(pattern => name.includes(pattern))
}

/**
 * 判断是否是内容目录（包含 .md 文件的目录）
 */
function isContentDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    return entries.some(entry => {
      if (shouldIgnore(entry.name)) return false
      if (entry.isFile() && entry.name.endsWith('.md')) return true
      if (entry.isDirectory()) {
        const subPath = path.join(dirPath, entry.name)
        return isContentDirectory(subPath)
      }
      return false
    })
  } catch (error) {
    return false
  }
}

/**
 * 自动发现所有内容分类目录
 */
function discoverCategories() {
  const categories = []
  try {
    const entries = fs.readdirSync(rootDir, { withFileTypes: true })
    entries.forEach(entry => {
      if (!entry.isDirectory() || shouldIgnore(entry.name)) return
      const dirPath = path.join(rootDir, entry.name)
      if (isContentDirectory(dirPath)) {
        categories.push(entry.name)
      }
    })
    categories.sort((a, b) => a.localeCompare(b, 'zh-CN'))
  } catch (error) {
    console.error('Error discovering categories:', error)
  }
  return categories
}

/**
 * 从 Markdown 内容中提取标签
 * 支持格式: #标签1 #标签2 或 tags: [标签1, 标签2]
 */
function extractTags(content, frontmatter) {
  const tags = new Set()

  // 从 frontmatter 中提取
  if (frontmatter.tags) {
    const fmTags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
      : [frontmatter.tags]
    fmTags.forEach(tag => tags.add(tag))
  }

  // 从内容中提取 #标签 格式
  const hashTagRegex = /#([\u4e00-\u9fa5a-zA-Z0-9_]+)/g
  let match
  while ((match = hashTagRegex.exec(content)) !== null) {
    tags.add(match[1])
  }

  return Array.from(tags)
}

/**
 * 获取文件相对于根目录的分类路径
 */
function getCategory(filePath) {
  const relativePath = path.relative(rootDir, filePath)
  const parts = relativePath.split(path.sep)
  return parts[0] || ''
}

/**
 * 处理单个 Markdown 文件
 * 如果没有 frontmatter，则添加基本的 frontmatter
 */
function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data: frontmatter, content: markdownContent } = matter(content)

    // 提取文件名信息
    const fileName = path.basename(filePath, '.md')
    const parts = fileName.split('-')
    const author = parts[0] || ''
    const title = parts.slice(1).join('-') || fileName

    // 获取分类
    const category = getCategory(filePath)

    // 提取标签
    const tags = extractTags(markdownContent, frontmatter)

    // 构建新的 frontmatter
    const newFrontmatter = {
      title: frontmatter.title || title,
      author: frontmatter.author || author,
      category: frontmatter.category || category,
      tags: tags.length > 0 ? tags : (frontmatter.tags || []),
      ...frontmatter
    }

    // 如果 frontmatter 有变化，更新文件
    const originalFrontmatter = JSON.stringify(frontmatter)
    const updatedFrontmatter = JSON.stringify(newFrontmatter)

    if (originalFrontmatter !== updatedFrontmatter) {
      const newContent = matter.stringify(markdownContent, newFrontmatter)
      fs.writeFileSync(filePath, newContent, 'utf-8')
      console.log(`Updated: ${path.relative(rootDir, filePath)}`)
      return true
    }

    return false
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return false
  }
}

/**
 * 递归处理目录中的所有 Markdown 文件
 */
function processDirectory(dirPath) {
  let updatedCount = 0

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    entries.forEach(entry => {
      if (shouldIgnore(entry.name)) return

      const fullPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        updatedCount += processDirectory(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        if (processMarkdownFile(fullPath)) {
          updatedCount++
        }
      }
    })
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message)
  }

  return updatedCount
}

/**
 * 为每个分类目录创建索引页（带书籍列表）
 */
function createCategoryIndex(category) {
  const categoryPath = path.join(rootDir, category)
  const indexPath = path.join(categoryPath, 'index.md')

  // 获取该分类下的所有书籍
  const books = []

  function scanBooks(dirPath, relativePath = '') {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true })

      entries.forEach(entry => {
        if (shouldIgnore(entry.name)) return

        const fullPath = path.join(dirPath, entry.name)
        const newRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name

        if (entry.isDirectory()) {
          scanBooks(fullPath, newRelativePath)
        } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
          const fileName = entry.name.replace('.md', '')
          const parts = fileName.split('-')
          const author = parts[0] || ''
          const title = parts.slice(1).join('-') || fileName

          books.push({
            fileName: entry.name,
            author,
            title,
            path: relativePath ? `${relativePath}/${entry.name}` : entry.name
          })
        }
      })
    } catch (error) {
      console.error(`Error scanning books in ${dirPath}:`, error.message)
    }
  }

  scanBooks(categoryPath)

  // 按书名排序
  books.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))

  // 生成书籍列表 HTML
  const booksList = books.map(book =>
    `  <a href="${book.fileName.replace('.md', '')}" class="book-link">
    <span class="book-title">${book.title}</span>
    <span class="book-author">${book.author}</span>
  </a>`
  ).join('\n')

  const indexContent = `---
title: ${category}
layout: page
---

<div class="category-index">
  <h1 class="category-title">${category}</h1>
  <p class="category-stats">共 ${books.length} 本书籍</p>

  <div class="books-list">
${booksList}
  </div>
</div>

<style scoped>
.category-index {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.category-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin: 0 0 8px 0;
}

.category-stats {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0 0 32px 0;
}

.books-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.book-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.book-link:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateX(4px);
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
}

.book-author {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-left: 16px;
}

@media (max-width: 768px) {
  .book-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .book-author {
    margin-left: 0;
    font-size: 13px;
  }
}
</style>
`

  try {
    fs.writeFileSync(indexPath, indexContent, 'utf-8')
    console.log(`Created index for: ${category} (${books.length} books)`)
  } catch (error) {
    console.error(`Error creating index for ${category}:`, error.message)
  }
}

/**
 * 生成首页的 features 配置
 */
function generateHomeFeatures() {
  const categories = discoverCategories()
  const indexPath = path.join(rootDir, 'index.md')

  // 读取现有的 index.md
  if (!fs.existsSync(indexPath)) {
    console.log('index.md not found, skipping home features generation')
    return
  }

  try {
    const content = fs.readFileSync(indexPath, 'utf-8')
    const { data: frontmatter, content: markdownContent } = matter(content)

    // 为每个分类生成 feature
    const features = categories.map(category => ({
      title: category,
      details: `${category}相关的阅读笔记`,
      link: `/${category}/`
    }))

    // 更新 frontmatter
    if (frontmatter.features) {
      // 只更新缺失的分类
      const existingTitles = new Set(frontmatter.features.map(f => f.title))
      features.forEach(feature => {
        if (!existingTitles.has(feature.title)) {
          frontmatter.features.push(feature)
        }
      })
    }

    // 注意：这里不自动更新 index.md，避免覆盖用户自定义内容
    // 如果需要，可以手动更新
  } catch (error) {
    console.error('Error generating home features:', error.message)
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 Starting prebuild process...\n')

  const categories = discoverCategories()
  console.log(`📁 Discovered ${categories.length} categories:`, categories.join(', '))
  console.log()

  let totalUpdated = 0

  categories.forEach(category => {
    const categoryPath = path.join(rootDir, category)

    if (fs.existsSync(categoryPath)) {
      console.log(`Processing category: ${category}`)
      const updated = processDirectory(categoryPath)
      totalUpdated += updated

      // 创建分类索引页
      createCategoryIndex(category)
    }
  })

  // 生成首页 features（可选）
  generateHomeFeatures()

  console.log(`\n✅ Prebuild completed! Updated ${totalUpdated} files.`)
}

// 运行主函数
main()
