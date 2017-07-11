window.wp = window.wp || {};

( function ( $ ) {

	wp.sanitize = {

			/**
			 * Strip HTML tags.
			 *
			 * @param string string Text to have the HTML tags striped out of.
			 * @return Stripped text.
			 */
			stripTags: function( string ) {
				string = string || '';

				return string
					.replace( /<!--[\s\S]*?(-->|$)/g, '' )
					.replace( /<(script|style)[^>]*>[\s\S]*?(<\/\1>|$)/ig, '' )
					.replace( /<\/?[a-z][\s\S]*?(>|$)/ig, '' );
			},

			/**
			 * Strip HTML tags and convert HTML entities.
			 *
			 * @param text string Text.
			 * @return Sanitized text.
			 */
			sanitizeText: function( text ) {
				var _text = wp.utils.stripTags( text ),
					textarea = document.createElement( 'textarea' );

				try {
					textarea.innerHTML = _text;
					_text = wp.utils.stripTags( textarea.value );
				} catch ( er ) {}

				return _text;
			}
	};

}( jQuery ) );
