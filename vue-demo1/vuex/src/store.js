import applyMixin from './mixin'
import devtoolPlugin from './plugins/devtool'
import ModuleCollection from './module/module-collection'
import { forEachValue, isObject, isPromise, assert } from './util'

let Vue // bind on install
/**
 * store构造
 */
export class Store {
  constructor (options = {}) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }
    //判断一些条件
    if (process.env.NODE_ENV !== 'production') {
      assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
      assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
      assert(this instanceof Store, `store must be called with the new operator.`)
    }

    const {
      plugins = [],
      strict = false
    } = options

    // store internal state
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()

    // bind commit and dispatch to self
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // strict mode
    this.strict = strict

    const state = this._modules.root.state

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters 初始化根模块
    installModule(this, state, [], this._modules.root)

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    // 初始化state，使其变成响应式
    resetStoreVM(this, state)

    // apply plugins
    // 运用插件
    plugins.forEach(plugin => plugin(this))

    if (Vue.config.devtools) {
      devtoolPlugin(this)
    }
  }
  // 获取 state, 是从虚拟 state 上获取的，为了区别，所以使用的是 $$state
  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    if (process.env.NODE_ENV !== 'production') {
      assert(false, `use store.replaceState() to explicit replace store state.`)
    }
  }
  //定义commit 修改state值 同步执行
  commit (_type, _payload, _options) {
    // check object-style commit
    // 首先统一传入参数的格式，主要是针对当type是个对象的情况，需要把这个对象解析出来
    const {
      type,
      payload,
      options
    } = unifyObjectStyle(_type, _payload, _options)
    // 缓存本次commit操作的类型和负荷，以供后续监听队列（this._subscribers）使用
    const mutation = { type, payload }
    // 获取相关的type的mutation函数，在vuex中都是通过commit一个类型然后触发相关的mutation函数来操作state的，所以在此必须获取相关的函数
    const entry = this._mutations[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown mutation type: ${type}`)
      }
      return
    }
    // 在_withCommit中触发上面获取的mutation函数，简单粗暴使用数组的forEach执行哈哈，之所以要在外面包一层_withCommit，是表明操作的同步性
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        handler(payload)
      })
    })
    // 这个就是之前说的监听队列，在每次执行commit函数时都会遍历执行一下这个队列
    this._subscribers.forEach(sub => sub(mutation, this.state))

    if (
      process.env.NODE_ENV !== 'production' &&
      options && options.silent
    ) {
      console.warn(
        `[vuex] mutation type: ${type}. Silent option has been removed. ` +
        'Use the filter functionality in the vue-devtools'
      )
    }
  }
  // 异步修改state值和commit类似
  dispatch (_type, _payload) {
    // check object-style dispatch
    const {
      type,
      payload
    } = unifyObjectStyle(_type, _payload)

    const action = { type, payload }
    const entry = this._actions[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown action type: ${type}`)
      }
      return
    }

    this._actionSubscribers.forEach(sub => sub(action, this.state))
    // entry[0](payload) =>  wrappedActionHandler(payload, cb)
    return entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)
  }
  // 用来监听state的变化
  subscribe (fn) {
    return genericSubscribe(fn, this._subscribers)
  }

  subscribeAction (fn) {
    return genericSubscribe(fn, this._actionSubscribers)
  }
  // 监听函数，利用vue的watch
  watch (getter, cb, options) {
    if (process.env.NODE_ENV !== 'production') {
      assert(typeof getter === 'function', `store.watch only accepts a function.`)
    }
    // 在上面构造函数中，我们看到this._watcherVM就是一个vue的实例，所以可以利用它的watch来实现vuex的watch，
    // 原理都一样，当监听的值或者函数的返回值发送改变的时候，就触发相应的回调函数，
    // 也就是我们传入的cb参数，options则可以来让监听立即执行&深度监听对象

    return this._watcherVM.$watch(() => getter(this.state, this.getters), cb, options)
  }
  //替换state
  replaceState (state) {
    this._withCommit(() => {
      this._vm._data.$$state = state
    })
  }
  // registerModule函数，可以使用 store.registerModule 方法注册模块
  registerModule (path, rawModule, options = {}) {
    if (typeof path === 'string') path = [path]
    // 如果是开发环境那么断言检测一下，以保证程序稳定
    if (process.env.NODE_ENV !== 'production') {
      assert(Array.isArray(path), `module path must be a string or an Array.`)
      assert(path.length > 0, 'cannot register the root module by using registerModule.')
    }
    //其实内部时候通过register方法，递归寻找路径，然后将新的模块注册root模块上
    this._modules.register(path, rawModule)
    //安装模块，因为每个模块都有他自身的getters,actions, modules等，所以，每次注册模块都必须把这些都注册上
    installModule(this, this.state, path, this._modules.get(path), options.preserveState)
    // reset store to update getters...
    // 重置VM store
    resetStoreVM(this, this.state)
  }

  unregisterModule (path) {
    if (typeof path === 'string') path = [path]

    if (process.env.NODE_ENV !== 'production') {
      assert(Array.isArray(path), `module path must be a string or an Array.`)
    }

    this._modules.unregister(path)
    // 拿到模块，并将其从其父模块上删除
    this._withCommit(() => {
      const parentState = getNestedState(this.state, path.slice(0, -1))
      // 利用vue.delete方法，确保模块在被删除的时候，视图能监听到变化
      Vue.delete(parentState, path[path.length - 1])
    })
    // 重置模块，也就是重新安装
    resetStore(this)
  }
  //Vuex 支持在开发过程中热重载 mutation、modules、actions、和getters
  hotUpdate (newOptions) {
    this._modules.update(newOptions)
    resetStore(this, true)
  }
  // 内部方法，用来保证commit是同步方法
  _withCommit (fn) {
    // 保存原来的committing的状态
    const committing = this._committing
    //将想在的committing状态设置为true
    this._committing = true
    fn()
    //将committing状态设置为原来的状态
    this._committing = committing
  }
}

/**
 * 返回一个函数，便于用户取消订阅
 * @param fn
 * @param subs
 * @returns {Function}
 */
function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn)
  }
  return () => {
    const i = subs.indexOf(fn)
    if (i > -1) {
      subs.splice(i, 1)
    }
  }
}
// 用于重置整个vuex中的store,从代码中可以看出，这个函数主要的功能，就是将传入的store实例的_actions，_mutations，_wrappedGetters，_modulesNamespaceMap置为空，
// 然后重新安装模块和重置VM，此方法在上述热更新和注销模块的时候会使用到
function resetStore (store, hot) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  store._modulesNamespaceMap = Object.create(null)
  const state = store.state
  // init all modules
  installModule(store, state, [], store._modules.root, true)
  // reset vm
  resetStoreVM(store, state, hot)
}
//用于重置store中的vm,
//重置vm，也就是vue的一个实例，它会保存state树，
function resetStoreVM (store, state, hot) {
  //保存一个原有_vm
  const oldVm = store._vm
  console.log(oldVm)
  // bind store public getters
  store.getters = {}
  // store的_wrappedGetters缓存了当前store中所有的getter
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  //遍历这个对象，获取每个getter的key和对应的方法
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    // 将getter以key-value的形式缓存在变量computed中，其实后面就是将getter作为vue实例中的计算属性
    computed[key] = () => fn(store)
    // 当用户获取getter时，相当于获取vue实例中的计算属性，使用es5的这个Object.defineProperty方法做一层代理
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  // silent设置为true，则取消了所有的警告和日志，眼不见为净
  Vue.config.silent = true
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  if (store.strict) {
    //如果设置了严格模式则，不允许用户在使用mutation以外的方式去修改state
    enableStrictMode(store)
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.'
      // 将原有的vm中的state设置为空，所以原有的getter都会重新计算一遍，利用的就是vue中的响应式，getter作为computed属性，
      // 只有他的依赖改变了，才会重新计算，而现在把state设置为null，所以计算属性重新计算
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
// 用于安装模块，注册相应的mutation,action,getter和子模块等
function installModule (store, rootState, path, module, hot) {
  //判断是否为根模块
  const isRoot = !path.length
  //根据路径生成相应的命名空间
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    // 将模块的state设置为响应式
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      Vue.set(parentState, moduleName, module.state)
    })
  }
  //设置本地上下文，主要是针对模块的命名空间，对dispatch,commit,getters和state进行修改，
  // 用户能够直接获取到对象子模块下的对象

  const local = module.context = makeLocalContext(store, namespace, path)
//将mutation注册到模块上
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })
//将action注册到模块上
  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })
//递归安装子模块
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 * 如果没有命名空间，则是使用全局store上的属性，否则对store上的属性进行本地化处理
 */
function makeLocalContext (store, namespace, path) {
  const noNamespace = namespace === ''

  const local = {
    //dispatch的本地化处理，就是修改type
    dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(`[vuex] unknown local action type: ${args.type}, global type: ${type}`)
          return
        }
      }

      return store.dispatch(type, payload)
    },
    // commit的本地化修改跟dispatch相似，也是只是修改了type，然后调用store上面的commit
    commit: noNamespace ? store.commit : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(`[vuex] unknown local mutation type: ${args.type}, global type: ${type}`)
          return
        }
      }

      store.commit(type, payload, options)
    }
  }

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  //gettters和state的修改，则依赖于makeLocalGetters函数和getNestedState函数

  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace)
    },
    state: {
      get: () => getNestedState(store.state, path)
    }
  })

  return local
}

function makeLocalGetters (store, namespace) {
  const gettersProxy = {}

  const splitPos = namespace.length
  Object.keys(store.getters).forEach(type => {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) return

    // extract local getter type
    const localType = type.slice(splitPos)

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: () => store.getters[type],
      enumerable: true
    })
  })

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}
// 注册action的过程，原理类似于registerMutation，不同点在于action支持异步，所以必须用promise进行包装
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}
// registerGetters函数,根据type，将getter方法挂载在store._wrappedGetters[type]下面
function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate getter key: ${type}`)
    }
    return
  }
  // 为子模块的getter提供了这个四个参数，方便用户获取，如果是根模块，则local跟store取出来的state和getters相同
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
// enableStrictMode函数则是在严格模式下，不允许state被除mutation之外的其他操作修改，代码比较简单，利用vue的$watch方法实现的
function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, () => {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
    }
  }, { deep: true, sync: true })
}
// 获取对应路径下的state
function getNestedState (state, path) {
  return path.length
    ? path.reduce((state, key) => state[key], state)
    : state
}
// 调整参数，主要是当type是一个对象的时候，对参数进行调整
function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', `expects string as the type, but found ${typeof type}.`)
  }

  return { type, payload, options }
}

/**
 * 安装vue
 * @param _Vue
 */
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  //在vue的生命周期中初始化vuex
  applyMixin(Vue)
}
