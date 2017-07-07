<?php

/**
 * @group formatting
 * @ticket 38773
 */
class Tests_Formatting_HumanTimeDiff extends WP_UnitTestCase {

	/**
	 * @group formatting
	 * @ticket 38773
	 * @dataProvider data_test_human_time_diff
	 */
	function test_human_time_diff( $expected, $stopdate, $message ) {
		$startdate = new DateTime( '2016-01-01 12:00:00' );
		$this->assertEquals( $expected, human_time_diff( $startdate->getTimestamp(), $stopdate->getTimestamp() ), $message );
	}

	// Data for test_human_time_diff.
	function data_test_human_time_diff() {
		return array(
			array(
				'5 mins',
				new DateTime( '2016-01-01 12:05:00' ),
				'Test a difference of 5 minutes.',
			),
			array(
				'1 hour',
				new DateTime( '2016-01-01 13:00:00' ),
				'Test a difference of 1 hour.',
			),
			array(
				'2 days',
				new DateTime( '2016-01-03 12:00:00' ),
				'Test a difference of 2 days.',
			),
			array(
				'3 hours',
				new DateTime( '2016-01-01 14:30:01' ),
				'Test a difference of 2 hours and 30 minutes and 1 second - should round up to 3 hours.',
			),
			array(
				'2 months',
				new DateTime( '2016-02-17 12:00:00' ),
				'Test a difference of 1 month and 16 days - should round up to 2 months.',
			),
			array(
				'3 years',
				new DateTime( '2018-07-02 12:00:00' ),
				'Test a difference of 2 years 6 months and 1 day, should round up to 3 years.',
			),
		);
	}
}
