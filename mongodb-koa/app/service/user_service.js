const mongoose =  require('mongoose')
const User = mongoose.model('User')

/**
 * 通过电话号码查询
 * @param  {[type]} options.phoneNumber [description]
 * @return {[type]}                     [description]
 */
const selectUserByPhone = async ({phoneNumber}) => {
	let query = User.find({phoneNumber})
	let res = {}
	await query.exec(function(err, user) {
			res = user || {}
	})
	return res
}

/**
 * 查找所用用户
 * @return {[type]} [description]
 */
const selectAllUsers = async () => {
	let query = User.find({})
	let res = []
	await query.exec(function(err, users) {
    res = err ? [] : users
	})
	return res
}

/**
 * 增加用户
 * @param  {[User]} user [mongoose.model('User')]
 * @return {[type]}      [description]
 */
const addUser = async (user) => {
	user = await user.save()
	return user
}

/**
 * 删除用户
 * @param  {[type]} options.phoneNumber [description]
 * @return {[type]}                     [description]
 */
const deleteUser = async ({phoneNumber}) => {
	let flag = false
	await User.remove({phoneNumber}, function(err) {
    flag = err ? false : true	
	})
	return flag
}

module.exports = {
  selectUserByPhone,
  selectAllUsers,
  addUser,
  deleteUser
}