jQuery( function ($) {
	$( document ).on( 'heartbeat-send', function ( e, data ) {
		data['wp-refresh-rest-nonce'] = wpApiSettings.nonce;
	});
	$( document ).on( 'heartbeat-tick', function ( e, data ) {
		if ( 'wp-refresh-rest-nonce' in data ) {
			wpApiSettings.nonce = data['wp-refresh-rest-nonce'];
		}
	});
});
