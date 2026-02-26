const db = require('../../utils/mock_db.js');

Page({
  data: {
    order: null,
    date: '',
    selectedDish: null
  },
  onLoad() {
    this.updateDate();
    this.loadOrder();
  },
  onShow() {
    this.loadOrder();
  },
  updateDate() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    this.setData({ date: dateStr });
  },
  loadOrder() {
    const order = db.getTodaysOrder();
    this.setData({ order });
  },
  startCooking() {
    wx.showToast({
      title: '加油妈妈! ❤️',
      icon: 'none'
    });
  },
  remindChild() {
    wx.showToast({
      title: '已催促宝宝点餐!',
      icon: 'none'
    });
  },
  onDishTap(e) {
    const dish = e.currentTarget.dataset.dish;
    this.setData({ selectedDish: dish });
  },
  closeDetail() {
    this.setData({ selectedDish: null });
  },
  catchTap() {
    // Prevent event propagation
  },
  copyLink() {
    if (this.data.selectedDish && this.data.selectedDish.url) {
      wx.setClipboardData({
        data: this.data.selectedDish.url,
        success: () => {
          wx.showToast({ title: '链接已复制', icon: 'success' });
        }
      });
    }
  }
})
