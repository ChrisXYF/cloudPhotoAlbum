let guid = require('../../pages/utils/guid')
Component({

  behaviors: [],

  properties: {
    myProperty: { // 属性名
      type: String,
      value: ''
    },
    myProperty2: String // 简化的定义方式
  },

  data: {
    imgUrl: '',
    ctgName: '',
    isHidden: true
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },

  methods: {
    addNewCategory: function () {
      wx.cloud.callFunction({
        name: 'add_category',
        data: {
          imgUrl: this.data.imgUrl,
          name: this.data.ctgName
        }
      }).then(res => {
        this.setData({
          isHidden: true
        })
        this.triggerEvent('loadTypeList')
      })
    },
    _upload(tempFiles, i) {
      const filePath = tempFiles[i]
      const cloudPath = 'cloud_icons/' + guid.guid() + filePath.match(/\.[^.]+?$/)[0]
      let tempFileID = '';
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          tempFileID = res.fileID
          this.setData({
            imgUrl: tempFileID
          })
        },
        fail: e => {

        },
        complete: () => {
          // wx.showToast({
          //   title: '上传完成',
          // })
        }
      })
    },
    changeImgUrl: function () {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          this._upload(res.tempFilePaths, 0)
        },
        fail: e => {
          //错误信息提示
        }
      })
    },
    changeName: function (e) {
      this.setData({
        ctgName: e.detail.value
      })
    },
    cancelAdd: function () {
      this.setData({
        isHidden: true
      })
    }
  }

})