var path         = require( 'path' ),
	SOURCE_DIR   = 'src/',
	mediaConfig  = {},
	mediaBuilds  = [ 'audiovideo', 'grid', 'models', 'views' ],
	webpack      = require( 'webpack' );


mediaBuilds.forEach( function ( build ) {
	var path = SOURCE_DIR + 'wp-includes/js/media';
	mediaConfig[ build ] = './' + path + '/' + build + '.manifest.js';
} );

const codeMirrorLinters = [
	'csslint',
	'jshint',
	'jsonlint',
	'htmlhint'
];

var externals = [];
codeMirrorLinters.forEach( entryPointName => {
	externals[ entryPointName ] = {
		this: [ 'wp', entryPointName ],
	};
} );

const lintersConfig = {
	cache: true,
	entry: codeMirrorLinters.reduce( ( memo, entryPointName ) => {
		memo[ entryPointName ] = './src/wp-includes/js/codemirror/manifests/' + entryPointName + '.manifest.js';
		return memo;
	}, {} ),
	output: {
		filename: './src/wp-includes/js/codemirror/[name].js',
		path: __dirname,
		library: [ 'wp', '[name]' ],
		libraryTarget: 'this',
	},
	watch: true,
	node: {
		fs: 'empty'
	}
}

module.exports = [

	// Media builds.
	{
		cache: true,
		watch: true,
		entry: mediaConfig,
		output: {
			path: path.join( __dirname, 'src/wp-includes/js' ),
			filename: 'media-[name].js'
		}
	},

	// Codemirror build.
	{
		cache: true,
		entry: './src/wp-includes/js/codemirror/manifests/codemirror.manifest.js',
		output: {
			path: path.join( __dirname, 'src/wp-includes/js/codemirror' ),
			filename: 'codemirror.js'
		},
		node: {
			fs: 'empty'
		}
	},

	// Linters Build.
	lintersConfig
];
