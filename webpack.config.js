const path = require('path');

const webpack               = require('webpack');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');

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
			'process.env.NODE_ENV' : JSON.stringify(env),
		}),
		new webpack.IgnorePlugin(/\.\/locale$/, /moment$/),
	],
	stats : {
		children : false,
	},
};

if (process.env.NODE_ENV === 'production') {
	config.plugins.unshift(
		new webpack.LoaderOptionsPlugin({
			minimize : true,
			debug    : false,
		}),
		new ClosureCompilerPlugin({
			compiler : {
				compilation_level          : 'ADVANCED',
				use_types_for_optimization : false,
			},
		}),
		new ExtractTextPlugin('style.css'),
		new webpack.NormalModuleReplacementPlugin(
			/^debug$/,
			path.join(__dirname, 'app', 'lib', 'debug-noop')
		)
	);
	config.module.loaders.unshift({
		test    : /\.scss$/,
		include : [APP_DIR, VENDOR_DIR],
		loader  : ExtractTextPlugin.extract(['css', 'sass']),
	});
} else {
	config.devtool = 'eval';
	config.entry.unshift(
		'react-hot-loader/patch',
		'webpack-dev-server/client?/',
		'webpack/hot/only-dev-server'
	);
	config.module.loaders.unshift({
		test    : /\.scss$/,
		include : [APP_DIR, VENDOR_DIR],
		loaders : ['style', 'css', 'sass'],
	});
	config.plugins.unshift(
		new webpack.LoaderOptionsPlugin({
			minimize : false,
			debug    : true,
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin()
	);
}

module.exports = config;
