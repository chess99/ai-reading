---
title: 投资
layout: page
---

<div class="category-index">
  <h1 class="category-title">投资</h1>
  <p class="category-stats">共 9 本书籍</p>

  <div class="books-list">
  <a href="罗伯特·哈格斯特朗-巴菲特之道" class="book-link">
    <span class="book-title">巴菲特之道</span>
    <span class="book-author">罗伯特·哈格斯特朗</span>
  </a>
  <a href="沃伦·巴菲特-巴菲特致股东的信" class="book-link">
    <span class="book-title">巴菲特致股东的信</span>
    <span class="book-author">沃伦·巴菲特</span>
  </a>
  <a href="彼得·林奇-彼得·林奇的成功投资" class="book-link">
    <span class="book-title">彼得·林奇的成功投资</span>
    <span class="book-author">彼得·林奇</span>
  </a>
  <a href="布鲁斯·C.格林沃尔德-价值投资：从格雷厄姆到巴菲特" class="book-link">
    <span class="book-title">价值投资：从格雷厄姆到巴菲特</span>
    <span class="book-author">布鲁斯·C.格林沃尔德</span>
  </a>
  <a href="霍华德·马克斯-投资最重要的事" class="book-link">
    <span class="book-title">投资最重要的事</span>
    <span class="book-author">霍华德·马克斯</span>
  </a>
  <a href="肖星-一本书读懂财报" class="book-link">
    <span class="book-title">一本书读懂财报</span>
    <span class="book-author">肖星</span>
  </a>
  <a href="菲利普·费雪-怎样选择成长股" class="book-link">
    <span class="book-title">怎样选择成长股</span>
    <span class="book-author">菲利普·费雪</span>
  </a>
  <a href="费舍-怎样选择成长股" class="book-link">
    <span class="book-title">怎样选择成长股</span>
    <span class="book-author">费舍</span>
  </a>
  <a href="彼得·林奇-战胜华尔街" class="book-link">
    <span class="book-title">战胜华尔街</span>
    <span class="book-author">彼得·林奇</span>
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
