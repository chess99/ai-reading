import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')

// 忽略的文件和目录
const ignorePatterns = [
  'node_modules',
  '.vitepress',
  '.git',
  '.DS_Store',
  'index.md',
  'package.json',
  'package-lock.json',
  '.gitignore'
]

/**
 * 判断是否应该忽略该文件/目录
 */
function shouldIgnore(name) {
  return ignorePatterns.some(pattern => name.includes(pattern))
}

/**
 * 判断是否是内容目录（包含 .md 文件的目录）
 */
function isContentDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    // 检查是否有 .md 文件或子目录
    return entries.some(entry => {
      if (shouldIgnore(entry.name)) return false

      if (entry.isFile() && entry.name.endsWith('.md')) {
        return true
      }

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
 * 提取文件名中的书名和作者
 * 格式: "作者-书名.md" 或 "作者1,作者2-书名.md"
 */
function parseFileName(fileName) {
  const nameWithoutExt = fileName.replace('.md', '')
  const parts = nameWithoutExt.split('-')

  if (parts.length >= 2) {
    const author = parts[0]
    const title = parts.slice(1).join('-')
    return { author, title, display: `${title} - ${author}` }
  }

  return { author: '', title: nameWithoutExt, display: nameWithoutExt }
}

/**
 * 递归扫描目录，生成侧边栏项
 */
function scanDirectory(dirPath, basePath = '') {
  const items = []

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    // 分离文件和目录
    const files = []
    const dirs = []

    entries.forEach(entry => {
      if (shouldIgnore(entry.name)) return

      if (entry.isDirectory()) {
        dirs.push(entry)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(entry)
      }
    })

    // 先处理子目录
    dirs.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    dirs.forEach(dir => {
      const subDirPath = path.join(dirPath, dir.name)
      const subBasePath = basePath ? `${basePath}/${dir.name}` : dir.name
      const subItems = scanDirectory(subDirPath, subBasePath)

      if (subItems.length > 0) {
        items.push({
          text: dir.name,
          collapsed: true,
          items: subItems
        })
      }
    })

    // 再处理文件
    files.sort((a, b) => {
      const aInfo = parseFileName(a.name)
      const bInfo = parseFileName(b.name)
      return aInfo.title.localeCompare(bInfo.title, 'zh-CN')
    })

    files.forEach(file => {
      const fileInfo = parseFileName(file.name)
      const link = basePath
        ? `/${basePath}/${file.name}`
        : `/${file.name}`

      items.push({
        text: fileInfo.display,
        link: link
      })
    })

  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error)
  }

  return items
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

      // 检查是否是内容目录
      if (isContentDirectory(dirPath)) {
        categories.push(entry.name)
      }
    })

    // 按中文拼音排序
    categories.sort((a, b) => a.localeCompare(b, 'zh-CN'))
  } catch (error) {
    console.error('Error discovering categories:', error)
  }

  return categories
}

/**
 * 生成所有分类的侧边栏配置
 */
export function generateSidebar() {
  const sidebar = {}
  const categories = discoverCategories()

  categories.forEach(category => {
    const categoryPath = path.join(rootDir, category)

    if (fs.existsSync(categoryPath)) {
      const items = scanDirectory(categoryPath, category)

      if (items.length > 0) {
        sidebar[`/${category}/`] = [
          {
            text: category,
            items: items
          }
        ]
      }
    }
  })

  return sidebar
}

// 如果直接运行此脚本，输出生成的侧边栏配置
if (import.meta.url === `file://${process.argv[1]}`) {
  const sidebar = generateSidebar()
  console.log(JSON.stringify(sidebar, null, 2))
}
