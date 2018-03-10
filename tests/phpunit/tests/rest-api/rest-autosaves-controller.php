<?php
/**
 * Unit tests covering WP_REST_Autosaves_Controller functionality.
 *
 * @package WordPress
 * @subpackage REST API
 */

/**
 * @group restapi-autosaves
 * @group restapi
 */
class WP_Test_REST_Autosaves_Controller extends WP_Test_REST_Controller_Testcase {
	protected static $post_id;
	protected static $page_id;

	protected static $autosave_post_id;
	protected static $autosave_page_id;

	protected static $editor_id;
	protected static $contributor_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$post_id = $factory->post->create();
		self::$page_id = $factory->post->create( array( 'post_type' => 'page' ) );

		self::$editor_id      = $factory->user->create(
			array(
				'role' => 'editor',
			)
		);
		self::$contributor_id = $factory->user->create(
			array(
				'role' => 'contributor',
			)
		);

		wp_set_current_user( self::$editor_id );

		// Create an autosave.
		self::$autosave_post_id = wp_create_post_autosave(
			array(
				'post_content' => 'This content is better.',
				'post_ID'      => self::$post_id,
				'post_type'    => 'post',
			)
		);

		self::$autosave_page_id = wp_create_post_autosave(
			array(
				'post_content' => 'This content is better.',
				'post_ID'      => self::$page_id,
				'post_type'    => 'post',
			)
		);

	}

	public static function wpTearDownAfterClass() {
		// Also deletes revisions.
		wp_delete_post( self::$post_id, true );
		wp_delete_post( self::$page_id, true );

		self::delete_user( self::$editor_id );
		self::delete_user( self::$contributor_id );
	}

	public function setUp() {
		parent::setUp();
		wp_set_current_user( self::$editor_id );

		$this->post_autosave = wp_get_post_autosave( self::$post_id );
	}

	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();
		$this->assertArrayHasKey( '/wp/v2/posts/(?P<parent>[\d]+)/autosaves', $routes );
		$this->assertArrayHasKey( '/wp/v2/posts/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)', $routes );
		$this->assertArrayHasKey( '/wp/v2/pages/(?P<parent>[\d]+)/autosaves', $routes );
		$this->assertArrayHasKey( '/wp/v2/pages/(?P<parent>[\d]+)/autosaves/(?P<id>[\d]+)', $routes );
	}

	public function test_context_param() {
		// Collection
		$request  = new WP_REST_Request( 'OPTIONS', '/wp/v2/posts/' . self::$post_id . '/autosaves' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertEquals( 'view', $data['endpoints'][0]['args']['context']['default'] );
		$this->assertEqualSets( array( 'view', 'edit', 'embed' ), $data['endpoints'][0]['args']['context']['enum'] );
		// Single
		$request  = new WP_REST_Request( 'OPTIONS', '/wp/v2/posts/' . self::$post_id . '/autosaves/' . self::$autosave_post_id );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertEquals( 'view', $data['endpoints'][0]['args']['context']['default'] );
		$this->assertEqualSets( array( 'view', 'edit', 'embed' ), $data['endpoints'][0]['args']['context']['enum'] );	}

	public function test_get_items() {
		wp_set_current_user( self::$editor_id );
		$request  = new WP_REST_Request( 'GET', '/wp/v2/posts/' . self::$post_id . '/autosaves' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertEquals( 200, $response->get_status() );
		$this->assertCount( 1, $data );

		$this->assertEquals( self::$autosave_post_id, $data[0]['id'] );

		$this->check_get_autosave_response( $data[0], $this->post_autosave );
	}

	public function test_get_items_no_permission() {

	}

	public function test_get_items_missing_parent() {

	}

	public function test_get_items_invalid_parent_post_type() {

	}

	public function test_get_item() {

	}

	public function test_get_item_embed_context() {

	}

	public function test_get_item_no_permission() {

	}

	public function test_get_item_missing_parent() {

	}

	public function test_get_item_invalid_parent_post_type() {

	}

	public function test_delete_item() {

	}

	public function test_delete_item_no_trash() {

	}

	public function test_delete_item_no_permission() {

	}

	public function test_prepare_item() {

	}

	public function test_get_item_schema() {
		$request    = new WP_REST_Request( 'OPTIONS', '/wp/v2/posts/' . self::$post_id . '/autosaves' );
		$response   = rest_get_server()->dispatch( $request );
		$data       = $response->get_data();
		$properties = $data['schema']['properties'];
		$this->assertEquals( 12, count( $properties ) );
		$this->assertArrayHasKey( 'author', $properties );
		$this->assertArrayHasKey( 'content', $properties );
		$this->assertArrayHasKey( 'date', $properties );
		$this->assertArrayHasKey( 'date_gmt', $properties );
		$this->assertArrayHasKey( 'excerpt', $properties );
		$this->assertArrayHasKey( 'guid', $properties );
		$this->assertArrayHasKey( 'id', $properties );
		$this->assertArrayHasKey( 'modified', $properties );
		$this->assertArrayHasKey( 'modified_gmt', $properties );
		$this->assertArrayHasKey( 'parent', $properties );
		$this->assertArrayHasKey( 'slug', $properties );
		$this->assertArrayHasKey( 'title', $properties );
	}

	public function test_create_item() {

	}

	public function test_update_item() {

	}

	public function test_get_additional_field_registration() {

	}

	public function additional_field_get_callback( $object ) {
	}

	public function additional_field_update_callback( $value, $post ) {
	}

	protected function check_get_autosave_response( $response, $autosave ) {
		if ( $response instanceof WP_REST_Response ) {
			$links    = $response->get_links();
			$response = $response->get_data();
		} else {
			$this->assertArrayHasKey( '_links', $response );
			$links = $response['_links'];
		}

		$this->assertEquals( $autosave->post_author, $response['author'] );

		$rendered_content = apply_filters( 'the_content', $autosave->post_content );
		$this->assertEquals( $rendered_content, $response['content']['rendered'] );

		$this->assertEquals( mysql_to_rfc3339( $autosave->post_date ), $response['date'] );
		$this->assertEquals( mysql_to_rfc3339( $autosave->post_date_gmt ), $response['date_gmt'] );

		$rendered_guid = apply_filters( 'get_the_guid', $autosave->guid, $autosave->ID );
		$this->assertEquals( $rendered_guid, $response['guid']['rendered'] );

		$this->assertEquals( $autosave->ID, $response['id'] );
		$this->assertEquals( mysql_to_rfc3339( $autosave->post_modified ), $response['modified'] );
		$this->assertEquals( mysql_to_rfc3339( $autosave->post_modified_gmt ), $response['modified_gmt'] );
		$this->assertEquals( $autosave->post_name, $response['slug'] );

		$rendered_title = get_the_title( $autosave->ID );
		$this->assertEquals( $rendered_title, $response['title']['rendered'] );

		$parent            = get_post( $autosave->post_parent );
		$parent_controller = new WP_REST_Posts_Controller( $parent->post_type );
		$parent_object     = get_post_type_object( $parent->post_type );
		$parent_base       = ! empty( $parent_object->rest_base ) ? $parent_object->rest_base : $parent_object->name;
		$this->assertEquals( rest_url( '/wp/v2/' . $parent_base . '/' . $autosave->post_parent ), $links['parent'][0]['href'] );
	}

	public function test_get_item_sets_up_postdata() {
	}

}
