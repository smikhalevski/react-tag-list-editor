var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    index: './src/main/index.js'
  },
  output: {
    path: './target/out',
    filename: '[name].js',
    libraryTarget: 'commonjs'
  },
  resolve: {
    root: path.resolve(__dirname, 'node_modules'),
    fallback: [
      path.resolve(__dirname, '..')
    ]
  },
  externals: [
    {
      'react': true,
      'react-dom': true
    }
  ],
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel'},
      {test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!less?strictUnits=true&strictMath=true')}
    ]
  }
};
