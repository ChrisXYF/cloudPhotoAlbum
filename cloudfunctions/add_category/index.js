const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_NEW,
  throwOnNotFound: false
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return db.collection('category').add({
    data:{
      due: new Date(),
      _openid: wxContext.OPENID,
      imgUrl: event.imgUrl || 'cloud://cloudalbum-0g7a32ke424ee80f.636c-cloudalbum-0g7a32ke424ee80f-1305212202/cloud_icons/其他.png',
      name: event.name
    }
  })
}