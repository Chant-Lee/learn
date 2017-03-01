# Project Structure

``` bash

      ├── build/                      # 此目录包含开发服务器和生产webpack构建的实际配置。通常你不需要触摸这些文件，除非你想自定义Webpack加载器，在这种情况下你应该看看build/webpack.base.conf.js。
      │   └── ...
      ├── config/
      │   ├── index.js                # 这是显示构建设置的一些最常见配置选项的主配置文件。
      │   └── ...
      ├── src/                        # 这是大多数应用程序代码都存在的地方。
      │   ├── main.js                 # app entry file
      │   ├── App.vue                 # main app component
      │   ├── components/             # ui components
      │   │   └── ...
      │   └── assets/                 # module assets (processed by webpack)
      │       └── ...
      ├── static/                     # 此目录是您不想使用Webpack处理的静态资产的转义填充。它们将被直接复制到生成webpack构建的资产的同一目录中。
      ├── test/
      │   └── unit/                   # 包含单元测试相关文件。
      │   │   ├── specs/              #
      │   │   ├── index.js            # test build entry file
      │   │   └── karma.conf.js       # test runner config file
      │   └── e2e/                    # 包含e2e测试相关文件
      │   │   ├── specs/              # test spec files
      │   │   ├── custom-assertions/  # custom assertions for e2e tests
      │   │   ├── runner.js           # test runner script
      │   │   └── nightwatch.conf.js  # test runner config file
      ├── .babelrc                    # babel config
      ├── .editorconfig.js            # editor config
      ├── .eslintrc.js                # eslint config
      ├── index.html                  # 这是我们的单页应用程序的模板 index.html。在开发和构建期间，Webpack将生成资产，并且这些生成的资产的URL将自动注入此模板以呈现最终的HTML。
      └── package.json                # NPM包元文件，其中包含所有构建依赖项和构建命令。

```

### `build/`

此目录包含开发服务器和生产webpack构建的实际配置。通常你不需要触摸这些文件，除非你想自定义Webpack加载器，在这种情况下你应该看看build/webpack.base.conf.js。

### `config/index.js`

这是显示构建设置的一些最常见配置选项的主配置文件。有关更多详细信息，请参阅[API代理](api-proxy.md)和 [与后端框架集成](backend.md)

### `src/`

这是大多数应用程序代码都存在的地方。如何构建这个目录中的所有内容主要取决于您; 如果使用Vuex，可以参考Vuex应用程序的建议。

### `static/`

此目录是您不想使用Webpack处理的静态资产的转义填充。它们将被直接复制到生成webpack构建的资产的同一目录中。

有关详细信息，请参阅[处理静态资产](static.md)

### `test/unit`

包含单元测试相关文件。有关详细信息，请参阅[单元测试](unit-test.md)

### `test/e2e`
包含e2e测试相关文件。有关详细信息，请参阅[端到端测试](end.md)。

### `index.html`

这是我们的单页应用程序的模板 index.html。在开发和构建期间，Webpack将生成资产，并且这些生成的资产的URL将自动注入此模板以呈现最终的HTML。

### `package.json`

NPM包元文件，其中包含所有构建依赖项和构建命令。
