const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    server: './server/server.js'
  },
  target: 'node',
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'dist-server'),
    clean: true
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  optimization: {
    minimize: true,
  },
  externals: {},
};
