const defaultConfig = {
	port : 3000,
};

let localConfig = {};
try {
	localConfig = require( './local.json' );
} catch ( err ) {}

localConfig = Object.assign( {}, defaultConfig, localConfig );

module.exports = localConfig;
