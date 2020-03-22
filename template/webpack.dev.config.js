const webpackMerge = require('webpack-merge');
const openBrowser = require('./openBrowser');
const baseConfig = require('./webpack.base.config');

module.exports = webpackMerge(baseConfig, {
  mode: 'development',

  devtool: 'eval',

  module: {
    rules: [{
      test: /\.css$/,
      oneOf: [{
          exclude: /node_modules/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              }
            }
          ],
        },
        {
          include: /node_modules/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    }]
  },

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
  },
});
