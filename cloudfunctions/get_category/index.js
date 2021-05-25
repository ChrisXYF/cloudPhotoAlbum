const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  throwOnNotFound: false
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const typeList = await db.collection('category').where({
    _openid: wxContext.OPENID
  }).get()

  return {
    typeList: typeList
  }
}