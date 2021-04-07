const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_NEW,
  throwOnNotFound: false
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.type == 'addNew') {
    const result = await db.collection('category').where({
      _openid: wxContext.OPENID,
      name: event.name
    }).get()

    if (result.data.length > 0) {
      return {
        msg: '不能创建相同名称的相册'
      }
    } else {
      db.collection('category').add({
        data: {
          due: new Date(),
          _openid: wxContext.OPENID,
          imgUrl: event.imgUrl,
          name: event.name
        }
      })
    }
  } else if (event.type == 'edit') {
    return await db.collection('category').where({
      _openid: wxContext.OPENID,
      _id: event._id
    }).update({
      data: {
        due: new Date(),
        _openid: wxContext.OPENID,
        imgUrl: event.imgUrl,
        name: event.name
      }
    })
  } else {
    //从存储上删除文件
    const result = await cloud.deleteFile({
      fileList: [event.imgUrl],
    })
    return await db.collection('category').doc(event._id).remove()
  }
}