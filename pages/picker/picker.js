const db = require('../../utils/mock_db.js');

Page({
  data: {
    allDishes: [],
    filteredDishes: [],
    activeTab: '全部',
    selectedCount: 0
  },
  onLoad() {
    this.loadDishes();
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

    db.submitOrder(selectedIds);

    wx.showToast({
      title: '发送成功!',
      icon: 'success',
      duration: 2000
    });

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/summary/summary'
      });
    }, 1500);
  }
})
