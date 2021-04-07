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
  toShare: function () {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        that.setData({
            Filepath: res.tempFilePaths
          }),
          console.log(that.data.Filepath);
        wx.showLoading({
          title: '上传中',
        })

        Promise.all(that.data.Filepath.map((value) => {
          return wx.cloud.uploadFile({
            cloudPath: Date.now() + parseInt(Math.random() * 100) + value.match(/\.[^.]+?$/)[0],
            filePath: value,
          })
        })).then(res => {
          return res.map((res) => {
            return res.fileID
          });
        }).then(res => {
          const db = wx.cloud.database();
          const add_record_Collection = db.collection('Record_picture');
          add_record_Collection.add({
            data: {
              Name: that.data.Username,
              Time: JSON.stringify(util.formatTime(new Date())), //-401003:code
              Head_picture: that.data.Head_picture,
              Picture_map: res,
              Vote: 0
            }
          });
        }).then(res => {
          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/Public_place/Public_place',
            })
          }, 1000);

        }).catch((exp) => {
          console.log(exp);
        })
      }
    });
  }
})