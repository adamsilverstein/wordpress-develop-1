/* global wp */
( function( QUnit ) {
	QUnit.module( 'wp-hooks' );

	function filter_a( str ) {
		return str + 'a';
	}
	function filter_b( str ) {
		return str + 'b';
	}
	function filter_c( str ) {
		return str + 'c';
	}
	function action_a() {
		window.actionValue += 'a';
	}
	function action_b() {
		window.actionValue += 'b';
	}
	function action_c() {
		window.actionValue += 'c';
	}
	window.actionValue = '';

	QUnit.test( 'add and remove a filter', function() {
		expect( 1 );
		wp.hooks.addFilter( 'test.filter', filter_a );
		wp.hooks.removeFilter( 'test.filter' );
		equal( wp.hooks.applyFilters( 'test.filter', 'test' ), 'test' );
	} );

	QUnit.test( 'add a filter and run it', function() {
		expect( 1 );
		wp.hooks.addFilter( 'test.filter', filter_a );
		equal( wp.hooks.applyFilters( 'test.filter', 'test' ), 'testa' );
		wp.hooks.removeFilter( 'test.filter' );
	} );

	QUnit.test( 'add 2 filters in a row and run them', function() {
		expect( 1 );
		wp.hooks.addFilter( 'test.filter', filter_a );
		wp.hooks.addFilter( 'test.filter', filter_b );
		equal( wp.hooks.applyFilters( 'test.filter', 'test' ), 'testab' );
		wp.hooks.removeFilter( 'test.filter' );
	} );

	QUnit.test( 'add 3 filters with different priorities and run them', function() {
		expect( 1 );
		wp.hooks.addFilter( 'test.filter', filter_a );
		wp.hooks.addFilter( 'test.filter', filter_b, 2 );
		wp.hooks.addFilter( 'test.filter', filter_c, 8 );
		equal( wp.hooks.applyFilters( 'test.filter', 'test' ), 'testbca' );
		wp.hooks.removeFilter( 'test.filter' );
	} );

	QUnit.test( 'add and remove an action', function() {
		expect( 1 );
		window.actionValue = '';
		wp.hooks.addAction( 'test.action', action_a );
		wp.hooks.removeAction( 'test.action' );
		wp.hooks.doAction( 'test.action' );
		equal( window.actionValue, '' );
	} );

	QUnit.test( 'add an action and run it', function() {
		expect( 1 );
		window.actionValue = '';
		wp.hooks.addAction( 'test.action', action_a );
		wp.hooks.doAction( 'test.action' );
		equal( window.actionValue, 'a' );
		wp.hooks.removeAction( 'test.action' );
	} );

	QUnit.test( 'add 2 actions in a row and then run them', function() {
		expect( 1 );
		window.actionValue = '';
		wp.hooks.addAction( 'test.action', action_a );
		wp.hooks.addAction( 'test.action', action_b );
		wp.hooks.doAction( 'test.action' );
		equal( window.actionValue, 'ab' );
		wp.hooks.removeAction( 'test.action' );
	} );

	QUnit.test( 'add 3 actions with different priorities and run them', function() {
		expect( 1 );
		window.actionValue = '';
		wp.hooks.addAction( 'test.action', action_a );
		wp.hooks.addAction( 'test.action', action_b, 2 );
		wp.hooks.addAction( 'test.action', action_c, 8 );
		wp.hooks.doAction( 'test.action' );
		equal( window.actionValue, 'bca' );
		wp.hooks.removeAction( 'test.action' );
	} );

	QUnit.test( 'pass in two arguments to an action', function() {
		var arg1 = 10,
			arg2 = 20;

		expect( 4 );

		wp.hooks.addAction( 'test.action', function( a, b ) {
			equal( arg1, a );
			equal( arg2, b );
		} );
		wp.hooks.doAction( 'test.action', arg1, arg2 );
		wp.hooks.removeAction( 'test.action' );

		equal( arg1, 10 );
		equal( arg2, 20 );
	} );

	QUnit.test( 'fire action multiple times', function() {
		var func;
		expect( 2 );

		func = function() {
			ok( true );
		};

		wp.hooks.addAction( 'test.action', func );
		wp.hooks.doAction( 'test.action' );
		wp.hooks.doAction( 'test.action' );
		wp.hooks.removeAction( 'test.action' );
	} );

	QUnit.test( 'remove specific action callback', function() {
		window.actionValue = '';
		wp.hooks.addAction( 'test.action', action_a );
		wp.hooks.addAction( 'test.action', action_b, 2 );
		wp.hooks.addAction( 'test.action', action_c, 8 );

		wp.hooks.removeAction( 'test.action', action_b );
		wp.hooks.doAction( 'test.action' );
		equal( window.actionValue, 'ca' );
		wp.hooks.removeAction( 'test.action' );
	} );

	QUnit.test( 'remove specific filter callback', function() {
		wp.hooks.addFilter( 'test.filter', filter_a );
		wp.hooks.addFilter( 'test.filter', filter_b, 2 );
		wp.hooks.addFilter( 'test.filter', filter_c, 8 );

		wp.hooks.removeFilter( 'test.filter', filter_b );
		equal( wp.hooks.applyFilters( 'test.filter', 'test' ), 'testca' );
		wp.hooks.removeFilter( 'test.filter' );
	} );
} )( window.QUnit );
