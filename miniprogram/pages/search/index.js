const { openWebview, searchCatalog } = require('../../utils/catalog.js');

Page({
  data: {
    keyword: '',
    books: [],
    topics: [],
    searched: false,
  },

  onInput(event) {
    const keyword = event.detail.value;
    const result = searchCatalog(keyword);
    this.setData({
      keyword,
      books: result.books.slice(0, 80),
      topics: result.topics.slice(0, 40),
      searched: keyword.trim().length > 0,
    });
  },

  openItem(event) {
    const { url, title } = event.currentTarget.dataset;
    openWebview(url, title);
  },
});
