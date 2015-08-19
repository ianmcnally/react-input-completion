var PATHS = {
  OUTPUT : './dist',
  SOURCE : './src'
};
var LOADERS = {
  JS : 'babel-loader'
}

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
        loader: LOADERS.JS
      }
    ]
  }
};