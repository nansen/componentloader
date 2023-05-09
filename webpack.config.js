const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 3000,
    hot: true,
    // static: {
    //   directory: path.join(__dirname, '/'),
    // },
    watchFiles: [
      path.join(__dirname, '/src'),
      //path.join(__dirname, '/node_modules/@nansen/componentloader'),
    ],
  },
  target: ['web', 'es6'],
  plugins: [new HtmlWebpackPlugin({
    title: 'Custom template',
    template: 'index.html'
  })],
}
