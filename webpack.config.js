var PATHS = {
  OUTPUT : './dist',
  SOURCE : './src'
};

module.exports = {
  entry: PATHS.SOURCE + '/input-completion.jsx',
  output: {
    path: PATHS.OUTPUT,
    filename: 'react-input-completion.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};