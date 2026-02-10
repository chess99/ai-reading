---
title: 健康运动
layout: page
---

<div class="category-index">
  <h1 class="category-title">健康运动</h1>
  <p class="category-stats">共 6 本书籍</p>

  <div class="books-list">
  <a href="彼得·阿提亚-超越百岁" class="book-link">
    <span class="book-title">超越百岁</span>
    <span class="book-author">彼得·阿提亚</span>
  </a>
  <a href="王庭槐-生理学" class="book-link">
    <span class="book-title">生理学</span>
    <span class="book-author">王庭槐</span>
  </a>
  <a href="阿诺德·施瓦辛格-施瓦辛格健身全书" class="book-link">
    <span class="book-title">施瓦辛格健身全书</span>
    <span class="book-author">阿诺德·施瓦辛格</span>
  </a>
  <a href="马克·劳伦-无器械健身2.0" class="book-link">
    <span class="book-title">无器械健身2.0</span>
    <span class="book-author">马克·劳伦</span>
  </a>
  <a href="ACSM-ACSM's Complete Guide to Fitness & Health" class="book-link">
    <span class="book-title">ACSM's Complete Guide to Fitness & Health</span>
    <span class="book-author">ACSM</span>
  </a>
  <a href="ACSM-ACSMs advanced exercise physiology" class="book-link">
    <span class="book-title">ACSMs advanced exercise physiology</span>
    <span class="book-author">ACSM</span>
  </a>
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
