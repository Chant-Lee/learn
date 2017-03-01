# **预处理器**

此样板为大多数常用的CSS预处理器（包括LESS，SASS，Stylus和PostCSS）预配置了CSS提取。要使用预处理器，您所需要做的就是为其安装适当的webpack加载器。例如，要使用SASS：

``` bash
npm install sass-loader node-sass --save-dev
```

注意，你还需要安装node-sass，因为sass-loader它依赖于它作为对等体的依赖。

### 在组件中使用预处理器

在组件中使用预处理器

``` html
<style lang="scss">
/* write SASS! */
</style>
```

### 关于SASS语法的注释

- lang="scss" 对应于CSS超集语法（带大括号和分号）。
- lang="sass" 对应于基于缩进的语法。
### PostCSS

*.vue默认情况下，文件中的样式通过PostCSS进行管道传输，因此您不需要为其使用特定的加载器。您可以简单地添加要build/webpack.base.conf.js在vue块中使用的PostCSS插件：

``` js
// build/webpack.base.conf.js
module.exports = {
  // ...
  vue: {
    postcss: [/* your plugins */]
  }
}
```

有关更多详细信息，vue-loader的相关文档。[vue-loader的相关文档](http://vuejs.github.io/vue-loader/en/features/postcss.html) 

### 独立CSS文件

为了确保一致的提取和处理，建议从根App.vue组件导入全局，独立的样式文件，例如：

``` html
<!-- App.vue -->
<style src="./styles/global.less" lang="less"></style>
```

请注意，您应该只为自己为应用程序编写的样式执行此操作。对于现有的库，例如Bootstrap或Semantic UI，您可以将它们放在里面/static并直接引用它们index.html。这避免了额外的构建时间，并且更好地用于浏览器缓存。