const app = getApp()

Page({
  data: {
    typeList: [
      {icon:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/家庭关系.png',name: '家庭相册'},
      {icon:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/朋友.png',name: '亲朋相册'},
      {icon:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/个人.png',name: '个人自拍'},
      {icon:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/票.png',name: '票据管理'},
      {icon:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/火车票.png',name: '车船票留念'},
      {icon:'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/风景.png',name: '风景美如画'},
    ]
  },
  onLoad: function() {},
  goToCategory(event){
    wx.navigateTo({
      url: '/pages/category/index?type=' + event.currentTarget.dataset.type
    })
  }
})
