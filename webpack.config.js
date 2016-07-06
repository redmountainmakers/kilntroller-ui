const path = require('path');

const webpack = require('webpack');

const BUILD_DIR = path.join(__dirname, 'dist');
const APP_DIR   = path.join(__dirname, 'static/js');

module.exports = {
    devtool : 'eval',
    entry   : [
        'webpack-dev-server/client?/',
        'webpack/hot/only-dev-server',
        path.join(APP_DIR, 'Index.jsx'),
    ],
    output : {
        path       : BUILD_DIR,
        publicPath : '/public/',
        filename   : 'bundle.js',
    },
    plugins : [
        new webpack.HotModuleReplacementPlugin()
    ],
    module : {
        loaders : [{
            test    : /\.jsx?/,
            include : APP_DIR,
            loaders : ['react-hot', 'babel'],
        }]
    },
    debug : true,
};
