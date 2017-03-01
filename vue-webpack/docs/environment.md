# 环境变量
有时，根据应用程序运行的环境，具有不同的配置值是实用的。

举个例子：


```js
// config/prod.env.js
module.exports = {
  NODE_ENV: '"production"',
  DEBUG_MODE: false,
  API_KEY: '"..."' // this is shared between all environments
}

// config/dev.env.js
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEBUG_MODE: true // this overrides the DEBUG_MODE value of prod.env
})

// config/test.env.js
module.exports = merge(devEnv, {
  NODE_ENV: '"testing"'
})
```

> 注意：字符串变量需要包装为单引号和双引号'"..."'

所以，环境变量是：
- 产生
    - NODE_ENV   = 'production',
    - DEBUG_MODE = false,
    - API_KEY    = '...'
- 发展
    - NODE_ENV   = 'development',
    - DEBUG_MODE = true,
    - API_KEY    = '...'
- 测试
    - NODE_ENV   = 'testing',
    - DEBUG_MODE = true,
    - API_KEY    = '...'

正如我们可以看到的，test.env继承dev.env和dev.env继承prod.env

### 用法

在代码中使用环境变量很简单。例如：

```js
Vue.config.debug = process.env.DEBUG_MODE
```