const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const { tanstackRouter } = require('@tanstack/router-plugin/webpack')
const path = require('path')

class CacheBustPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('CacheBustPlugin', (compilation) => {
      HtmlWebPackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'CacheBustPlugin',
        (data, cb) => {
          const appendQuery = (tag) => {
            if (tag.tagName === 'script' && tag.attributes && tag.attributes.src) {
              tag.attributes.src += `?v=${Date.now()}`;
            }
          };

          data.headTags.forEach(appendQuery);
          data.bodyTags.forEach(appendQuery);

          cb(null, data);
        }
      );
    });
  }
}

module.exports = {
  entry: './index.js',
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  output: {
    filename: 'build.js',
    chunkFilename: '[name].js?cacheBust=[chunkhash]'
  },
  optimization: {
    minimize: false
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      disableTypes: true,
      extensions: ['ts', 'tsx', 'js', 'jsx'],
    }),
    new HtmlWebPackPlugin({
      title: 'Measuring Contest',
      template: './index.html',
      templateParameters: {
        version: Date.now(),
      },
    }),
    new CacheBustPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "static", to: "" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }
    ]
  }
}
