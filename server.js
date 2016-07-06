'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.config');
const config        = require('./config');

new WebpackDevServer(webpack(webpackConfig), {
    publicPath         : webpackConfig.output.publicPath,
    hot                : true,
    historyApiFallback : true
}).listen(config.port, function(err, result) {
    if (err) {
        throw err;
    } else {
        console.log('Listening on :%d', config.port);
    }
});
