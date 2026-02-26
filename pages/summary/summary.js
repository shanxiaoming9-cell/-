const db = require('../../utils/mock_db.js');

Page({
  data: {
    order: null,
    date: ''
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
  }
})
