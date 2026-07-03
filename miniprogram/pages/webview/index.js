Page({
  data: {
    src: '',
    title: '阅读',
  },

  onLoad(options) {
    const src = decodeURIComponent(options.url || '');
    const title = decodeURIComponent(options.title || '阅读');

    this.setData({ src, title });
    wx.setNavigationBarTitle({ title });
  },

  onShareAppMessage() {
    return {
      title: this.data.title,
      path: `/pages/webview/index?url=${encodeURIComponent(this.data.src)}&title=${encodeURIComponent(this.data.title)}`,
    };
  },
});
