---
title: 思维方式
layout: page
---

<div class="category-index">
  <h1 class="category-title">思维方式</h1>
  <p class="category-stats">共 1 本书籍</p>

  <div class="books-list">
  <a href="德内拉·梅多斯-系统之美" class="book-link">
    <span class="book-title">系统之美</span>
    <span class="book-author">德内拉·梅多斯</span>
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
