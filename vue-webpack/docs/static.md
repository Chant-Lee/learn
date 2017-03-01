# 处理静态文件

您将注意到在项目结构中，我们有两个静态资源目录：src/assets和static/。它们之间有什么区别？

### Webpacked

To answer this question, we first need to understand how Webpack deals with static assets. In `*.vue` components, all your templates and CSS are parsed by `vue-html-loader` and `css-loader` to look for asset URLs. For example, in `<img src="./logo.png">` and `background: url(./logo.png)`, `"./logo.png"` is a relative asset path and will be **resolved by Webpack as a module dependency**.

为了回答这个问题，我们首先需要了解Webpack如何处理静态资产。在*.vue组件中，您的所有模板和CSS都由解析vue-html-loader和css-loader查找资源网址。例如，在<img src="./logo.png">和中background: url(./logo.png)，"./logo.png"是相对资产路径，将由Webpack解析为模块依赖项。

因为logo.png不是JavaScript，当被当作模块依赖，我们需要使用url-loader和file-loader处理它。这个样板文件已经为你配置了这些加载器，所以你基本上可以免费获得文件名指纹和条件base64内联等功能，同时能够使用相对/模块路径，而不必担心部署。

由于这些资源可能在构建期间内联/复制/重命名，因此它们基本上是源代码的一部分。这就是为什么建议将Webpack处理的静态资源放在里面/src，沿着其他源文件。事实上，你甚至不必把它们全部/src/assets：你可以根据模块/组件使用它们来组织它们。例如，您可以将每个组件放在其自己的目录中，其静态资产位于其旁边。

### 文件解析规则

- 相对URL，例如./assets/logo.png将被解释为模块依赖。它们将替换为基于您的Webpack输出配置的自动生成的URL。

- 非前缀URL，例如assets/logo.png将被视为与相对URL相同并被翻译成./assets/logo.png。

- 以前缀的网址~被视为模块请求，类似于require('some-module/image.png')。如果要利用Webpack的模块解析配置，则需要使用此前缀。例如，如果您有一个解决别名assets，您需要使用<img src="~assets/logo.png">以确保别名受到尊重。

- 根相对URL，例如/assets/logo.png根本不处理。

### 在JavaScript中获取文件路径

为了使Webpack返回正确的文件路径，您需要使用require('./relative/path/to/file.jpg')，它将由处理file-loader并返回解析的URL。例如：

``` js
computed: {
  background () {
    return require('./bgs/' + this.id + '.jpg')
  }
}
```

注意上面的例子将包括./bgs/最终构建中的每个图像。这是因为Webpack无法猜测其中的哪些将在运行时使用，因此它包括所有。

### “真正的”静态文件

相比之下，Webpack static/根本不处理文件：它们直接复制到其最终目的地，具有相同的文件名。您必须使用绝对路径引用这些文件，这是由join build.assetsPublicPath和build.assetsSubDirectoryin决定的config.js。



``` js
// config.js
module.exports = {
  // ...
  build: {
    assetsPublicPath: '/',
    assetsSubDirectory: 'static'
  }
}
```
static/应使用绝对URL引用放置的任何文件/static/[filename]。如果您更改assetSubDirectory为assets，则这些网址需要更改为/assets/[filename]。

我们将在有关后端集成的部分中了解有关配置文件的更多信息。