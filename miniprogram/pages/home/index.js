const { getBooks, getTopics, openWebview } = require('../../utils/catalog.js');

Page({
  data: {
    latestBooks: [],
    latestTopics: [],
    totalBooks: 0,
    totalTopics: 0,
  },

  onLoad() {
    const books = getBooks();
    const topics = getTopics();
    this.setData({
      latestBooks: books.slice(0, 8),
      latestTopics: topics.slice(0, 4),
      totalBooks: books.length,
      totalTopics: topics.length,
    });
  },

  openBook(event) {
    const { url, title } = event.currentTarget.dataset;
    openWebview(url, title);
  },

  openTopic(event) {
    const { url, title } = event.currentTarget.dataset;
    openWebview(url, title);
  },

  goSearch() {
    wx.switchTab({
      url: '/pages/search/index',
    });
  },
});
