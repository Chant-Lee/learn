import { forEachValue } from '../util'

// Base data struct for store's module, package with some attribute and method
export default class Module {
  //模块初始化
  constructor (rawModule, runtime) {
    //缓存运行时的标志
    this.runtime = runtime
    // Store some children item
    //创建一个空对象来保存子模块
    this._children = Object.create(null)
    // Store the origin module object which passed by programmer
    //缓存传入的模块
    this._rawModule = rawModule
    //缓存传入模块的state，如果state是一个函数，则执行这个函数
    const rawState = rawModule.state

    // Store the origin module's state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }
// 判断是否是命名空间，如果是则返回 true ,如果不是则返回  false, 这里用到了隐匿类型转换
  get namespaced () {
    return !!this._rawModule.namespaced
  }

  addChild (key, module) {
    this._children[key] = module
  }

  removeChild (key) {
    delete this._children[key]
  }

  getChild (key) {
    return this._children[key]
  }
  // update方法，将原有缓存模块的namespaced，actions，mutations，getters替换成新传入模块的namespaced，actions，mutations，getters
  update (rawModule) {
    this._rawModule.namespaced = rawModule.namespaced
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters
    }
  }
  // 利用util中forEachValue方法，变量每个子模块，将每个子模块作为传入的回调函数参数，然后执行回调函数
  forEachChild (fn) {
    forEachValue(this._children, fn)
  }

  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }

  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }

  forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
}
