const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'lib');
const APP_DIR = path.resolve(__dirname, 'src');

const WebpackConfig = {
  mode: 'development',

  entry: APP_DIR + '/index.ts',

  output: {
    path: BUILD_DIR,
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'staterize'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /.js$/,
        use: 'source-map-loader',
        enforce: 'pre'
      }
    ]
  }
};

module.exports = WebpackConfig;
