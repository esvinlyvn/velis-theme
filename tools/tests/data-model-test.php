<?php
// php tools/tests/data-model-test.php — velis-data: inheritance, apartment-line cleaning (numbers, anchors, type), price text, minimum-data rule.
define( 'ABSPATH', __DIR__ );
const VELIS_CPT_PROJECT = 'du-an';
const VELIS_CPT_DEVELOPER = 'chu-dau-tu';
$GLOBALS['posts'] = array( 10 => (object) array( 'ID' => 10, 'post_parent' => 0 ), 11 => (object) array( 'ID' => 11, 'post_parent' => 10 ) );
$GLOBALS['meta']  = array( 10 => array( 'velis_address' => 'Xã Xuân Thới Sơn', 'velis_developers' => array( 5 ), 'velis_handover' => '2028' ), 11 => array( 'velis_address' => '', 'velis_handover' => '' ) );
function get_post( $p ) { return is_object( $p ) ? $p : $GLOBALS['posts'][ $p ]; }
function get_post_meta( $id, $k ) { return $GLOBALS['meta'][ $id ][ $k ] ?? ''; }
function sanitize_text_field( $s ) { return trim( strip_tags( $s ) ); }
function sanitize_textarea_field( $s ) { return trim( strip_tags( $s ) ); }
function sanitize_title( $s ) { $s = strtr( mb_strtolower( $s ), array( 'ă' => 'a', 'ế' => 'e', 'ố' => 'o', 'ố' => 'o', 'ộ' => 'o', 'đ' => 'd', 'ă' => 'a' ) ); return trim( preg_replace( '/[^a-z0-9]+/', '-', $s ), '-' ); }
function esc_url_raw( $s ) { return $s; }
function absint( $v ) { return abs( (int) $v ); }
function has_post_thumbnail( $p ) { return false; }
require __DIR__ . '/../../plugins/velis-data/inc/fields.php';
$check = function ( $ok, $msg ) { if ( ! $ok ) { fwrite( STDERR, "FAIL: $msg\n" ); exit( 1 ); } };

$check( 'Xã Xuân Thới Sơn' === velis_project_field( 11, 'velis_address' ), 'phân khu inherits address' );
$check( array( 5 ) === velis_project_field( 11, 'velis_developers' ), 'phân khu inherits developers' );
$check( '' === velis_project_field( 11, 'velis_handover' ), 'handover is not inherited' );
$GLOBALS['meta'][11]['velis_address'] = 'Riêng';
$check( 'Riêng' === velis_project_field( 11, 'velis_address' ), 'own value wins over parent' );

$lines = velis_clean_lines( array(
	array( 'name' => 'Căn 1 PN / Căn 1 PN', 'net_from' => '75,8', 'qty' => 'abc', 'price_month' => '2026-13' ),
	array( 'name' => '', 'beds' => '' ),                      // empty row dropped
	array( 'name' => 'Căn 1 PN', 'anchor' => '' ),            // same anchor → suffixed
	array( 'name' => 'Shophouse khối đế Persa Place' ),
), 'persa-place' );
$check( 3 === count( $lines ), 'empty rows are dropped' );
$check( '75.8' === $lines[0]['net_from'], 'decimal comma accepted for numbers' );
$check( '' === $lines[0]['qty'], 'non-numeric number cleared' );
$check( '' === $lines[0]['price_month'], 'invalid month cleared' );
$check( 'can-1pn' === $lines[0]['anchor'], 'anchor without repeated words: ' . $lines[0]['anchor'] );
$check( 'can-1pn-2' === $lines[1]['anchor'], 'duplicate anchor suffixed' );
$check( 'can-1pn-plus' === velis_line_anchor( 'Căn 1 PN+' ), '"+" kept apart: ' . velis_line_anchor( 'Căn 1 PN+' ) );
$check( 'shophouse-khoi-de' === $lines[2]['anchor'], 'anchor drops page name words: ' . $lines[2]['anchor'] );
$check( 'can-ho' === $lines[0]['type'] && 'shophouse' === $lines[2]['type'], 'type guessed from name' );
$check( 'nha-pho' === velis_guess_type( 'Nhà phố liền kề' ) && 'can-ho' === velis_guess_type( 'Penthouse' ), 'guess low/high rise' );
$check( array( 3, 7 ) === velis_clean( 'posts', array( '3', 'x', '7' ) ), 'id lists cleaned' );
$check( '' === velis_clean( 'date', '04/11/2026' ), 'only ISO dates' );
$check( '6,9–7,2 tỷ/căn (tháng 4/2026)' === velis_price_text( '6.9', '7.2', 'ty-can', '2026-04' ), 'price text: ' . velis_price_text( '6.9', '7.2', 'ty-can', '2026-04' ) );
$check( 'từ 125 triệu/m²' === velis_price_text( '125', '', 'trieu-m2' ), 'price from only' );
$check( '' === velis_price_text( '', '', 'ty-can', '2026-04' ), 'no price → empty' );
$check( '1.250' === velis_num( 1250 ) && '41,3' === velis_num( '41.3' ), 'Vietnamese numbers' );
$check( 'Căn 2 PN · 71–85 m² · từ 9,3 tỷ/căn' === velis_line_summary( array( 'name' => 'Căn 2 PN', 'gross_from' => '71', 'gross_to' => '85', 'price_from' => '9.3', 'price_unit' => 'ty-can' ) ), 'summary' );

// Minimum data → noindex (phân khu / dòng thấp tầng only).
$GLOBALS['meta'][10]['velis_level'] = 'dai-do-thi';
$GLOBALS['meta'][11]['velis_level'] = 'phan-khu';
$check( array() === velis_missing( 10 ), 'đại đô thị never noindex' );
$check( array( 'ảnh', 'thông số cơ bản' ) === velis_missing( 11 ), 'phân khu missing image + specs (location inherited)' );
$GLOBALS['posts'][12] = (object) array( 'ID' => 12, 'post_parent' => 11 );
$GLOBALS['meta'][12]  = array( 'velis_level' => 'thap-tang', 'velis_land_area' => '100', 'velis_gallery' => array( 9 ) );
$check( array() === velis_missing( 12 ), 'dòng thấp tầng complete; address inherited through phân khu' );
echo "data model: all checks passed\n";
