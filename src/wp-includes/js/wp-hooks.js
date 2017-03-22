( function( window, undefined ) {
	'use strict';

	/**
	 * Handles managing all events for whatever you plug it into. Priorities for hooks are based on lowest to highest in
	 * that, lowest priority hooks are fired first.
	 */
	var EventManager = function() {
		var slice = Array.prototype.slice;

		/**
		 * Maintain a reference to the object scope so our public methods never get confusing.
		 */
		var MethodsAvailable;

		/**
		 * Contains the hooks that get registered with this EventManager. The array for storage utilizes a "flat"
		 * object literal such that looking up the hook utilizes the native object literal hash.
		 */
		var STORAGE = {
			actions : {},
			filters : {}
		};

		/**
		 * Adds an action to the event manager.
		 *
		 * @param {string}   action         The action to perform.
		 * @param {Function} callback       Must be a valid callback function before this action is added
		 * @param {number}   [priority=10]  Controls when the function is executed in relation to other callbacks bound
		 *                                  to the same hook. Optional, defaults to 10.
		 * @param {Object}   [context=this] The context to bind when executing the callback.Optionsl, defaults to `this`.
		 */
		function addAction( action, callback, priority, context ) {
			if ( typeof action === 'string' && typeof callback === 'function' ) {
				priority = parseInt( ( priority || 10 ), 10 );
				_addHook( 'actions', action, callback, priority, context || this );
			}

			return MethodsAvailable;
		}

		/**
		 * Performs an action if it exists. You can pass as many arguments as you want to this function.
		 * The only rule is that the first argument must always be the action.
		 *
		 * @param {string} action The action to perform.
		 * @param {...*}   args   Optional args to pass to the action.
		 */
		function doAction( /* action, arg1, arg2, ... */ ) {
			var args = slice.call( arguments );
			var action = args.shift();

			if ( typeof action === 'string' ) {
				_runHook( 'actions', action, args );
			}

			return MethodsAvailable;
		}

		/**
		 * Removes the specified action if it exists.
		 *
		 * @param {string}   action     The action to remove.
		 * @param {Function} [callback] Callback function to remove. Optional.
		 */
		function removeAction( action, callback ) {
			if ( typeof action === 'string' ) {
				_removeHook( 'actions', action, callback );
			}

			return MethodsAvailable;
		}

		/**
		 * Adds a filter to the event manager.
		 *
		 * @param {string} filter     The filter to add.
		 * @param {Function} callback The function to call with this filter.
		 * @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
		 * @param [context] Supply a value to be used for this
		 */
		function addFilter( filter, callback, priority, context ) {
			if ( typeof filter === 'string' && typeof callback === 'function' ) {
				priority = parseInt( ( priority || 10 ), 10 );
				_addHook( 'filters', filter, callback, priority, context );
			}

			return MethodsAvailable;
		}

		/**
		 * Performs a filter if it exists. You should only ever pass 1 argument to be filtered.
		 * The only rule is that the first argument must always be the filter.
		 *
		 * @param {string} action The action to perform.
		 * @param {...*}   args   Optional args to pass to the action.
		 */
		function applyFilters( /* filter, filtered arg, arg2, ... */ ) {
			var args = slice.call( arguments );
			var filter = args.shift();

			if ( typeof filter === 'string' ) {
				return _runHook( 'filters', filter, args );
			}

			return MethodsAvailable;
		}

		/**
		 * Removes the specified filter if it contains a namespace.identifier & exists.
		 *
		 * @param {string} filter The action to remove.
		 * @param [callback]      Callback function to remove. Optional.
		 */
		function removeFilter( filter, callback ) {
			if ( typeof filter === 'string') {
				_removeHook( 'filters', filter, callback );
			}

			return MethodsAvailable;
		}

		/**
		 * Removes the specified hook by resetting the value of it.
		 *
		 * @param {string} type      Type of hook, either 'actions' or 'filters'.
		 * @param {string} hook      The hook (namespace.identifier) to remove.
		 * @param {object} [context] Only hooks matching this context will be remved. Optional.
		 * @private
		 */
		function _removeHook( type, hook, callback, context ) {
			var handlers, handler, i;

			if ( !STORAGE[ type ][ hook ] ) {
				return;
			}
			if ( !callback ) {
				STORAGE[ type ][ hook ] = [];
			} else {
				handlers = STORAGE[ type ][ hook ];
				if ( !context ) {
					for ( i = handlers.length; i--; ) {
						if ( handlers[i].callback === callback ) {
							handlers.splice( i, 1 );
						}
					}
				}
				else {
					for ( i = handlers.length; i--; ) {
						handler = handlers[i];
						if ( handler.callback === callback && handler.context === context) {
							handlers.splice( i, 1 );
						}
					}
				}
			}
		}


		/**
		 * Adds the hook to the appropriate storage container
		 *
		 * @param {string}   type      The hook type: 'actions' or 'filters'
		 * @param {string}   hook      The hook (namespace.identifier) to add to our event manager
		 * @param {function} callback  The function that will be called when the hook is executed.
		 * @param {number}   priority  The priority of this hook. Must be an integer.
		 * @param {mixed}    [context] A value to be used for `this`. Optional.
		 * @private
		 */
		function _addHook( type, hook, callback, priority, context ) {
			var hookObject = {
				callback : callback,
				priority : priority,
				context : context
			};

			// Utilize 'prop itself' : http://jsperf.com/hasownproperty-vs-in-vs-undefined/19
			var hooks = STORAGE[ type ][ hook ];
			if ( hooks ) {
				hooks.push( hookObject );
				hooks = _hookInsertSort( hooks );
			}
			else {
				hooks = [ hookObject ];
			}

			STORAGE[ type ][ hook ] = hooks;
		}

		/**
		 * Use an insert sort for keeping our hooks organized based on priority.
		 * This function is ridiculously faster than bubble sort, etc: http://jsperf.com/javascript-sort
		 *
		 * @param {array} hooks The custom array containing all of the appropriate hooks to perform an insert sort on.
		 * @private
		 */
		function _hookInsertSort( hooks ) {
			var tmpHook, j, prevHook;
			for( var i = 1, len = hooks.length; i < len; i++ ) {
				tmpHook = hooks[ i ];
				j = i;
				while( ( prevHook = hooks[ j - 1 ] ) &&  prevHook.priority > tmpHook.priority ) {
					hooks[ j ] = hooks[ j - 1 ];
					--j;
				}
				hooks[ j ] = tmpHook;
			}

			return hooks;
		}

		/**
		 * Runs the specified hook. If it is an action, the value is not modified but if it is a filter, it is.
		 *
		 * @param {string} type 'actions' or 'filters'
		 * @param {string} hook The hook to run.
		 * @param {...*}   args Arguments to pass to the action/filter.
		 * @private
		 */
		function _runHook( type, hook, args ) {
			var handlers = STORAGE[ type ][ hook ], i, len;

			if ( ! handlers ) {
				return ( type === 'filters' ) ? args[0] : false;
			}

			len = handlers.length;
			if ( type === 'filters' ) {
				for ( i = 0; i < len; i++ ) {
					args[ 0 ] = handlers[ i ].callback.apply( handlers[ i ].context, args );
				}
			} else {
				for ( i = 0; i < len; i++ ) {
					handlers[ i ].callback.apply( handlers[ i ].context, args );
				}
			}

			return ( type === 'filters' ) ? args[ 0 ] : true;
		}

		MethodsAvailable = {
			removeFilter : removeFilter,
			applyFilters : applyFilters,
			addFilter : addFilter,
			removeAction : removeAction,
			doAction : doAction,
			addAction : addAction
		};

		// return all of the publicly available methods
		return MethodsAvailable;

	};

	window.wp = window.wp || {};
	window.wp.hooks = new EventManager();


} )( window );
