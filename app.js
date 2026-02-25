// app.js
App({
  onLaunch() {
    // Check local storage for initialization
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // Login logic could go here
    /*
    wx.login({
      success: res => {
        // Send res.code to backend
      }
    })
    */
  },
  globalData: {
    userInfo: null,
    // Store user role here: 'child' or 'mom'
    userRole: null
  }
})
