const app = getApp()

Page({
  data: {
    typeList: [],
    defaultList: [{
        imgUrl: 'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/收藏.png',
        name: '我的收藏'
      },{
        imgUrl: 'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/家庭关系.png',
        name: '家庭相册'
      },
      {
        imgUrl: 'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/朋友.png',
        name: '亲朋相册'
      },
      {
        imgUrl: 'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/个人.png',
        name: '个人自拍'
      },
      {
        imgUrl: 'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/票.png',
        name: '票据管理'
      },
      {
        imgUrl: 'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/火车票.png',
        name: '车船票留念'
      },
      {
        imgUrl: 'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/风景.png',
        name: '风景美如画'
      },
    ]
  },
  onLoad: function () {
    this.loadTypeList()
  },
  loadTypeList() {
    wx.cloud.callFunction({
      name: 'get_category',
    }).then(res => {
      if (res.errMsg == 'cloud.callFunction:ok') {
        this.setData({
          typeList: [...res.result.typeList.data]
        })
      }
    })
  },
  goToCategory(event) {
    wx.navigateTo({
      url: '/pages/category/index?type=' + event.currentTarget.dataset.type
    })
  },
  addCategory(ctgName = '', imgUrl = '', id = '') {
    const addNewItem = this.selectComponent('.addNewCategory')
    if (typeof (ctgName) != 'string') {
      addNewItem.setData({
        type: 'addNew',
        ctgName: '',
        imgUrl: '',
        isHidden: false
      })
    } else {
      addNewItem.setData({
        ctgName,
        imgUrl,
        id,
        type: 'edit',
        isHidden: false
      })
    }
  },
  doDelete(e) {
    const that = this
    let _id = e.currentTarget.dataset.objid
    let index = e.currentTarget.dataset.objindex
    let imgUrl = e.currentTarget.dataset.imgurl
    let ctgName = e.currentTarget.dataset.ctgname
    let typeList = this.data.typeList

    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success(res) {
        if (res.tapIndex == 0) {
          that.addCategory(ctgName, imgUrl, _id)
        } else {
          wx.showModal({
            title: '提醒',
            content: '你确定要删除吗？',
            success: res => {
              if (res.confirm) {
                wx.cloud.callFunction({
                  name: 'manage_category',
                  data: {
                    type: 'delete',
                    _id: _id,
                    imgUrl: imgUrl
                  }
                }).then(res => {
                  if (res.errMsg.indexOf('fail') < 0) {
                    typeList.splice(index, 1)
                    that.setData({
                      typeList
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})