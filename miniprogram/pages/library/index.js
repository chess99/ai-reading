const { groupBooksByCategory, openWebview } = require('../../utils/catalog.js');

Page({
  data: {
    groups: [],
  },

  onLoad() {
    this.setData({
      groups: groupBooksByCategory(),
    });
  },

  openBook(event) {
    const { url, title } = event.currentTarget.dataset;
    openWebview(url, title);
  },
});
