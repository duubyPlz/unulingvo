const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// css sourcemaps
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: "development",
  entry: [
    'webpack-dev-server/client',
    'webpack/hot/only-dev-server',
    './app/js/app.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  resolve: {
    alias: {
      $: "jquery/src/jquery",
    }
  },
  devtool: devMode ? 'cheap-module-eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ],
      },
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|png|svg)(\?.*$|$)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/fonts/'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: false,
    // minimize: true, // turn this on for prod
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    inline: true, // prevent verbose [HMR] logging
    hot: true
  }
};
