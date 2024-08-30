// chrome-extension/webpack.config.js
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    popup: './src/popup.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  devtool: false,
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/manifest.json', to: '.' },
        { from: './src/popup.html', to: '.' },
        { from: './src/icon.png', to: '.' },
        { from: '../react-app/dist', to: 'react-app-dist' }
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
