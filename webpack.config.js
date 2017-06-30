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

module.exports = {
	entry: mediaConfig,
	output: {
		path:     path.join( __dirname, 'src/wp-includes/js' ),
		filename: 'media-[name].js'
	},

	cache: true,

}
