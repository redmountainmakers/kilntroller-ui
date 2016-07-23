const path = require('path');

const webpack           = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const BUILD_DIR  = path.join(__dirname, 'dist');
const APP_DIR    = path.join(__dirname, 'app');
const VENDOR_DIR = path.join(__dirname, 'vendor');

const env = process.env.NODE_ENV || 'development';

const config = {
    entry : [
        path.join(APP_DIR, 'index.js'),
    ],
    resolve : {
        extensions : ['', '.js', '.jsx'],
    },
    module : {
        loaders : [
            {
                test    : /\.jsx?$/,
                include : [APP_DIR, VENDOR_DIR],
                loaders : ['babel'],
            },
        ],
    },
    output : {
        path       : BUILD_DIR,
        publicPath : '/public/',
        filename   : 'bundle.js',
    },
    plugins : [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env),
        }),
        new webpack.IgnorePlugin(/\.\/locale$/, /moment$/),
    ],
};

if (process.env.NODE_ENV === 'production') {
    // UglifyJs: http://stackoverflow.com/a/35462011
    config.plugins.unshift(
        new webpack.optimize.UglifyJsPlugin({
            compress : { warnings : false },
        }),
        new ExtractTextPlugin('style.css')
    );
    config.module.loaders.unshift({
        test    : /\.scss$/,
        include : [APP_DIR],
        loader  : ExtractTextPlugin.extract(['css', 'sass']),
    });
} else {
    config.debug   = true;
    config.devtool = 'eval';
    config.entry.unshift(
        'webpack-dev-server/client?/',
        'webpack/hot/only-dev-server'
    );
    config.module.loaders[0].loaders.unshift(
        'react-hot'
    );
    config.module.loaders.unshift({
        test    : /\.scss$/,
        include : [APP_DIR],
        loaders : ['style', 'css', 'sass'],
    });
    config.plugins.unshift(
        new webpack.HotModuleReplacementPlugin()
    );
}

module.exports = config;
