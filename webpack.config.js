var path = require("path");
var webpack = require("webpack");

var BUILD_DIR = path.join(__dirname, '/dist');
var APP_DIR = path.join(__dirname, '/static/js');

var config = {
  entry: APP_DIR + '/Index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?/,
      include: APP_DIR,
      loader: 'babel'
    }]
  },
  resolve: {
    modulesDirectories: ["web_modules", "node_modules", "bower_components"]
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    )
  ]
};

module.exports = config;
