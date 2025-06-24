import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './server/server.js',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'dist-server'),
  },
  resolve: {
    extensions: ['.js'],
  },
  externals: {},
};
