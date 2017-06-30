var path         = require('path'),
	fs           = require( 'fs' ),
	SOURCE_DIR   = 'src/',
	BUILD_DIR    = 'build/',
	autoprefixer = require('autoprefixer'),
	mediaConfig  = {},
	mediaBuilds  = ['audiovideo', 'grid', 'models', 'views'];


mediaBuilds.forEach( function ( build ) {
	var path = SOURCE_DIR + 'wp-includes/js/media';
	mediaConfig[ build ] = './' + path + '/' + build + '.manifest.js';
} );


console.log( mediaConfig );

module.exports = {
	entry: mediaConfig,
	output: {
		path:     path.join( __dirname, 'build' ),
		filename: '[name].js'
	},

	cache: true,

}
