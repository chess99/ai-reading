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
 * 生成导航栏配置
 */
export function generateNav() {
  const categories = discoverCategories()

  // 首页链接
  const nav = [
    { text: '首页', link: '/' }
  ]

  // 为每个分类添加导航链接
  categories.forEach(category => {
    nav.push({
      text: category,
      link: `/${category}/`
    })
  })

  return nav
}

// 如果直接运行此脚本，输出生成的导航配置
if (import.meta.url === `file://${process.argv[1]}`) {
  const nav = generateNav()
  console.log(JSON.stringify(nav, null, 2))
}
