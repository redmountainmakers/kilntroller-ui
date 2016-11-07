const webpack          = require( 'webpack' );
const WebpackDevServer = require( 'webpack-dev-server' );

const webpackConfig = require( './webpack.config' );
const config        = require( './config' );

new WebpackDevServer( webpack( webpackConfig ), {
	publicPath         : webpackConfig.output.publicPath,
	hot                : true,
	historyApiFallback : true,
	stats              : { chunkModules : false },
} ).listen( config.port, err => {
	if ( err ) {
		throw err;
	} else {
		console.log( 'Listening on :%d', config.port );
	}
} );
