const path = require('path');

module.exports = {
  entry: './src/Rating.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'Rating.js',
    library: 'Rating',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};