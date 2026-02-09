---
layout: page
---

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const categories = ref([])
const recentBooks = ref([])

onMounted(async () => {
  // 获取所有页面数据
  const response = await fetch('/hashmap.json')
  const data = await response.json()

  // 解析分类和书籍
  const categoryMap = new Map()
  const allBooks = []

  Object.keys(data).forEach(path => {
    if (path.endsWith('.md') && !path.includes('index.md') && path !== 'index.md') {
      const parts = path.split('/')
      if (parts.length >= 2) {
        const category = parts[0]
        const fileName = parts[parts.length - 1].replace('.md', '')

        // 解析书名和作者
        const fileParts = fileName.split('-')
        const author = fileParts[0] || ''
        const title = fileParts.slice(1).join('-') || fileName

        const book = {
          path: '/' + path.replace('.md', '.html'),
          category,
          author,
          title,
          display: `${title} - ${author}`
        }

        allBooks.push(book)

        if (!categoryMap.has(category)) {
          categoryMap.set(category, [])
        }
        categoryMap.get(category).push(book)
      }
    }
  })

  // 转换为数组并排序
  categories.value = Array.from(categoryMap.entries())
    .map(([name, books]) => ({ name, books, count: books.length }))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))

  // 获取最近的书籍（模拟，实际可以从 git 历史获取）
  recentBooks.value = allBooks.slice(0, 10)
})

const randomBook = () => {
  const allBooks = categories.value.flatMap(c => c.books)
  if (allBooks.length > 0) {
    const random = allBooks[Math.floor(Math.random() * allBooks.length)]
    router.go(random.path)
  }
}

const searchBooks = () => {
  const searchButton = document.querySelector('.DocSearch-Button')
  if (searchButton) {
    searchButton.click()
  }
}
</script>

<div class="home-container">
  <!-- 搜索栏 -->
  <div class="search-bar">
    <button class="search-btn" @click="searchBooks">
      <span class="icon">🔍</span>
      <span class="text">搜索书籍</span>
      <span class="shortcut">⌘K</span>
    </button>
    <button class="random-btn" @click="randomBook">
      <span class="icon">🎲</span>
      <span class="text">随机一本</span>
    </button>
  </div>

  <!-- 分类网格 -->
  <div class="categories-grid">
    <div
      v-for="category in categories"
      :key="category.name"
      class="category-card"
      @click="router.go(`/${category.name}/`)"
    >
      <div class="category-header">
        <h3 class="category-name">{{ category.name }}</h3>
        <span class="category-count">{{ category.count }} 本</span>
      </div>
      <div class="category-books">
        <div
          v-for="(book, index) in category.books.slice(0, 5)"
          :key="index"
          class="book-item"
          @click.stop="router.go(book.path)"
        >
          <span class="book-title">{{ book.title }}</span>
          <span class="book-author">{{ book.author }}</span>
        </div>
        <div v-if="category.books.length > 5" class="more-books">
          还有 {{ category.books.length - 5 }} 本...
        </div>
      </div>
    </div>
  </div>
</div>

<style scoped>
.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  position: sticky;
  top: 0;
  background: var(--vp-c-bg);
  padding: 16px 0;
  z-index: 10;
  border-bottom: 1px solid var(--vp-c-divider);
}

.search-btn,
.random-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-btn {
  flex: 1;
  justify-content: center;
}

.search-btn:hover,
.random-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.search-btn .icon,
.random-btn .icon {
  font-size: 20px;
}

.search-btn .shortcut {
  margin-left: auto;
  padding: 4px 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.search-btn:hover .shortcut {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* 分类网格 */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.category-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.category-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin: 0;
}

.category-count {
  font-size: 14px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-brand-soft);
  padding: 4px 12px;
  border-radius: 12px;
}

.category-books {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.book-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.book-item:hover {
  background: var(--vp-c-bg);
}

.book-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 12px;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.more-books {
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-align: center;
  padding: 8px;
  font-style: italic;
}

/* 响应式 */
@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }

  .search-bar {
    flex-direction: column;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}

/* 加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card {
  animation: fadeIn 0.4s ease;
}

.category-card:nth-child(1) { animation-delay: 0s; }
.category-card:nth-child(2) { animation-delay: 0.05s; }
.category-card:nth-child(3) { animation-delay: 0.1s; }
.category-card:nth-child(4) { animation-delay: 0.15s; }
.category-card:nth-child(5) { animation-delay: 0.2s; }
.category-card:nth-child(6) { animation-delay: 0.25s; }
.category-card:nth-child(7) { animation-delay: 0.3s; }
</style>
