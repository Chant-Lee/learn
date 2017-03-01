# 单元测试

本样板用于单元测试的工具概述：

- [Karma](https://karma-runner.github.io/): 启动浏览器的测试运行器，运行测试并将结果报告给我们。
- [karma-webpack](https://github.com/webpack/karma-webpack): Karma的插件，它使用Webpack捆绑我们的测试。
- [Mocha](https://mochajs.org/): 我们写测试规范的测试框架。
- [Chai](http://chaijs.com/): 测试断言库，提供更好的断言语法。
- [Sinon](http://sinonjs.org/): 提供间谍，存根和模拟的测试实用程序库。

柴和兴农使用的是集成卡玛兴农齐[karma-sinon-chai](https://github.com/kmees/karma-sinon-chai)因此所有的柴接口（should，expect，assert） ，并sinon在测试文件全局可用。

And the files:

- `index.js`

  这是用于karma-webpack捆绑所有测试代码和源代码（用于覆盖目的）的条目文件。你可以忽略它的大部分。
- `specs/`

 这个目录是你写实际测试的地方。您可以在测试中使用完整的ES2015 +和所有支持的Webpack加载器。

- `karma.conf.js`

  这是Karma配置文件。有关详细信息，请参阅Karma文档[Karma docs](https://karma-runner.github.io/) 

## 在更多浏览器中运行测试

您可以通过安装更多的karma发射器并调整其中的browsers字段，在多个实际浏览器中运行测试test/unit/karma.conf.js。

## 模拟依赖

默认情况下，此样板自带了inject-loader[inject-loader](https://github.com/plasticine/inject-loader)。有关*.vue组件的使用，请参阅[vue-loader docs on testing with mocks](http://vue-loader.vuejs.org/en/workflow/testing-with-mocks.html).
