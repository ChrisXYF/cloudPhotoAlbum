let guid = require('../utils/guid.js')
let appInstance = getApp()

Page({
  data: {
    width: wx.getSystemInfoSync().windowWidth,
    height: wx.getSystemInfoSync().windowHeight,
    dailyHeight:wx.getSystemInfoSync().windowHeight-120,
    current_page: 1,
    modeArray: ['普通模式', '时光相册', '日记模式'],
    modeValue: '普通模式',
    timeItems: [],
    items: [],
    shuzu: []
  },

  onLoad: function (options) {
    let type = options.type || '其他'
    
    this.setData({
      type: type
    })
    this._get18(1)
    this._showNum()
    this.getImageList()
  },
  onShow: function() {
    this.getImageList()
  },


  // _clearImgsStorage(){
  //   let img_time = wx.getStorageSync('img_time')
  //   //第一次设置时间
  //   if (!img_time) {
  //     return wx.setStorageSync('img_time', new Date())
  //   }
  //   //超过23小时，重制时间和清空数据
  //   let dis_time = (new Date() - new Date(img_time)) / 1000
  //   if (dis_time > 23 * 60 * 60) {
  //     //清空，说明 img temp url 已经失效了
  //     wx.clearStorageSync()
  //     return wx.setStorageSync('img_time', new Date())
  //   }
  // },
  //获取图片
  getImageList() {
    let that = this;
    wx.cloud.database().collection('daily').get({
      success: function (res) {
        let arr = []
        res.data.forEach(item => {
          arr.push(item.Vote)
        })
        let result = [...res.data]
        that.setData({
          shuzu: result,
          array: arr
        })
      },
      fail(res) {
        console.log('获取失败', imgurl)
      }
    })
  },
  dailyUpload() {
    wx.navigateTo({
      url: '../share/share?mode=daily',
    })
  },
  modeChange(e) {
    let newData = this.data.timeItems.map((item) => {
      item.due = item.due.split('T')[0];
      return item
    })
    this.setData({
      modeValue: this.data.modeArray[e.detail.value],
      timeItems: newData
    })
  },

  _get18(page) {
    wx.showLoading({
      title: '加载中...'
    })
    wx.cloud.callFunction({
      name: 'get_list',
      data: {
        type: this.data.type,
        page: page
      }
    }).then(res => {
      console.log(res)
      if (res.errMsg == 'cloud.callFunction:ok') {
        this._setList(res.result.data)
        // this.setData({
        //   items: res.result.data,
        //   timeItems: res.result.data,
        //   preview_imgs: res.result.data
        // })
      }
    })

  },

  //拉取图片
  _setList(data) {
    let imgs = []
    let tempdata = []
    let preview_imgs = []

    for (let i in data) {
      imgs.push(data[i].fileID)
      //判断缓存中是否命中
      if (appInstance.globalData[imgs[i]] && appInstance.globalData[imgs[i]].tempFileURL) {
        tempdata.push(appInstance.globalData[imgs[i]])
        preview_imgs.push(appInstance.globalData[imgs[i]].tempFileURL)
      }
    }
    // //存在缓存，从缓存中取
    // if (imgs.length == tempdata.length) {
    //   let timeData = JSON.parse(JSON.stringify(tempdata))
    //   timeData.sort((l, r) => {
    //     let lDue = new Date(l.due).getTime()
    //     let rDue = new Date(r.due).getTime()
    //     return lDue - rDue
    //   })

    //   this.setData({
    //     items: tempdata,
    //     preview_imgs: preview_imgs,
    //     timeItems: timeData
    //   })
    //   wx.hideLoading()
    //   return
    // }

    wx.cloud.getTempFileURL({
      fileList: imgs,
      success: res => {
        for (let temp in res.fileList) {
          let t_url = res.fileList[temp].tempFileURL
          data[temp].tempFileURL = t_url
          preview_imgs.push(t_url)
          //将临时文件路径写进缓存
          appInstance.globalData[imgs[temp]] = data[temp]
        }
        let timeData = JSON.parse(JSON.stringify(data))
        timeData.sort((l, r) => {
          let lDue = new Date(l.due).getTime()
          let rDue = new Date(r.due).getTime()
          return lDue - rDue
        })
        this.setData({
          items: data,
          preview_imgs: preview_imgs,
          timeItems: timeData
        })
      },
      fail: err => {

      },
      complete() {
        wx.hideLoading()
      }
    })

  },

  doUpload() {
    wx.chooseImage({
      count: 5,
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

  _upload(tempFiles, i) {
    const filePath = tempFiles[i]
    const cloudPath = 'pics/' + guid.guid() + filePath.match(/\.[^.]+?$/)[0]
    let tempFileID = '';
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        tempFileID = res.fileID
        //提前显示图片
        let pics = this.data.items
        let preview_imgs = this.data.preview_imgs
        pics.unshift({
          tempFileURL: filePath,
          fileID: tempFileID
        })
        preview_imgs.unshift(filePath)
        let timeData = JSON.parse(JSON.stringify(pics))
        timeData.sort((l, r) => {
          let lDue = new Date(l.due).getTime()
          let rDue = new Date(r.due).getTime()
          return lDue - rDue
        })

        this.setData({
          items: pics,
          preview_imgs: preview_imgs,
          timeItems: timeData
        })

        wx.cloud.callFunction({
          name: 'add_item',
          data: {
            fileID: res.fileID,
            type: this.data.type,
            isLike: false,
            operation: 'addNew'
          }
        }).then(res => {
          pics[0]._id = res.result._id
          let timeData = JSON.parse(JSON.stringify(pics))
          timeData.sort((l, r) => {
            let lDue = new Date(l.due).getTime()
            let rDue = new Date(r.due).getTime()
            return lDue - rDue
          })
          this.setData({
            items: pics,
            timeItems: timeData
          })
          wx.showToast({
            title: '第 ' + (parseInt(i) + 1) + ' 张图片上传成功',
            icon: 'none'
          })
          //将界面显示的数据变更
          this.setData({
            count: this.data.count + 1
          })
          //继续上传选中的下一张图片
          if (i + 1 < tempFiles.length) {
            i = i + 1
            this._upload(tempFiles, i)
          }
        }).fail(e => {
          //失败处理
          //从已经显示的图片里剔除第一个
          pics.shift()
          preview_imgs.shift()
          let timeData = JSON.parse(JSON.stringify(pics))
          timeData.sort((l, r) => {
            let lDue = new Date(l.due).getTime()
            let rDue = new Date(r.due).getTime()
            return lDue - rDue
          })
          this.setData({
            items: pics,
            preview_imgs: preview_imgs,
            timeItems: timeData
          })
          wx.showToast({
            title: '第 ' + (parseInt(i) + 1) + ' 张图片上传失败',
            icon: 'none'
          })
        })
      },
      fail: e => {
        wx.showToast({
          title: '第 ' + (parseInt(i) + 1) + ' 张图片上传失败',
          icon: 'none'
        })
      },
      complete: () => {
        // wx.showToast({
        //   title: '上传完成',
        // })
      }
    })
  },

  doPreview(event) {
    let url = event.currentTarget.dataset.objurl
    wx.previewImage({
      current: url,
      urls: this.data.preview_imgs
    })
  },

  doDelete(e) {
    const _this = this
    let _id = e.currentTarget.dataset.objid
    let url = e.currentTarget.dataset.objurl
    let fileID = e.currentTarget.dataset.fileid
    let isLike = e.currentTarget.dataset.islike
    let items = [...this.data.items]
    console.log(items)
    console.log(e.currentTarget.dataset)
    let type = this.data.type
    let imgs = [...this.data.preview_imgs]
    let option = type == '我的收藏' ? ['', '取消收藏'] : isLike ? ['已收藏', '删除'] : ['收藏', '删除']
    wx.showActionSheet({
      itemList: option,
      success(res) {
        if (res.tapIndex == 0) {
          if (!isLike) {
            wx.cloud.callFunction({
              name: 'add_item',
              data: {
                operation: 'addLike',
                id: _id,
                fileID: fileID,
                type: '我的收藏',
                isLike: !isLike
              }
            }).then(res => {
              if (res.errMsg.indexOf('fail') < 0) {
                for (let i in items) {
                  if (items[i]._id == _id) {
                    items[i].isLike = true
                  }
                }
                let timeData = JSON.parse(JSON.stringify(items))
                timeData.sort((l, r) => {
                  let lDue = new Date(l.due).getTime()
                  let rDue = new Date(r.due).getTime()
                  return lDue - rDue
                })
                _this.setData({
                  items: items,
                  timeItems: timeData
                })
              }
            })
          }
        } else {
          console.log(_id)
          wx.showModal({
            title: '提醒',
            content: type == '我的收藏' ? '确定移除该图片吗？' : '确定要删除该图片吗？',
            success: res => {
              if (res.confirm) {
                wx.cloud.callFunction({
                  name: 'delete_item',
                  data: {
                    type:  type == '我的收藏' ? 'unLike' : 'delete',
                    fileID: fileID,
                    _id: _id
                  }
                }).then(res => {
                  console.log(res)
                  if (res.errMsg.indexOf('fail') < 0) {
                    for (let i in items) {
                      if (items[i]._id == _id) {
                        items.splice(i, 1)
                      }
                    }
                    for (let i in imgs) {
                      if (imgs[i] == url) {
                        imgs.splice(i, 1)
                      }
                    }
                    let timeData = JSON.parse(JSON.stringify(items))
                    timeData.sort((l, r) => {
                      let lDue = new Date(l.due).getTime()
                      let rDue = new Date(r.due).getTime()
                      return lDue - rDue
                    })
                    _this.setData({
                      items: items,
                      preview_imgs: imgs,
                      count: _this.data.count - 1,
                      timeItems: timeData
                    })
                  } else {
                    wx.showToast({
                      title: '服务异常，删除失败，请稍后再试',
                      icon: 'none'
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  _showNum() {
    wx.cloud.callFunction({
      name: 'get_count_page',
      data: {
        type: this.data.type
      }
    }).then(res => {
      this.setData({
        count: res.result.count,
        pagesize: res.result.pagesize,
        total_page: res.result.total_page
      })
    })
  },

  //上一页
  doPrePage() {
    let current_page = this.data.current_page
    let total_page = this.data.total_page
    if (1 < current_page) {
      this.setData({
        current_page: current_page - 1
      })
      this._get18(this.data.current_page)
    }
  },

  //下一页
  doNextPage() {
    let current_page = this.data.current_page
    let total_page = this.data.total_page
    if (current_page < total_page) {
      this.setData({
        current_page: current_page + 1
      })
      this._get18(this.data.current_page)
    }
  }

})