const app = getApp()
var util=require('../../utils/util.js');
Page({
  data: {
    Username:'',
    Time: '',
    Head_picture:'',
    Filepath:''
  },

  onLoad: function (options) {
   var that=this
    wx.getStorage({
      key: 'key',
      success(res) {
        that.setData({
          Username: res.data.nickName,
          Time: util.formatTime(new Date()),
          Head_picture: res.data.avatarUrl
        });
        
      }
    }) 
  },
  toPublic_place:function(){
   /* console.log("in");
    wx.cloud.callFunction({
      name: 'test',
      data: {},
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.error(err)
      }
    })*/
    wx.navigateTo({
      url: '/pages/Public_place/Public_place',
    })
  },

  doupLoad:function(){
    wx.switchTab({
      url: '../index/index',
    })
 },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})