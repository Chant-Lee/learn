const actions = {
  asyncIncrement (context) {
    console.log(context)
    setTimeout(() => {
      context.commit('increment')
    }, 1000)
  },
  asyncLessCount ({commit}) {
    setTimeout(() => {
      commit('lessCount')
    }, 1000)
  }
}
export default actions
