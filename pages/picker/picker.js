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
  addToMenu() {
    const selectedIds = this.data.allDishes.filter(d => d.selected).map(d => d.id);

    if (selectedIds.length === 0) {
      wx.showToast({ title: '还没选菜呢!', icon: 'none' });
      return;
    }

    db.submitOrder(selectedIds);

    wx.showToast({
      title: '已加入菜单',
      icon: 'success',
      duration: 1500
    });

    this.loadHistory();

    // Clear current selection
    const { allDishes } = this.data;
    const clearedDishes = allDishes.map(d => ({ ...d, selected: false }));
    this.setData({
        allDishes: clearedDishes,
        selectedCount: 0
    });
    this.filterDishes(clearedDishes);
  },

  notifyMom() {
    if (!this.data.historyOrder || !this.data.historyOrder.detailedDishes || this.data.historyOrder.detailedDishes.length === 0) {
        wx.showToast({ title: '先点菜再通知!', icon: 'none' });
        return;
    }

    // In a real app, this ID comes from the WeChat Admin Console
    const MOCK_TEMPLATE_ID = 'tmpl_mock_id_123456789';

    // Try subscription
    wx.requestSubscribeMessage({
      tmplIds: [MOCK_TEMPLATE_ID],
      success: (res) => {
        console.log('Subscribe success:', res);
        // In real backend, we would trigger the message send here
      },
      fail: (err) => {
        console.log('Subscribe failed (expected in dev):', err);
      },
      complete: () => {
          // Show feedback regardless of subscription result (mock behavior)
          wx.showToast({
              title: '已通知妈妈',
              icon: 'success',
              duration: 2000
          });
      }
    });
  },

  deleteHistoryItem(e) {
      const dishId = e.currentTarget.dataset.id;
      wx.showModal({
          title: '删除',
          content: '要从今日菜单中移除这道菜吗？',
          success: (res) => {
              if (res.confirm) {
                  db.removeDishFromOrder(dishId);
                  this.loadHistory();
                  wx.showToast({ title: '已移除', icon: 'none' });
              }
          }
      });
  }
})
