const db = require('../../utils/mock_db.js');
const { DEFAULT_DISH_IMG } = require('../../utils/assets.js');

Page({
  data: {
    dishes: [],
    showModal: false,
    newDishName: '',
    newDishRecipe: '',
    newDishTag: '荤菜', // Default
    newDishImage: '',
    newDishUrl: '',
    editingDishId: null
  },
  onImportExcel() {
      wx.showModal({
          title: '导入格式说明',
          content: '请上传 Excel 文件 (.xlsx, .xls, .xlsm)\n\n第一列：菜名\n第二列：做法/备注\n第三列：标签 (如: 荤菜, 素菜, 主食)',
          confirmText: '选择文件',
          success: (res) => {
              if (res.confirm) {
                  this.chooseExcelFile();
              }
          }
      });
  },
  chooseExcelFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['xlsx', 'xls', 'xlsm'],
      success: (res) => {
        // In a real app, we would upload this file to cloud function to parse
        // or use a local library (hard without npm in simple mode)
        const file = res.tempFiles[0];
        console.log('Selected file:', file);

        wx.showLoading({ title: '解析表格中...' });

        // Simulate network/parsing delay
        setTimeout(() => {
            try {
                // Mock imported data based on the described format
                const mockImportedDishes = [
                    { name: '扬州炒饭', recipe: '隔夜饭加蛋炒', tags: ['主食'] },
                    { name: '西红柿鸡蛋面', recipe: '快手晚餐', tags: ['主食'] },
                    { name: '皮蛋瘦肉粥', recipe: '慢炖', tags: ['汤羹'] }
                ];

                mockImportedDishes.forEach(d => {
                    db.addDish({
                        name: d.name,
                        recipe: d.recipe,
                        tags: d.tags,
                        image: DEFAULT_DISH_IMG
                    });
                });

                this.loadDishes();
                wx.hideLoading();

                wx.showToast({
                    title: `成功导入 ${mockImportedDishes.length} 道菜!`,
                    icon: 'success'
                });
            } catch (err) {
                console.error('Import simulation error:', err);
                wx.hideLoading();
                wx.showToast({
                    title: '导入失败',
                    icon: 'none'
                });
            }
        }, 1500);
      },
      fail: (err) => {
          console.error('File selection failed:', err);
          // User cancelled or error
      }
    });
  },
  onLoad() {
    this.loadDishes();
  },
  loadDishes() {
    const dishes = db.getDishes();
    this.setData({ dishes });
  },
  showAddModal() {
    this.setData({
      showModal: true,
      editingDishId: null,
      newDishName: '',
      newDishRecipe: '',
      newDishTag: '荤菜',
      newDishImage: '',
      newDishUrl: ''
    });
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

    const dishData = {
      name: this.data.newDishName,
      // Use uploaded image or placeholder
      image: this.data.newDishImage || DEFAULT_DISH_IMG,
      recipe: this.data.newDishRecipe,
      url: this.data.newDishUrl,
      tags: [this.data.newDishTag]
    };

    if (this.data.editingDishId) {
        db.updateDish(this.data.editingDishId, dishData);
        wx.showToast({ title: '修改成功' });
    } else {
        db.addDish(dishData);
        wx.showToast({ title: '添加成功' });
    }

    this.hideAddModal();
    this.loadDishes();

    // Clear inputs
    this.setData({
      newDishName: '',
      newDishRecipe: '',
      newDishTag: '荤菜',
      newDishImage: '',
      newDishUrl: '',
      editingDishId: null
    });
  },
  onDishTap(e) {
      const dish = e.detail.dish;

      wx.showActionSheet({
          itemList: ['修改菜谱', '删除菜谱'],
          itemColor: '#333333',
          success: (res) => {
              if (res.tapIndex === 0) {
                  // Edit
                  this.onEditDish(dish);
              } else if (res.tapIndex === 1) {
                  // Delete
                  this.onDeleteDish(dish);
              }
          },
          fail: (res) => {
              console.log(res.errMsg);
          }
      });
  },
  onEditDish(dish) {
      this.setData({
          showModal: true,
          editingDishId: dish.id,
          newDishName: dish.name,
          newDishRecipe: dish.recipe || '',
          newDishUrl: dish.url || '',
          newDishTag: (dish.tags && dish.tags[0]) || '荤菜',
          newDishImage: dish.image === DEFAULT_DISH_IMG ? '' : dish.image
      });
  },
  onDeleteDish(dish) {
      wx.showModal({
          title: '确认删除',
          content: `确定要删除 ${dish.name} 吗？`,
          success: (res) => {
              if (res.confirm) {
                  db.deleteDish(dish.id);
                  this.loadDishes();
                  wx.showToast({ title: '已删除', icon: 'none' });
              }
          }
      });
  }
})
