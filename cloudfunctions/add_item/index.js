const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_NEW,
  throwOnNotFound: false
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if(event.operation == 'addLike') {
    await db.collection('photos').doc(event.id).update({
      data: {
        isLike: event.isLike
      }
    })
  }
  return db.collection('photos').add({
    data:{
      due: new Date(),
      _openid: wxContext.OPENID,
      type: event.type || '其他',
      fileID: event.fileID,
      isLike: event.isLike
    }
  })
}