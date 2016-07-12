const path = require('path');

const webpack = require('webpack');

const BUILD_DIR  = path.join(__dirname, 'dist');
const APP_DIR    = path.join(__dirname, 'app');
const VENDOR_DIR = path.join(__dirname, 'vendor');

module.exports = {
    debug   : true,
    devtool : 'eval',
    entry   : [
        'webpack-dev-server/client?/',
        'webpack/hot/only-dev-server',
        path.join(APP_DIR, 'index.js'),
    ],
    resolve : {
        extensions : ['', '.js', '.jsx'],
    },
    module : {
        loaders : [{
            test    : /\.jsx?/,
            include : [APP_DIR, VENDOR_DIR],
            loaders : ['react-hot', 'babel'],
        }],
    },
    plugins : [
        new webpack.HotModuleReplacementPlugin(),
    ],
    output : {
        path       : BUILD_DIR,
        publicPath : '/public/',
        filename   : 'bundle.js',
    },
};
