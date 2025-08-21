const config = require('./webpack.config.js')

module.exports = {
  ...config,
  output: {
    ...config.output,
    publicPath: '/',
  },
  mode: 'development',
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /./, to: '/index.html' }, 
      ],
    },
  }
}
