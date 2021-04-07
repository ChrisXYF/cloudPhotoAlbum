// miniprogram/pages/window/window.js
const db = wx.cloud.database({
  env: 'textllinpro-5br77'
})
const _ = db.command
var allId = new Array()
var allUpId = new Array()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '/images/user-unlogin.png',
    myName: "",
    userid: "",
    array: [],
    shuzu: [],
    alldata: []
  },

  /** 
   * 预览图片
   */
  previewImage: function (e) {
    //var current = e.target.dataset.src;
    wx.previewImage({
      //current: current, // 当前显示图片的http链接
      urls: [e.target.dataset.myimg], // 需要预览的图片http链接列表
    })
  },

  //刷新页面
  onShow: function () {
    this.getImageList();
  },

  //获取图片
  getImageList() {
    let that = this;
    wx.cloud.database().collection('Record_picture').get({
      success: function (res) {
        let arr = []
        res.data.forEach(item => {
          arr.push(item.Vote)
        })
        that.setData({
          shuzu: res.data,
          array: arr
        })
      },
      fail(res) {
        console.log('获取失败', imgurl)
      }
    })
  },

  addclick: function () {
    wx.navigateTo({
      url: '../share/share',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  removebutton: function (e) {
    var that = this
    wx.cloud.callFunction({
      name: 'remove_record_vote',
      data: {
        youid: e.currentTarget.dataset.youid,
      },
      success: function (res) {
        that.search_db()
      }
    })
  },
  upclickbutton: function (e) {
    var that = this
    var ind = e.currentTarget.dataset.nowindex
    if (this.data.array[ind] == 0) //说明没点赞过
    {
      var nowup = 'array[' + ind + ']' //设置为点赞过
      this.setData({
        [nowup]: 1
      })
      wx.cloud.callFunction({
        name: 'add_up_record',
        data: {
          myid: this.data.userid,
          youid: e.currentTarget.dataset.youid,
          youopenid: e.currentTarget.dataset.youopenid,
        },
        success: function (res) {}
      })
      wx.cloud.callFunction({
        name: 'update_record_vote',
        data: {
          youid: e.currentTarget.dataset.youid,
        },
        success: function (res) {
          that.search_db()
        }
      })

    }
  },

  search_db: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        that.setData({
          userid: res.result.openid
        })
        this.getImageList()
      }
    })
  },

  onLoad: function (options) {
    this.search_db();
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                myName: res.userInfo.nickName
              })
            }
          })
        }
      }
    })


  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
})