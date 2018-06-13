## 1 前言
### 1.1 
像我们熟悉的 vue-cli，taro-cli 等脚手架，只需要输入简单的命令 taro init project，即可快速帮我们生成一个初始项目。在日常开发中，有一个脚手架工具可以用来提高工作效率。
### 1.2 为什么需要脚手架

* 减少重复性的工作，从零创建一个项目和文件。
* 根据交互动态生成项目结构和配置文件等。
* 多人协作更为方便，不需要把文件传来传去。

### 1.3 怎样来搭建呢？
脚手架是怎么样进行构建的呢，我是借助了[taro-cli](https://github.com/NervJS/taro/tree/master/packages/taro-cli)的思路。

### 1.4 本文的目标读者
* 1 想要学习更多和了解更多的人
* 2 对技术充满热情

## 2 搭建前准备

### 2.1 第三方工具

* [commander.js](https://github.com/tj/commander.js)，可以自动的解析命令和参数，用于处理用户输入的命令。
* [download-git-repo](https://github.com/flipxfx/download-git-repo)，下载并提取 git 仓库，用于下载项目模板。
* [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)，通用的命令行用户界面集合，用于和用户进行交互。
* [handlebars.js](https://github.com/wycats/handlebars.js)，模板引擎，将用户提交的信息动态填充到文件中。
* [ora](https://github.com/sindresorhus/ora)，下载过程久的话，可以用于显示下载中的动画效果。
* [chalk](https://github.com/chalk/chalk)，可以给终端的字体加上颜色。
* [log-symbols](https://github.com/sindresorhus/log-symbols)，可以在终端上显示出 √ 或 × 等的图标

### 2.2 上手

#### 2.2.1 新建一个文件夹，然后npm init初始化
npm 不单单用来管理你的应用和网页的依赖，你还能用它来封装和分发新的 shell 命令。
```
$ mkdir lq-cli
$ npm init 
```

这时在我们的lq-cli项目中有 package.json 文件，然后需要创建一个 JS 文件包含我们的脚本就取名index.js吧。
package.json内容如下
```
{
  "name": "lq-shell",
  "version": "1.0.0",
  "description": "脚手架搭建",
  "main": "index.js",
  "bin": {
    "lq": "./index.js"
  },
  "scripts": {
    "test": "test"
  },
  "keywords": [
    "cli"
  ],
  "author": "prune",
  "license": "ISC"
}

```
index.js内容如下
```
#!/usr/bin/env node

console.log('Hello, cli!');

```
到这一步就可以简单运行一下这个命令
```
npm link
lq
```
npm link命令可以将一个任意位置的npm包链接到全局执行环境，从而在任意位置使用命令行都可以直接运行该npm包。
控制台会输出`Hello, cli!`

#### 2.2.2 捕获init之类的命令
前面的一个小节，可以跑一个命令行了，但是我们看到的taro-cli中还有一些命令，init初始化项目之类。这个时候`commander`就需要利用起来了。
运行下面的这个命令将会把最新版的 commander 加入 package.json
```
npm install --save commander
```
引入commander我们将index.js做如下修改

```
#!/usr/bin/env node

console.log('Hello, cli!')

const program = require('commander')
program
  .version(require('./package').version, '-v, --version')    
  .command('init <name>')
  .action((name) => {
      console.log(name)
  })
  
program.parse(process.argv)
```

可以通过`lq -v`来查看版本号
通过`lq init name`的操作，action里面会打印出name
#### 2.2.3 对console的美工
我们看到taro init 命令里面会有一些颜色标识，就是因为引入了chalk这个包，同样和commander一样

```
npm install --save chalk
```
console.log(chalk.green('init创建'))
这样会输出一样绿色的
#### 2.2.4 模板下载
download-git-repo 支持从 Github下载仓库，详细了解可以参考官方文档。
```
npm install --save download-git-repo
```
download() 第一个参数就是仓库地址,详细了解可以看官方文档

#### 2.2.5 命令行的交互
命令行交互功能可以在用户执行 init 命令后，向用户提出问题，接收用户的输入并作出相应的处理。用 inquirer.js 来实现。
```
npm install --save inquirer
```
index.js文件如下

```
#!/usr/bin/env node
const chalk = require('chalk')
console.log('Hello, cli!')
console.log(chalk.green('init创建'))
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
program
  .version(require('./package').version, '-v, --version')    
  .command('init <name>')
  .action((name) => {
      console.log(name)
      inquirer.prompt([
        {
            type: 'input',
            name: 'author',
            message: '请输入你的名字'
        }
      ]).then((answers) => {
        console.log(answers.author)
        download('',
          name, {clone: true}, (err) => {
          console.log(err ? 'Error' : 'Success')
        })
      })
      
  })
program.parse(process.argv)
```
#### 2.2.6 ora进度显示

```
npm install --save ora
```
相关命令可以如下

```
const ora = require('ora')
// 开始下载
const proce = ora('正在下载模板...')
proce.start()

// 下载失败调用
proce.fail()

// 下载成功调用
proce.succeed()
```
#### 2.2.6  log-symbols 在信息前面加上 √ 或 × 等的图标

```
npm install --save log-symbols
```
相关命令可以如下

```
const chalk = require('chalk')
const symbols = require('log-symbols')
console.log(symbols.success, chalk.green('SUCCESS'))
console.log(symbols.error, chalk.red('FAIL'))
```
#### 2.2.7 完整文件如下
```
#!/usr/bin/env node
const chalk = require('chalk')
console.log('Hello, cli!')
console.log(chalk.green('init创建'))
const fs = require('fs')
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const symbols = require('log-symbols')
program
  .version(require('./package').version, '-v, --version')    
  .command('init <name>')
  .action((name) => {
      console.log(name)
      inquirer.prompt([
        {
            type: 'input',
            name: 'author',
            message: '请输入你的名字'
        }
      ]).then((answers) => {
        console.log(answers.author)
        const lqProcess = ora('正在创建...')
        lqProcess.start()
        download('github:/Mr-Prune/learn/mongodb-koa',
          name, {clone: true}, (err) => {
          if (err) {
            lqProcess.fail()
            console.log(symbols.error, chalk.red(err))
          } else {
            lqProcess.succeed()
            const fileName = `${name}/package.json`
            const meta = {
              name,
              author: answers.author
            }
            if(fs.existsSync(fileName)){
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
          }
          console.log(symbols.success, chalk.green('创建成gong'))
          }
        })
      })
      
  })
program.parse(process.argv)
```
## 总结
通过上面的例子只是能够搭建出一个简单的脚手架工具，其实bash还可以做很多东西，比如 npm 包优雅地处理标准输入、管理并行任务、监听文件、管道流、压缩、ssh、git等，要想了解更多，就要深入了解，这里只是打开一扇门，学海无涯