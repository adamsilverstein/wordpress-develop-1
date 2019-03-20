<?php

/**
 * @group media
 * @group mediagrid
 */
class Tests_Media_Grid extends WP_UnitTestCase {

	/**
	 * Test that the media grid uses the correct available single media type.
	 * @ticket 43658
	 */
	function test_wp_enqueue_media_single_mime_type() {
		$filename      = DIR_TESTDATA . '/images/test-image.jpg';
		$contents      = file_get_contents( $filename );
		$upload        = wp_upload_bits( basename( $filename ), null, $contents );
		$attachment_id = $this->_make_attachment( $upload );

		add_filter(
			'media_view_settings',
			function( $settings ) {
				$this->assertEquals( array( 'image' ), array_keys( $settings['mimeTypes'] ) );
				return $settings;
			}
		);
		wp_enqueue_media();
		remove_all_filters( 'media_view_settings' );
	}

	/**
	 * Test that the media grid uses the correct available multiple media types.
	 * @ticket 43658
	 */
	function test_wp_enqueue_media_multiple_mime_types() {
		$filename      = DIR_TESTDATA . '/images/test-image.jpg';
		$contents      = file_get_contents( $filename );
		$upload        = wp_upload_bits( basename( $filename ), null, $contents );
		$attachment_id = $this->_make_attachment( $upload );

		$filename      = DIR_TESTDATA . '/uploads/small-audio.mp3';
		$contents      = file_get_contents( $filename );
		$upload        = wp_upload_bits( basename( $filename ), null, $contents );
		$attachment_id = $this->_make_attachment( $upload );

		add_filter(
			'media_view_settings',
			function( $settings ) {
				$this->assertEquals( array( 'image', 'audio' ), array_keys( $settings['mimeTypes'] ) );
				return $settings;
			}
		);
		wp_enqueue_media();
		remove_all_filters( 'media_view_settings' );
	}
}
