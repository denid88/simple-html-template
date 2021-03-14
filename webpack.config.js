const path = require('path')
const cssnano = require('cssnano')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { TypedCssModulesPlugin } = require('typed-css-modules-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: [
    './js/main.js',
    './scss/main.scss'
  ],
  output: {
    filename: 'js/[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: path.resolve('./src/index.html'),
      cache: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new TypedCssModulesPlugin({
        globPattern: 'src/**/*.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './images/',
          to: './images/',
        },
        {
          from: './libs/',
          to: './libs/',
        },
      ]
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    watchContentBase: true,
    historyApiFallback: true,
    hot: true,
    open: true,
    inline: true,
    port: process.env.PORT || 9000,
    host: process.env.HOST || 'localhost',
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
					'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
			{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          outputPath: 'images/'
        }
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  }
}