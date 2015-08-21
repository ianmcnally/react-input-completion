// Webpack is used for only local development
// Babel is used for publishing to NPM (since it doesn't include dependencies)

var PATHS = {
  OUTPUT : './dist',
  SOURCE : './demo'
};

module.exports = {
  entry: PATHS.SOURCE + '/demo.jsx',
  output: {
    path: PATHS.OUTPUT,
    filename: 'input-completion-demo.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css'
      }
    ]
  }
};