const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: "development",
    entry: './app/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        alias: {
            $: "jquery/src/jquery",
        }
    },
    optimization: {
        minimize: false,
        // minimize: true,
        minimizer: [new TerserPlugin()],
    },
    devServer: {
        publicPath: './dist',
    }
};
