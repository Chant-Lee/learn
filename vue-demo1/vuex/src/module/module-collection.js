import Module from './module'
import { assert, forEachValue } from '../util'

export default class ModuleCollection {
  constructor (rawRootModule) {
    // register root module (Vuex.Store options)
    // 注册根模块，之前store的构造函数中曾经使用到 this._modules = new ModuleCollection(options)，注册一个根模块然后缓存在this._module中
    this.register([], rawRootModule, false)
  }

  get (path) {
    // 从根模块开始根据传入的path来获取相应的子模块
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }

  getNamespace (path) {
    //利用传入的参数path，生成相应的命名空间
    let module = this.root
    return path.reduce((namespace, key) => {
      module = module.getChild(key)
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  }
  //更新模块
  update (rawRootModule) {
    update([], this.root, rawRootModule)
  }
  // 注册模块
  register (path, rawModule, runtime = true) {
    if (process.env.NODE_ENV !== 'production') {
      assertRawModule(path, rawModule)
    }
    // 创建一个新模块
    const newModule = new Module(rawModule, runtime)
    // 判读是否为根模块
    if (path.length === 0) {
      this.root = newModule
    } else {
      //根据path路径，利用get方法获取父模块
      const parent = this.get(path.slice(0, -1))
      //为父模块添加子模块
      parent.addChild(path[path.length - 1], newModule)
    }

    // register nested modules
    // 如果当前模块里面有子模块，则递归的去注册子模块
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }
  //移除一个模块
  unregister (path) {
    // 通过get方法获取父模块
    const parent = this.get(path.slice(0, -1))
    //获取需要删除的模块的名称，即他的key
    const key = path[path.length - 1]
    if (!parent.getChild(key).runtime) return
    //利用module中removeChild方法删除该模块，其实就是delete了对象上的一个key
    parent.removeChild(key)
  }
}

function update (path, targetModule, newModule) {
  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, newModule)
  }

  // update target module
  targetModule.update(newModule)

  // update nested modules
  if (newModule.modules) {
    for (const key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[vuex] trying to add a new module '${key}' on hot reloading, ` +
            'manual reload is needed'
          )
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      )
    }
  }
}

const functionAssert = {
  assert: value => typeof value === 'function',
  expected: 'function'
}

const objectAssert = {
  assert: value => typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'),
  expected: 'function or object with "handler" function'
}

const assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
}

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(key => {
    if (!rawModule[key]) return

    const assertOptions = assertTypes[key]

    forEachValue(rawModule[key], (value, type) => {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      )
    })
  })
}

function makeAssertionMessage (path, key, type, value, expected) {
  let buf = `${key} should be ${expected} but "${key}.${type}"`
  if (path.length > 0) {
    buf += ` in module "${path.join('.')}"`
  }
  buf += ` is ${JSON.stringify(value)}.`
  return buf
}
