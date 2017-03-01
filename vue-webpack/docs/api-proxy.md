# 开发过程中的API代理

当将此样板与现有后端集成时，常见的需求是在使用开发服务器时访问后端API。为了实现这一点，我们可以并行（或远程）运行dev服务器和API后端，并让dev服务器代理所有API请求到实际的后端。

要配置代理规则，请dev.proxyTable在中编辑选项config/index.js。dev服务器使用[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 代理，所以你应该参考它的文档的详细用法。但这里有一个简单的例子

``` js
// config/index.js
module.exports = {
  // ...
  dev: {
    proxyTable: {
      // proxy all requests starting with /api to jsonplaceholder
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
```

上述例子将请求代理/api/posts/1到http://jsonplaceholder.typicode.com/posts/1。

## 网址匹配

除了静态网址，您还可以使用glob模式来匹配网址，例如/api/**。有关详细信息，请参阅上下文匹配。此外，您可以提供一个filter选项，可以是一个自定义函数来确定请求是否应该被代理：

``` js
proxyTable: {
  '*': {
    target: 'http://jsonplaceholder.typicode.com',
    filter: function (pathname, req) {
      return pathname.match('^/api') && req.method === 'GET'
    }
  }
}
```
