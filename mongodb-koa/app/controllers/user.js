const xss = require('xss')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const uuid = require('uuid')

const {
  selectUserByPhone,
  selectAllUsers,
  addUser,
  deleteUser
} = require('../service/user_service')

/**
 * 注册新用户
 * @param {Function} next          [description]
 * @yield {[type]}   [description]
 */
const signup = async (ctx, next) => {
  let phoneNumber = xss(ctx.request.body.phoneNumber.trim())
  let user = await User.findOne({
    phoneNumber,
  }).exec()
  let verifyCode = Math.floor(Math.random() * 10000 + 1)
  if (!user) {
    var accessToken = uuid.v4()
    user = new User({
      nickname: '测试用户',
      avatar: 'http://upload-images.jianshu.io/upload_images/5307186-eda1b28e54a4d48e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
      phoneNumber: xss(phoneNumber),
      verifyCode: verifyCode,
      accessToken: accessToken
    })
  }
  else {
    user.verifyCode = verifyCode
  }

  try {
    user = await user.save()
    ctx.body = {
      success: true
    }
  }
  catch (e) {
    ctx.body = {
      success: false
    }
    return next
  }

}

/**
 * 更新用户信息操作
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
const updateUser = async (ctx, next) => {
  let body = ctx.request.body
  let user = ctx.session.user
  let fields = 'avatar,gender,age,nickname,breed'.split(',')

  fields.forEach(function (field) {
    if (body[field]) {
      user[field] = xss(body[field].trim())
    }
  })

  data = await user.save()

  ctx.body = {
    success: true,
    data,
  }
}



/**
 * 查询所有用户
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
const getAllUsers = async (ctx, next) => {
  let data = await selectAllUsers()
  ctx.body = {
    success: true,
    data
  }
}

/**
 * 添加用户
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
const addUserInfo = async (ctx, next) => {
  let user = new User({
    nickname: 'zhangsan',
    avatar: 'http://www.baidu.com',
    phoneNumber: xss('15223011111'),
    accessToken: uuid.v4()
  })
  let userInfo = await addUser(user)
  if (userInfo) {
    ctx.body = {
      success: true,
      data: userInfo
    }
  }
}

/**
 * 删除用户
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
const deleteUserInfo = async (ctx, next) => {
  const phoneNumber = xss(ctx.request.body.phoneNumber.trim())
  var data = await deleteUser({ phoneNumber })
  ctx.body = {
    success: true,
    data
  }
}

module.exports = {
  signup,
  updateUser,
  getAllUsers,
  addUserInfo,
  deleteUserInfo
}