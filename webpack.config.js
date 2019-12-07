const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// css sourcemaps
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: "development",
  entry: [
    'webpack-dev-server/client?reload=true',
    'webpack/hot/only-dev-server?name=client',
    './app/js/app.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
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
        // test: /\.(woff(2)?|ttf|eot|svg|png|jpe?g)(\?v=\d+\.\d+\.\d+)?$/,
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
      // // URL loader
      // {
      //   test: /\.(otf|eot|png|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      //   loader: 'url?limit=8192'
      // },    
      // // File loader
      // {
      //   test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.eot$/,
      //   loader: "file"
      // }
    ]
  },
  optimization: {
    minimize: false,
    // minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    // port: 8080,
    // contentBase: ['./src', './dist'], // both src and output dirs
    inline: true,
    hot: true
  }
};
