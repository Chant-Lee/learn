# 与后端框架集成


如果您正在构建一个纯静态应用程序（与后端API分开部署的应用程序），那么您可能甚至不需要编辑config/index.js。但是，如果要将此模板与现有的后端框架（例如Rails / Django / Laravel）（它们自带的项目结构）进行集成，则可以编辑config/index.js以直接在后端项目中生成前端资源。

让我们来看看默认config/index.js：

``` js
var path = require('path')

module.exports = {
  build: {
    index: path.resolve(__dirname, 'dist/index.html'),
    assetsRoot: path.resolve(__dirname, 'dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true
  },
  dev: {
    port: 8080,
    proxyTable: {}
  }
}
```

在该build部分中，我们有以下选项：

### `build.index`

> 必须是本地文件系统上的绝对路径。

这是生成index.html（带有注入的资产网址）的地方。

如果您使用此模板与后端框架，您可以相应地编辑index.html，并将此路径指向由后端应用程序呈现的视图文件，例如app/views/layouts/application.html.erbRails应用程序或resources/views/index.blade.phpLaravel应用程序。

### `build.assetsRoot`

> 必须是本地文件系统上的绝对路径。

这应该指向包含应用程序的所有静态资产的根目录。例如，public/对于Rails / Laravel。

### `build.assetsSubDirectory`

在此目录下嵌入webpack生成的资产build.assetsRoot，以便它们不会与您可能存在的其他文件混合build.assetsRoot。例如，如果build.assetsRoot是/path/to/dist，和build.assetsSubDirectory是static，则将生成所有Webpack资产path/to/dist/static。

此目录将在每次构建之前清除，因此它只应包含构建生成的资产。

内部的文件static/将在构建期间被复制到此目录中。这意味着，如果您更改此前缀，您的所有绝对URL引用的文件static/也需要更改。有关详细信息，请参阅处理静态资产。
### `build.assetsPublicPath`

这应该是您build.assetsRoot通过HTTP提供服务的网址路径。在大多数情况下，这将是root（/）。仅当您的后端框架提供带有路径前缀的静态资产时，才需要更改此设置。在内部，这被传递给Webpack output.publicPath。
### `build.productionSourceMap`

是否为生成源映射。

### `dev.port`

指定开发服务器侦听的端口。


### `dev.proxyTable`

定义dev服务器的代理规则。有关更多详细信息，请参阅开发过程中的API代理。

