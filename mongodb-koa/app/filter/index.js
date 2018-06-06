const mongoose = require('mongoose')
const uuid = require('uuid')
const User = mongoose.model('User')

const hasBodyInfo = async (ctx, next) => {
  let body = ctx.request.body || {}
  if (Object.keys(body).length === 0) {
    ctx.body = {
      success: false,
      err: '某参数缺失'
    }
    return next
  }

  await next()
}

// 检验token
const hasToken = async (ctx, next) => {
  let accessToken = ctx.query.accessToken

  if (!accessToken) {
    accessToken = ctx.request.body.accessToken
  }
  if (!accessToken) {
    ctx.body = {
      success: false,
      err: '令牌失效'
    }

    return next
  }

  const user = await User.findOne({
    accessToken: accessToken
  })
  .exec()

  if (!user) {
    ctx.body = {
      success: false,
      err: '用户没登陆'
    }

    return next
  }

  ctx.session = ctx.session || {}
  ctx.session.user = user

  await next()
}

module.exports = {
  hasToken,
  hasBodyInfo
}