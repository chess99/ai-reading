const { getBooks, getTopics } = require('../../utils/catalog.js');

Page({
  data: {
    bookCount: 0,
    topicCount: 0,
  },

  onLoad() {
    this.setData({
      bookCount: getBooks().length,
      topicCount: getTopics().length,
    });
  },
});
