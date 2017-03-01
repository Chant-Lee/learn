# 预渲染SEO

如果您想要预渲染路由，一旦推送到生产，它不会显着更改，请使用此Webpack插件：[prerender-spa-plugin](https://www.npmjs.com/package/prerender-spa-plugin)，已经过测试与Vue一起使用。对于网页不经常更改，[Prerender.io](https://prerender.io/) 和[Netlify](https://www.netlify.com/pricing) 都提供计划定期重新预呈现您的搜索引擎的内容。


## Using `prerender-spa-plugin`

1. 将其作为开发人员依赖关系安装：

```bash
npm install --save-dev prerender-spa-plugin
```

2. 在build / webpack.prod.conf.js中需要它：
```js
// This line should go at the top of the file where other 'imports' live in
var PrerenderSpaPlugin = require('prerender-spa-plugin')
```

3. 在plugins数组中（也在build / webpack.prod.conf.js中）配置它：
```js
new PrerenderSpaPlugin(
  // Path to compiled app
  path.join(__dirname, '../dist'),
  // List of endpoints you wish to prerender
  [ '/' ]
)
```

如果你也想预呈现/about和/contact，然后该数组会[ '/', '/about', '/contact' ]。