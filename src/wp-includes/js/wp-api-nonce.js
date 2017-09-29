jQuery( function ($) {

	// Send the current core `wp_rest` nonce with each heartbeat.
	$( document ).on( 'heartbeat-send', function ( e, data ) {
		data['wp-refresh-rest-nonce'] = wp.api.endpoints.at(0).get( 'nonce' );
	});

	// If a new nonce is returned with the heartbeat, update the core nonce.
	$( document ).on( 'heartbeat-tick', function ( e, data ) {
		if ( 'wp-refresh-rest-nonce' in data ) {
			wp.api.endpoints.at(0).set( 'nonce', data['wp-refresh-rest-nonce'] );
		}
	});
});
