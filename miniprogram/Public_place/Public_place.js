// miniprogram/pages/window/window.js
const db = wx.cloud.database({ env: 'textllinpro-5br77' })
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
        console.log('获取数据成功', res)
        console.log("image is", res.data)
        that.setData({
          shuzu: res.data
        })
      },
      fail(res) {
        console.log('获取失败', imgurl)
      }
    })
  },

  addclick: function () {
    wx.navigateTo({
      url: '../Home_page/Home_page',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  removebutton: function (e) {
    var that = this
    console.log("------------")
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
    console.log(e.currentTarget.dataset.youid)
    console.log(e.currentTarget.dataset.youopenid)

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
    var index = 0
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(res)
        that.setData({
          userid: res.result.openid
        })

        var userid = that.data.userid;
        db.collection('My_up').where({ //获取自己的点赞列表
          myId: userid
        }).get({
          success: res => {
            console.log("res:---------", res)
            that.setData({
              allyouup: res.data //点赞列表data赋给allyouup
            })
            for (var i = 0; i < res.data.length; i++) {
              allUpId[i] = res.data[i].youId //点赞列表赋给allUpId
            }

            db.collection('Record_picture').get({
              success: res => {
                that.setData({
                  alldata: res.data //所有的用户列表数据
                })
                for (var i = 0; i < res.data.length; i++) {
                  allId[i] = res.data[i]._id //所有的用户列表_id
                  if (allUpId.indexOf(allId[i]) == -1) {
                    var item = 'array[' + i + ']'
                    that.setData({
                      [item]: 0
                    })
                  } else {
                    var item = 'array[' + i + ']'
                    that.setData({
                      [item]: 1
                    })
                  }
                }
                console.log(that.data.array)
              }
            })
          },

        })
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