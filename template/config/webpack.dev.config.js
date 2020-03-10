const webpackMerge = require('webpack-merge');
const openBrowser = require('./openBrowser');
const baseConfig = require('./webpack.base.config');

module.exports = {
  mode: 'development',

  devtool: 'eval',

  devServer: {
    hot: true,
    open: true,
    compress: true,
    disableHostCheck: true,
    historyApiFallback: true,
    writeToDisk: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    serveIndex: true,
    host: '0.0.0.0',
    port: 10000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    index: 'index.html',
    proxy: {

    },
    publicPath: '/',
    after: () => {
      openBrowser();
    },
  }
}