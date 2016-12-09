var path = require('path')
var webpack = require('webpack')
var rootPath = process.cwd()

module.exports = {
  context: path.join(rootPath, 'src'),
  entry: {
    app: ['webpack-hot-middleware/client', './app.js']
  },
  output: {
    path: path.join(rootPath, 'build'),
    library: '[name]',
    filename: '[name].js',
    publicPath: '/build'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      production: JSON.stringify(false)
    })
  ],
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'babel', exclude: /node_modules/ },
      {
        test: /\.(css)$/,
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      }
    ]
  },
  postcss () {
    return [require('autoprefixer'), require('precss'), require('postcss-nested')]
  }
}
