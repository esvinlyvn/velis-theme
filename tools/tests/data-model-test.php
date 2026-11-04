<?php
// php tools/tests/data-model-test.php — velis-data: inheritance of phân khu fields and product-line cleaning.
define( 'ABSPATH', __DIR__ );
const VELIS_CPT_PROJECT = 'du-an';
const VELIS_CPT_DEVELOPER = 'chu-dau-tu';
$GLOBALS['posts'] = array( 10 => (object) array( 'ID' => 10, 'post_parent' => 0 ), 11 => (object) array( 'ID' => 11, 'post_parent' => 10 ) );
$GLOBALS['meta']  = array( 10 => array( 'velis_address' => 'Xã Xuân Thới Sơn', 'velis_developers' => array( 5 ), 'velis_handover' => '2028' ), 11 => array( 'velis_address' => '', 'velis_handover' => '' ) );
function get_post( $p ) { return is_object( $p ) ? $p : $GLOBALS['posts'][ $p ]; }
function get_post_meta( $id, $k ) { return $GLOBALS['meta'][ $id ][ $k ] ?? ''; }
function sanitize_text_field( $s ) { return trim( strip_tags( $s ) ); }
function sanitize_textarea_field( $s ) { return trim( strip_tags( $s ) ); }
function sanitize_title( $s ) { return strtolower( preg_replace( '/[^a-z0-9]+/i', '-', trim( $s ) ) ); }
function esc_url_raw( $s ) { return $s; }
function absint( $v ) { return abs( (int) $v ); }
require __DIR__ . '/../../plugins/velis-data/inc/fields.php';
$check = function ( $ok, $msg ) { if ( ! $ok ) { fwrite( STDERR, "FAIL: $msg\n" ); exit( 1 ); } };

$check( 'Xã Xuân Thới Sơn' === velis_project_field( 11, 'velis_address' ), 'phân khu inherits address' );
$check( array( 5 ) === velis_project_field( 11, 'velis_developers' ), 'phân khu inherits developers' );
$check( '' === velis_project_field( 11, 'velis_handover' ), 'handover is not inherited' );
$GLOBALS['meta'][11]['velis_address'] = 'Riêng';
$check( 'Riêng' === velis_project_field( 11, 'velis_address' ), 'own value wins over parent' );

$lines = velis_clean_lines( array(
	array( 'name' => '2 PN <b>x</b>', 'beds' => '2', 'net' => '75,8 m²', 'qty' => 'abc' ),
	array( 'name' => '', 'beds' => '' ),                      // empty row dropped
) );
$check( 1 === count( $lines ), 'empty rows are dropped' );
$check( '2 PN x' === $lines[0]['name'], 'text sanitized' );
$check( '' === $lines[0]['qty'], 'non-numeric number cleared' );
$check( '2-pn-x' === $lines[0]['anchor'], 'anchor defaults from name' );
$check( array( 3, 7 ) === velis_clean( 'posts', array( '3', 'x', '7' ) ), 'id lists cleaned' );
$check( '' === velis_clean( 'date', '04/11/2026' ), 'only ISO dates' );
echo "data model: all checks passed\n";
