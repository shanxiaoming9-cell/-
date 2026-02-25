Page({
  data: {
  },
  onLoad() {
    // Optionally auto-redirect if role is saved in globalData or Storage
  },
  navToChild() {
    wx.navigateTo({
      url: '/pages/picker/picker'
    });
  },
  navToMom() {
    wx.navigateTo({
      url: '/pages/menu/menu'
    });
  },
  navToSummary() {
    wx.navigateTo({
      url: '/pages/summary/summary'
    });
  }
})
