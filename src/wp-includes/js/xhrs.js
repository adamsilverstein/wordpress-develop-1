( function() {
	var wp = window.wp || {};

	/**
	 * Track XHR requests in progress.
	 */
	wp.xhrs = function() {
		xhrs: {},

		// Clear all tracked xhrs.
		clear: function() {

			// Clear all finished AJAX requests from xhrs object.
			if ( 'undefined' !== typeof this.xhrs ) {
				for ( var key in this.xhrs ) {
					if ( 4 === this.xhrs[ key ].readyState ) {
						delete this.xhrs[ key ];
					}
				}
			}

		},

		// Does the element in question have a request in progress?
		inProgress: function( element ) {
			return (
				this.xhrs &&
				'undefined' !== typeof this.xhrs[ element ] &&
				4 !== this.xhrs[ element ].readyState
			);
		},

		// Set up xhr record for an element.
		setXhrs: function( element, xhr ) {
			this.xhrs[ element ] = xhr;
		}
	}
} ) ();
