const app = getApp()

Page({
  data: {
    typeList:[],
    defaultList: [
      {imgUrl:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/家庭关系.png',name: '家庭相册'},
      {imgUrl:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/朋友.png',name: '亲朋相册'},
      {imgUrl:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/个人.png',name: '个人自拍'},
      {imgUrl:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/票.png',name: '票据管理'},
      {imgUrl:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/火车票.png',name: '车船票留念'},
      {imgUrl:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/风景.png',name: '风景美如画'},
    ]
  },
  onLoad: function() {
    this.loadTypeList()
  },
  loadTypeList() {
    wx.cloud.callFunction({
      name: 'get_category',
    }).then(res => {
      if (res.errMsg == 'cloud.callFunction:ok'){
        this.setData({
          typeList: [...res.result.typeList.data]
        })
      }
    })
  },
  goToCategory(event){
    wx.navigateTo({
      url: '/pages/category/index?type=' + event.currentTarget.dataset.type
    })
  },
  addCategory() {
    const addNewItem = this.selectComponent('.addNewCategory')
    addNewItem.setData({
      isHidden: false
    })
  }
})
