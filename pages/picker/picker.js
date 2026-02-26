const db = require('../../utils/mock_db.js');

Page({
  data: {
    allDishes: [],
    filteredDishes: [],
    activeTab: '全部',
    selectedCount: 0,
    historyOrder: null
  },
  onShow() {
    this.loadDishes();
    this.loadHistory();
  },
  loadHistory() {
    const order = db.getTodaysOrder();
    this.setData({ historyOrder: order });
  },
  loadDishes() {
    let dishes = db.getDishes();
    // Add 'selected' property
    dishes = dishes.map(d => ({ ...d, selected: false }));
    this.setData({
      allDishes: dishes,
      filteredDishes: dishes
    });
  },
  onTabClick(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.filterDishes();
  },
  filterDishes(dishes) {
    const allDishes = dishes || this.data.allDishes;
    const { activeTab } = this.data;
    let filtered = allDishes;

    if (activeTab !== '全部') {
      filtered = allDishes.filter(d => d.tags && d.tags.includes(activeTab));
    }

    this.setData({ filteredDishes: filtered });
  },
  onToggleDish(e) {
    const dish = e.detail.dish;
    const { allDishes } = this.data;

    // Update allDishes
    const updatedDishes = allDishes.map(d => {
      if (d.id === dish.id) {
        return { ...d, selected: !d.selected };
      }
      return d;
    });

    // Recalculate count
    const count = updatedDishes.filter(d => d.selected).length;

    this.setData({
      allDishes: updatedDishes,
      selectedCount: count
    });

    this.filterDishes(updatedDishes); // Pass updated list to ensure sync
  },
  submitOrder() {
    const selectedIds = this.data.allDishes.filter(d => d.selected).map(d => d.id);

    if (selectedIds.length === 0) {
      wx.showToast({ title: '还没选菜呢!', icon: 'none' });
      return;
    }

    // Attempt to request subscription for notification (Mock Template ID)
    // In a real app, this ID comes from the WeChat Admin Console
    const MOCK_TEMPLATE_ID = 'tmpl_mock_id_123456789';

    wx.requestSubscribeMessage({
      tmplIds: [MOCK_TEMPLATE_ID],
      success: (res) => {
        console.log('Subscribe success:', res);
        if (res[MOCK_TEMPLATE_ID] === 'accept') {
           wx.showToast({ title: '订阅成功', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('Subscribe failed:', err);
        // Often fails in dev tools without real ID, just proceed
      },
      complete: () => {
        // Proceed to submit order regardless of subscription result
        this.processSubmission(selectedIds);
      }
    });
  },

  processSubmission(selectedIds) {
    db.submitOrder(selectedIds);

    // Simulate WeChat Notification to Mom
    wx.showToast({
      title: '已通知妈妈! 👩',
      icon: 'success',
      duration: 2000
    });

    this.loadHistory();

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/summary/summary'
      });
    }, 1500);
  }
})
