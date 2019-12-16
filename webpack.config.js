const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DIST_DIR = resolve(__dirname, './dist');
const SRC_DIR = resolve(__dirname, './example');

const config = {
  mode: 'development',
  context: SRC_DIR,
  devtool: false,

  resolve: {
    extensions: ['.js', '.ts'],
    modules: [
      SRC_DIR,
      'node_modules',
    ],
  },

  entry: {
    main: './index.ts',
  },

  output: {
    path: DIST_DIR,
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader'
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    contentBase: DIST_DIR,
    hot: true,
    port: 9001,
    host: 'localhost',
  },
};

module.exports = config;
