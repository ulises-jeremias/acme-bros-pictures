const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const commonPaths = require('./common-paths');

const config = {
  output: {
    filename: 'bundle.js',
    path: commonPaths.outputServerPath,
    publicPath: '/',
  },
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
    }),
    new TerserWebpackPlugin({
      sourceMap: true,
    }),
    new CleanWebpackPlugin({
      root: commonPaths.root,
    }),
    new CopyWebpackPlugin([
      {
        from: commonPaths.template,
        to: commonPaths.templatesOutputServerPath,
        transform: (content) => Buffer.from(
          content.toString().replace(new RegExp('{{base}}', 'g'), '/'),
          'utf8',
        ),
      },
      {
        from: commonPaths.favicon,
        to: commonPaths.outputServerPath,
      },
    ]),
  ],
};

module.exports = config;
