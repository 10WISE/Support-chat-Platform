const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  watch: true,
  mode: 'development',
  entry: {
    index: './src/index.tsx',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../js/clientApp/'),
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      index: path.resolve(__dirname, 'src/index.tsx'),
      components: path.resolve(__dirname, 'src/components'),
      slices: path.resolve(__dirname, 'src/slices'),
      Connect: path.resolve(__dirname, 'src/Connect'),
      ConnectHub: path.resolve(__dirname, 'src/ConnectHub'),
      utils: path.resolve(__dirname, 'src/utils'),
      views: path.resolve(__dirname, 'src/views'),
      assets: path.resolve(__dirname, 'src/assets'),
      api: path.resolve(__dirname, 'src/api'),
      mixins: path.resolve(__dirname, 'src/mixins'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styleHADS.css',
    }),
    new webpack.DefinePlugin({
      CONNECT_HUB_SIGNALR_URL: JSON.stringify(
        'http://localhost:43801/'
      ),
      CONNECT_HUB_URL: JSON.stringify('http://localhost:43801'),
      HADS_URL: JSON.stringify('http://localhost:59284/'),
      TOOLS_URL: JSON.stringify('')
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
};
