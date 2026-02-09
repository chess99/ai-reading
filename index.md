---
layout: home

hero:
  name: "AI 阅读"
  text: "智能书籍解读平台"
  tagline: AI 驱动的知识分享与深度解读
  actions:
    - theme: brand
      text: 搜索书籍
      link: "#search"
    - theme: alt
      text: 随机阅读
      link: "#random"

features:
  - icon: 🤖
    title: AI 驱动解读
    details: 运用 AI 技术深度解析书籍核心观点，提炼精华内容
  - icon: 📚
    title: 海量书库
    details: 涵盖投资、商业、心理、成长等多个领域的优质书籍
  - icon: 🔍
    title: 智能搜索
    details: 快速找到你感兴趣的书籍和知识点
  - icon: 🎲
    title: 随机发现
    details: 探索未知领域，发现意想不到的好书
  - icon: 💡
    title: 深度洞察
    details: 不只是摘要，更有深入的思考和关联分析
  - icon: 🌐
    title: 开放共享
    details: 知识属于所有人，免费开放访问
---

<script setup>
import { onMounted } from 'vue'
import { useData, useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  // 处理搜索按钮点击
  const searchBtn = document.querySelector('a[href="#search"]')
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault()
      // 触发 VitePress 搜索
      const searchButton = document.querySelector('.DocSearch-Button')
      if (searchButton) {
        searchButton.click()
      }
    })
  }

  // 处理随机阅读按钮点击
  const randomBtn = document.querySelector('a[href="#random"]')
  if (randomBtn) {
    randomBtn.addEventListener('click', async (e) => {
      e.preventDefault()

      // 获取所有书籍链接
      const response = await fetch('/hashmap.json')
      const data = await response.json()

      // 过滤出书籍页面（排除索引页和首页）
      const bookPages = Object.keys(data).filter(path =>
        path.endsWith('.md') &&
        !path.includes('index.md') &&
        path !== 'index.md'
      )

      if (bookPages.length > 0) {
        // 随机选择一本书
        const randomBook = bookPages[Math.floor(Math.random() * bookPages.length)]
        const bookPath = randomBook.replace('.md', '.html')

        // 跳转到随机书籍
        router.go('/' + bookPath)
      }
    })
  }
})
</script>

<style scoped>
.VPHome {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

.VPHero {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem 2rem;
  margin: 2rem auto;
  max-width: 1200px;
}

.dark .VPHero {
  background: rgba(30, 30, 30, 0.95);
}

.VPFeatures {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 1200px;
}

.dark .VPFeatures {
  background: rgba(30, 30, 30, 0.9);
}
</style>
