const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    path: 'dist',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    hashDigestLength: 8,
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        oneOf: [
          {
            exclude: /node_modules/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  module: true,
                }
              }
            ]
          },
          {
            include: /node_modules/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader'
            ]
          }
        ]
      },
      {
        test: /\.less/,
        use: [
          'less-loader',
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.m?jsx?/,
        use: [
          'babel-loader?cacheDirectory'
        ]
      },
      {
        test: /\.ejs$/,
        use: ['ejs-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|svg|ttf|woff|mp4|xlsx|xls)$/,
        use: ['file-loader?name=[hash:base64:7].[ext]'],
      }
    ]
  }

  resolve: {
    modules: ['node_modules'],

    extensions: ['.js', '.json', '.jsx'],

    mainField: ['browser', 'module', 'main'],

    mainFiles: ['index'],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
  ]
}