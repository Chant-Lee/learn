const webpack = require('webpack') //to access webpack runtime
const configuration = require('./webpack.dev.js')

let compiler = webpack(configuration)
compiler.apply(new webpack.ProgressPlugin())

compiler.run(function(err, stats) {
  // ...
})