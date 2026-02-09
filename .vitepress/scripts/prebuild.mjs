import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')

// 需要处理的目录
const categories = [
  '个人成长',
  '投资',
  '商业管理',
  '心理学',
  '健康运动',
  '社会科学',
  '思维方式'
]

// 忽略的文件和目录
const ignorePatterns = [
  'node_modules',
  '.vitepress',
  '.git',
  '.DS_Store'
]

function shouldIgnore(name) {
  return ignorePatterns.some(pattern => name.includes(pattern))
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
 * 处理单个 Markdown 文件
 * 如果没有 frontmatter，则添加基本的 frontmatter
 */
function processMarkdownFile(filePath, category) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data: frontmatter, content: markdownContent } = matter(content)

    // 提取文件名信息
    const fileName = path.basename(filePath, '.md')
    const parts = fileName.split('-')
    const author = parts[0] || ''
    const title = parts.slice(1).join('-') || fileName

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
      console.log(`Updated: ${filePath}`)
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
function processDirectory(dirPath, category) {
  let updatedCount = 0

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    entries.forEach(entry => {
      if (shouldIgnore(entry.name)) return

      const fullPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        updatedCount += processDirectory(fullPath, category)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        if (processMarkdownFile(fullPath, category)) {
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
 * 为每个分类目录创建索引页
 */
function createCategoryIndex(category) {
  const categoryPath = path.join(rootDir, category)
  const indexPath = path.join(categoryPath, 'index.md')

  // 如果已存在索引页，不覆盖
  if (fs.existsSync(indexPath)) {
    return
  }

  const indexContent = `---
title: ${category}
layout: page
---

# ${category}

::: tip
这是 ${category} 分类的所有笔记。使用左侧导航栏浏览具体内容。
:::
`

  try {
    fs.writeFileSync(indexPath, indexContent, 'utf-8')
    console.log(`Created index for: ${category}`)
  } catch (error) {
    console.error(`Error creating index for ${category}:`, error.message)
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 Starting prebuild process...\n')

  let totalUpdated = 0

  categories.forEach(category => {
    const categoryPath = path.join(rootDir, category)

    if (fs.existsSync(categoryPath)) {
      console.log(`Processing category: ${category}`)
      const updated = processDirectory(categoryPath, category)
      totalUpdated += updated

      // 创建分类索引页
      createCategoryIndex(category)
    }
  })

  console.log(`\n✅ Prebuild completed! Updated ${totalUpdated} files.`)
}

// 运行主函数
main()
