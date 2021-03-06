const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_NEW,
  throwOnNotFound: false
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await db.collection('photos').doc(event._id).remove()
  //从存储上删除文件
  if (event.typpe == 'delete') {
    return await cloud.deleteFile({
      fileList: [event.fileID],
    })
  } else {
    return await db.collection('photos').where({
      _openid: wxContext.OPENID,
      fileID: event.fileID
    }).update({
      data: {
        isLike: false
      }
    })
  }
}