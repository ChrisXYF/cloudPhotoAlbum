const app = getApp()
Page({

  data: {
    avatarUrl: '',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    done: false
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
              console.log(res)
              app.globalData.openid = res.result.openId
              wx.switchTab({
                url: '../Home_page/Home_page',
              })
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })

          wx.getUserProfile({
            desc: '用于完善会员资料',
            success: res => {
              console.log(res)
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

    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: res => {
        console.log(res)
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

    调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openId
        this.setData({
          done: true
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
})