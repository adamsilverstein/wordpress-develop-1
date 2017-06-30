var path         = require('path'),
	SOURCE_DIR   = 'src/',
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
