const app = getApp()
Page({

  data: {
    avatarUrl: '',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function () {
    if (!wx.cloud) {
      return
    }
    // 判断是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              console.log('[云函数] [login] user openid: ', res.result.openid)
              app.globalData.openid = res.result.openid
              wx.switchTab({
                url: '../Home_page/Home_page',
              })
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              wx.setStorage({
                key: "key",
                data: this.data.userInfo
              })
              wx.switchTab({
                url: '../Home_page/Home_page',
              })
            }
          })
        }
      }
    })

  },


  onGetOpenid: function (e) {

    wx.getUserInfo({

      success: res => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo
        })


        wx.setStorage({
          key: "key",
          data: this.data.userInfo
        })
      }


    })

    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {

        console.log('[云函数] [login] user openid: ', res.result.openid)

        app.globalData.openid = res.result.openid
        wx.switchTab({
          url: '../Home_page/Home_page',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
})