module.exports = {
  entry: './index.js',
  target: 'node',
  output: {
    filename: 'server.min.js',
    globalObject: 'this'
  },
  module: {
    rules: [{
      test: /\.(j|t)s/,
      exclude: /node_modules\/(?!@mnbroatch).+/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env',
              {
                modules: 'cjs',
                targets: 'last 4 years'
              }
            ]
          ],
          plugins: ['add-module-exports']
        }
      }
    }]
  }
}
