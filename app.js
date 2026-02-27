// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数决定将数据存储在哪个环境
        // traceUser: true,
      })
    }

    // Check local storage for initialization
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
    // Store user role here: 'child' or 'mom'
    userRole: null
  }
})
