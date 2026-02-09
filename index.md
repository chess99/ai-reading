---
layout: page
---

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const categories = ref([])

onMounted(async () => {
  // 获取所有页面数据
  const response = await fetch('/hashmap.json')
  const data = await response.json()

  // 解析分类和书籍
  const categoryMap = new Map()

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
          path: '/' + path.replace('.md', ''),
          category,
          author,
          title,
          display: `${title} - ${author}`
        }

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
})

const randomBook = () => {
  const allBooks = categories.value.flatMap(c => c.books)
  if (allBooks.length > 0) {
    const random = allBooks[Math.floor(Math.random() * allBooks.length)]
    window.location.href = random.path
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

  <!-- 分类卡片 -->
  <div class="categories-section">
    <a
      v-for="category in categories"
      :key="category.name"
      :href="`/${category.name}/`"
      class="category-card"
    >
      <div class="category-icon">📚</div>
      <h3 class="category-name">{{ category.name }}</h3>
      <p class="category-count">{{ category.count }} 本书籍</p>
    </a>
  </div>
</div>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}

.search-btn,
.random-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 28px;
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
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.search-btn .icon,
.random-btn .icon {
  font-size: 20px;
}

.search-btn .shortcut {
  margin-left: auto;
  padding: 4px 10px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.search-btn:hover .shortcut {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* 分类区域 */
.categories-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 16px;
  filter: grayscale(0.3);
  transition: all 0.3s ease;
}

.category-card:hover .category-icon {
  filter: grayscale(0);
  transform: scale(1.1);
}

.category-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
  text-align: center;
}

.category-count {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .home-container {
    padding: 24px 16px;
  }

  .search-bar {
    flex-direction: column;
  }

  .categories-section {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .category-card {
    padding: 24px 16px;
  }

  .category-icon {
    font-size: 36px;
  }
}

/* 加载动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card {
  animation: fadeInUp 0.5s ease;
}

.category-card:nth-child(1) { animation-delay: 0s; }
.category-card:nth-child(2) { animation-delay: 0.05s; }
.category-card:nth-child(3) { animation-delay: 0.1s; }
.category-card:nth-child(4) { animation-delay: 0.15s; }
.category-card:nth-child(5) { animation-delay: 0.2s; }
.category-card:nth-child(6) { animation-delay: 0.25s; }
.category-card:nth-child(7) { animation-delay: 0.3s; }
</style>
