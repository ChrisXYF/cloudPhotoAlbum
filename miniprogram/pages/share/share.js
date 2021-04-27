const app = getApp()
var util = require('../../utils/util.js');

Page({

  data: {
    Username: '',
    Time: '',
    Head_picture: '',
    Filepath: '',
    textareaData: '',
    mode: ''
  },

  onLoad: function (options) {
    this.setData({
      mode: options.mode
    })
    var that = this
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
  bindTextAreaBlur(e) {
    this.setData({
      textareaData: e.detail.value
    })
  },
  toWrite() {
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
          const add_record_Collection = db.collection('daily');
          add_record_Collection.add({
            data: {
              Name: that.data.Username,
              Time: JSON.stringify(util.formatTime(new Date())), //-401003:code
              Head_picture: that.data.Head_picture,
              Picture_map: res,
              mes: that.data.textareaData
            }
          });
        }).then(res => {
          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
         that.handleDaily()
        }).catch((exp) => {
          console.log(exp);
        })
      }
    });
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
              Vote: 0,
              mes: that.data.textareaData
            }
          });
        }).then(res => {
          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
         that.handleShare()
        }).catch((exp) => {
          console.log(exp);
        })
      }
    });
  },
  handleDaily() {
    setTimeout(function () {
      wx.navigateBack({
        delta: 1,
      })
    }, 1000);
  },
  handleShare() {
    setTimeout(function () {
      wx.redirectTo({
        url: '/pages/Public_place/Public_place',
      })
    }, 1000);
  },
})