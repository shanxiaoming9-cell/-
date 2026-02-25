const db = require('../../utils/mock_db.js');

Page({
  data: {
    dishes: [],
    showModal: false,
    newDishName: '',
    newDishRecipe: '',
    newDishTag: '荤菜' // Default
  },
  onLoad() {
    this.loadDishes();
  },
  loadDishes() {
    const dishes = db.getDishes();
    this.setData({ dishes });
  },
  showAddModal() {
    this.setData({ showModal: true });
  },
  hideAddModal() {
    this.setData({ showModal: false });
  },
  onTagChange(e) {
    this.setData({ newDishTag: e.detail.value });
  },
  saveDish() {
    if (!this.data.newDishName) {
      wx.showToast({ title: '请输入菜名', icon: 'none' });
      return;
    }

    const newDish = {
      name: this.data.newDishName,
      // Generate a placeholder image based on name
      image: 'https://via.placeholder.com/300x300.png?text=' + encodeURIComponent(this.data.newDishName),
      recipe: this.data.newDishRecipe,
      tags: [this.data.newDishTag]
    };

    db.addDish(newDish);

    this.hideAddModal();
    this.loadDishes();

    // Clear inputs
    this.setData({
      newDishName: '',
      newDishRecipe: '',
      newDishTag: '荤菜'
    });

    wx.showToast({ title: '添加成功' });
  },
  onDishTap(e) {
      const dish = e.detail.dish;
      wx.showModal({
          title: dish.name,
          content: dish.recipe || '暂无做法',
          showCancel: false
      });
  }
})
