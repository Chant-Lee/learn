const Router = require('koa-router')
const {
  signup,
  updateUser,
  getAllUsers,
  addUserInfo,
  deleteUserInfo
} = require('../app/controllers/user')
const { hasBodyInfo, hasToken } = require('../app/filter')

module.exports = function () {
  let router = new Router({
    prefix: '/api'
  })

  router.post('/prune/signup', hasBodyInfo, signup)
  router.post('/prune/update', hasBodyInfo, hasToken, updateUser)

  router.get('/prune/getUsers', getAllUsers)
  router.post('/prune/addUser', addUserInfo)
  router.post('/prune/deleteUser', deleteUserInfo)

  return router
}