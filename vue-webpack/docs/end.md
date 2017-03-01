# 端到端测试


这个样板文件使用Nightwatch.js进行e2e测试。Nightwatch.js是在Selenium之上构建的高度集成的e2e测试运行器。这个样板自带的Selenium服务器和chromedriver二进制文件为您预先配置，所以你不必自己麻烦这些。

让我们来看看目录中的文件test/e2e：

- `runner.js`

  一个Node.js脚本，它启动dev服务器，然后启动Nightwatch对其运行测试。这是运行时将运行的脚本npm run e2e

- `nightwatch.conf.js`

 Nightwatch配置文件。有关详细信息，请参阅配置上的[Nightwatch文档](http://nightwatchjs.org/guide#settings-file) 

- `custom-assertions/`

  可以在Nightwatch测试中使用的自定义断言。有关详细信息，请参阅Nightwatch的文档以编写自定义断言。

- `specs/`
- 
你实际测试！有关详细信息，请参阅Nightwatch的文档，了解如何编写测试和API参考。
  You actual tests! See [Nightwatch's docs on writing tests](http://nightwatchjs.org/guide#writing-tests) and [API reference](http://nightwatchjs.org/api) for more details.

### 在更多浏览器中运行测试
要配置哪些浏览器运行测试，请在“test_settings”中添加一个条目test/e2e/nightwatch.conf.js，以及中的--env标志test/e2e/runner.js。如果你想在像SauceLabs这样的服务上配置远程测试，你可以根据环境变量设置Nightwatch配置，或者使用单独的配置文件。有关详细信息，请咨询Selenium的夜视文档。
To configure which browsers to run the tests in, add an entry under "test_settings" in [`test/e2e/nightwatch.conf.js`](https://github.com/vuejs-templates/webpack/blob/master/template/test/e2e/nightwatch.conf.js#L17-L39) , and also the `--env` flag in [`test/e2e/runner.js`](https://github.com/vuejs-templates/webpack/blob/master/template/test/e2e/runner.js#L15). If you wish to configure remote testing on services like SauceLabs, you can either make the Nightwatch config conditional based on environment variables, or use a separate config file altogether. Consult [Nightwatch's docs on Selenium](http://nightwatchjs.org/guide#selenium-settings) for more details.
