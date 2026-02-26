const db = require('../../utils/mock_db.js');

Page({
  data: {
    dishes: [],
    showModal: false,
    newDishName: '',
    newDishRecipe: '',
    newDishTag: '荤菜', // Default
    newDishImage: '',
    newDishUrl: ''
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
  catchTap() {
    // Prevent event propagation
  },
  onTagChange(e) {
    this.setData({ newDishTag: e.detail.value });
  },
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        this.setData({
          newDishImage: tempFilePaths[0]
        })
      }
    })
  },
  saveDish() {
    if (!this.data.newDishName) {
      wx.showToast({ title: '请输入菜名', icon: 'none' });
      return;
    }

    const newDish = {
      name: this.data.newDishName,
      // Use uploaded image or placeholder
      image: this.data.newDishImage || 'https://via.placeholder.com/300x300.png?text=' + encodeURIComponent(this.data.newDishName),
      recipe: this.data.newDishRecipe,
      url: this.data.newDishUrl,
      tags: [this.data.newDishTag]
    };

    db.addDish(newDish);

    this.hideAddModal();
    this.loadDishes();

    // Clear inputs
    this.setData({
      newDishName: '',
      newDishRecipe: '',
      newDishTag: '荤菜',
      newDishImage: '',
      newDishUrl: ''
    });

    wx.showToast({ title: '添加成功' });
  },
  onDishTap(e) {
      const dish = e.detail.dish;
      let content = dish.recipe || '暂无做法';
      if (dish.url) {
          content += '\n\n(包含外部链接，点击复制)';
      }

      wx.showModal({
          title: dish.name,
          content: content,
          confirmText: dish.url ? '复制链接' : '确定',
          showCancel: !!dish.url,
          success: (res) => {
              if (res.confirm && dish.url) {
                  wx.setClipboardData({
                      data: dish.url,
                      success: () => {
                          wx.showToast({ title: '链接已复制' });
                      }
                  });
              }
          }
      });
  }
})
