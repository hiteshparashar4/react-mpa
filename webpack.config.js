const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    home: './src/pages/home/index.jsx',
    about: './src/pages/about/index.jsx',
    contact: './src/pages/contact/index.jsx'
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json']
  },
  optimization: {
    runtimeChunk: { name: 'runtime' },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor-react',
          enforce: true,
          priority: 30
        },
        sharedLibs: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor-shared',
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Home Page',
      filename: 'home.html',
      template: './src/templates/template.html',
      chunks: ['runtime', 'vendor-react', 'vendor-shared', 'home']
    }),
    new HtmlWebpackPlugin({
      title: 'About Page',
      filename: 'about.html',
      template: './src/templates/template.html',
      chunks: ['runtime', 'vendor-react', 'vendor-shared', 'about']
    }),
    new HtmlWebpackPlugin({
      title: 'Contact Page',
      filename: 'contact.html',
      template: './src/templates/template.html',
      chunks: ['runtime', 'vendor-react', 'vendor-shared', 'contact']
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/favicon.ico', to: 'favicon.ico' },
      ],
    }),
  ],
  devServer: {
    static: { directory: path.join(__dirname, 'dist') },
    port: 3000,
    open: true
  }
};
