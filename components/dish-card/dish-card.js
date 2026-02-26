const { DEFAULT_DISH_IMG } = require('../../utils/assets.js');

Component({
  properties: {
    dish: {
      type: Object,
      value: {}
    },
    selected: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    onTap() {
      // Trigger toggle event, bubble up to parent
      this.triggerEvent('toggle', { dish: this.data.dish });
    },
    copyLink() {
        if (!this.data.dish.url) return;
        wx.setClipboardData({
            data: this.data.dish.url,
            success: () => {
                wx.showToast({ title: '链接已复制', icon: 'none' });
            }
        });
    },
    onImageError(e) {
        console.error('Image load failed, using default', e);
        this.setData({
            'dish.image': DEFAULT_DISH_IMG
        });
    }
  }
})
