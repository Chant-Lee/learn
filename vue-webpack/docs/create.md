# 构建命令

所有构建命令都通过NPM脚本执行。[NPM](https://docs.npmjs.com/misc/scripts).

### `npm run dev`

>启动Node.js本地开发服务器。有关更多详细信息，请参阅开发过程中的API代理。

* Webpack + vue-loader用于单文件Vue组件。
* 状态保持热重载
* 状态保留编译错误叠加
* 使用ESLint保存Lint
* 源地图

### `npm run build`

> 构建生产资产。有关更多详细信息，请参阅与[后端框架集成](backend.md)

* 使用UglifyJS缩小JavaScript 。
* HTML使用html-minifier缩小。
* 所有组件的CSS提取到一个单一的文件，并与cssnano缩小。
* 所有使用版本哈希编译的静态资产，以便进行有效的长期缓存，并且index.html自动生成带有这些生成资产的正确网址的生产。
* 另请参阅部署说明。


### `npm run unit`

> 在PhantomJS中使用Karma运行单元测试。有关详细信息，请参阅[单元测试](unit-test.md)。

- 在测试文件中支持ES2015 +。
- 支持所有webpack加载器。
- 容易模拟注入。


### `npm run e2e`

> 使用Nightwatch运行端到端测试。有关详细信息，请参阅[端到端测试](end.md)。 [Nightwatch](http://nightwatchjs.org/)

* 在多个浏览器中并行运行测试。
* 使用一个命令开箱即用：
  - 硒和chromedriver依赖自动处理。
  - 自动生成Selenium服务器。
