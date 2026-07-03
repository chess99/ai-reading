const catalog = require('../data/catalog.js');

function getBooks() {
  return catalog.books || [];
}

function getTopics() {
  return catalog.topics || [];
}

function findBook(slug) {
  return getBooks().find(book => book.slug === slug) || null;
}

function findTopic(slug) {
  return getTopics().find(topic => topic.slug === slug) || null;
}

function searchCatalog(keyword) {
  const query = String(keyword || '').trim().toLowerCase();
  if (!query) {
    return { books: [], topics: [] };
  }

  const includesQuery = value => String(value || '').toLowerCase().includes(query);

  return {
    books: getBooks().filter(book => (
      includesQuery(book.title) ||
      includesQuery(book.author) ||
      includesQuery(book.category) ||
      (book.tags || []).some(includesQuery)
    )),
    topics: getTopics().filter(topic => (
      includesQuery(topic.title) ||
      includesQuery(topic.description) ||
      (topic.tags || []).some(includesQuery)
    )),
  };
}

function groupBooksByCategory() {
  const groups = {};
  for (const book of getBooks()) {
    const category = book.category || '未分类';
    groups[category] = groups[category] || [];
    groups[category].push(book);
  }

  return Object.keys(groups).sort((a, b) => a.localeCompare(b, 'zh-CN')).map(name => ({
    name,
    books: groups[name],
  }));
}

function openWebview(url, title) {
  wx.navigateTo({
    url: `/pages/webview/index?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || '晨筅读书')}`,
  });
}

module.exports = {
  findBook,
  findTopic,
  getBooks,
  getTopics,
  groupBooksByCategory,
  openWebview,
  searchCatalog,
};
