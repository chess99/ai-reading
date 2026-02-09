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
