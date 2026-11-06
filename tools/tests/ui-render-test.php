<?php
// php tools/tests/ui-render-test.php — renders the components of theme/velis/inc/ui.php with WordPress + data-layer stubs:
// catches run-time fatals and checks the mockup markup (class names), the image rules (X-03 marks, F-B focus, NT-23 named
// frame, X-02 hero A/B by file width) and X-01 sizes.
define( 'ABSPATH', __DIR__ );
const VELIS_PHONE = '0911 237 979'; const VELIS_PHONE_TEL = '0911237979'; const VELIS_ZALO = 'https://zalo.me/0911237979'; const VELIS_EMAIL = 'lienhe@velisrealty.vn'; const VELIS_ADDRESS = '34 Lương Định Của'; const VELIS_HOURS = 'Thứ 2 – Chủ nhật'; // = inc/data.php
$GLOBALS['meta'] = array( 10 => array( 'velis_mark' => 'cat' ), 11 => array(), 12 => array( 'velis_mark' => 'khong-che' ), 13 => array( 'velis_focus' => 'phai-tren' ) );
$GLOBALS['dims'] = array( 10 => array( 2400, 1350 ), 11 => array( 1200, 800 ), 12 => array( 1600, 900 ), 13 => array( 1000, 1000 ) );
function esc_html( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES ); }
function esc_attr( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES ); }
function esc_url( $s ) { return (string) $s; }
function wp_strip_all_tags( $s ) { return strip_tags( (string) $s ); }
function sanitize_title( $s ) { return strtolower( preg_replace( '/\W+/', '-', (string) $s ) ); }
function sanitize_key( $s ) { return strtolower( preg_replace( '/[^a-z0-9_\-]/i', '', (string) $s ) ); }
function wp_unslash( $s ) { return $s; }
function get_post_meta( $id, $k, $single = true ) { return $GLOBALS['meta'][ is_object( $id ) ? $id->ID : $id ][ $k ] ?? ''; }
function get_term_meta( $id, $k, $s = true ) { return ''; }
function wp_get_attachment_metadata( $id ) { $d = $GLOBALS['dims'][ $id ] ?? array( 1200, 800 ); return array( 'width' => $d[0], 'height' => $d[1] ); }
function wp_get_attachment_image( $id, $size, $icon = false, $attr = array() ) {
	return '<img src="/f' . $id . '.webp"' . implode( '', array_map( fn( $k, $v ) => ' ' . $k . '="' . esc_attr( $v ) . '"', array_keys( $attr ), $attr ) ) . '>';
}
function wp_get_attachment_image_url( $id, $s = '' ) { return '/f' . $id . '-1024.webp'; }
function get_attached_file( $id ) { return '/f' . $id . '.webp'; }
function wp_get_attachment_caption( $id ) { return ''; }
function get_post( $p ) { return is_object( $p ) ? $p : (object) array( 'ID' => (int) $p, 'post_title' => 'Dự án ' . $p, 'post_name' => 'du-an-' . $p, 'post_parent' => 0, 'post_excerpt' => '', 'post_author' => 1, 'post_status' => 'publish' ); }
function get_permalink( $p ) { return '/du-an/' . get_post( $p )->post_name . '/'; }
function wp_list_pluck( $l, $f ) { return array_map( fn( $x ) => is_object( $x ) ? $x->$f : $x[ $f ], $l ); }
function get_theme_file_uri( $f ) { return '/theme/' . $f; }
function wp_unique_id( $p = '' ) { static $n = 0; return $p . ++$n; }
function rest_url( $p ) { return '/wp-json/' . $p; }
function wp_parse_url( $u, $c = -1 ) { return parse_url( $u, $c ); }
function home_url( $p = '' ) { return 'https://staging.velisrealty.vn' . $p; }
function get_the_author_meta( $f, $u ) { return 'Vũ Xuân'; }
function get_the_date( $f, $p ) { return '01/05/2026'; }
function get_the_title( $p ) { return get_post( $p )->post_title; }
function get_post_thumbnail_id( $p ) { return 11; }
function get_post_type_archive_link( $t ) { return '/du-an/'; }
function velis_cf7_form_id() { return 20800; }
// data layer (theme/velis/inc/data.php) stubs
function velis_has_data() { return true; }
function velis_level( $p ) { return 'du-an'; }
function velis_developers( $p ) { return array( (object) array( 'ID' => 5, 'post_title' => 'Masterise Homes', 'post_name' => 'masterise-homes' ) ); }
function velis_status( $p ) { return ''; }
function velis_type_names( $p ) { return array( 'can-ho' => 'Căn hộ' ); }
function velis_price( $p ) { return ''; }
function velis_terms( $p, $t ) { return array(); }
function velis_root( $p ) { return get_post( $p ); }
function velis_lines( $p ) { return array(); }
function velis_children( $p, $l = '' ) { return array(); }
function velis_short_name( $p ) { return get_post( $p )->post_title; }
function velis_facts( $p ) { return array(); }
function velis_region_label( $p ) { return 'Khu Đông'; }
function velis_image_id( $p ) { return get_post( $p )->ID; }
function velis_post_kind( $p ) { return ''; }
function velis_post_label( $p ) { return 'The Global City'; }
function velis_post_projects( $p ) { return array(); }
function velis_reading_minutes( $p ) { return 6; }
function velis_f( $p, $k ) { return 'Đường Đỗ Xuân Hợp'; }
function velis_focus_css( $id ) { return 'phai-tren' === get_post_meta( $id, 'velis_focus' ) ? '100% 0%' : '50% 50%'; }
require __DIR__ . '/../../theme/velis/inc/components.php';
require __DIR__ . '/../../theme/velis/inc/ui.php';

$check = function ( $ok, $msg ) { if ( ! $ok ) { fwrite( STDERR, "FAIL: $msg\n" ); exit( 1 ); } };
// images
$check( str_contains( velis_img( 10, 'a' ), 'class="is-marked"' ) && str_contains( velis_img( 10, 'a' ), '--zoom: 1.15' ), 'flagged photo cropped (X-03)' );
$check( ! str_contains( velis_img( 11, 'a' ), 'is-marked' ) && str_contains( velis_img( 11, 'a' ), '--focus: 50% 50%' ), 'clean photo not cropped' );
$check( str_contains( velis_img( 13, 'a' ), '--focus: 100% 0%' ), 'F-B focus used as object-position' );
$check( str_contains( velis_media( 12, 'Masteri Grand View' ), 'card__media--empty' ) && str_contains( velis_media( 12, 'Masteri Grand View' ), 'Masteri Grand View' ), 'logo the crop cannot hide → named frame (NT-23)' );
$check( str_contains( velis_img( 11, 'a', 'large', array( 'sizes' => '400px', 'ratio' => 1.5 ) ), 'sizes="400px"' ), 'X-01: no margin outside the LCP' );
// hero A / B from the file width (X-02), override only on staging
$check( str_contains( velis_hero_a( array( 'img' => 10, 'title' => 'TGC', 'h1' => true ) ), 'hero hero--a' ), '≥ 1920 px file → hero A' );
$check( str_contains( velis_hero_a( array( 'img' => 11, 'title' => 'MPP', 'h1' => true ) ), 'hero hero--b' ), '< 1920 px file → hero B' );
$h12 = velis_hero_a( array( 'img' => 12, 'title' => 'MGV', 'h1' => true ) );
$check( str_contains( $h12, 'hero--b' ) && str_contains( $h12, 'hero__media card__media--empty' ), 'unhideable logo → hero B named frame' );
$_GET['velis_hero'] = 'a';
$check( str_contains( velis_hero_a( array( 'img' => 11, 'title' => 'MPP', 'h1' => true ) ), 'hero--a' ), '?velis_hero=a on staging' );
unset( $_GET['velis_hero'] );
$home = velis_hero_home( array( 'img' => 11, 'alt' => 'x', 'eyebrow' => 'Velis Realty', 'title' => 'T', 'lead' => 'L', 'buttons' => velis_btn( 'Nhận tư vấn', '#tu-van' ), 'after' => velis_feature_strip( array( get_post( 1 ), get_post( 2 ) ) ) ) );
$check( str_contains( $home, 'class="hero hero--home"' ) && str_contains( $home, 'class="hero__img"' ) && 2 === substr_count( $home, 'class="feat"' ) && str_contains( $home, 'feats__nav' ), 'home hero + strip markup' );
// cards, grid, facts, advisor, form
$card = velis_card_project( get_post( 3 ), '', true );
$check( str_contains( $card, '<article class="card" data-card' ) && str_contains( $card, 'card__title' ) && str_contains( $card, 'class="card__more"' ), 'project card (mockup)' );
$grid = velis_grid( array( $card, velis_card_project( get_post( 4 ) ), velis_card_project( get_post( 5 ) ) ), 'three' );
$check( str_contains( $grid, 'class="grid grid--three" data-n="3"' ), 'grid count (X-06)' );
$facts = velis_facts_html( array( 'Chủ đầu tư' => 'Masterise Homes', 'Quy mô' => '117 ha', 'Vị trí' => 'Thủ Đức', 'Pháp lý' => '' ), '', '', array( 'Vị trí' => '#vi-tri' ) );
$check( str_contains( $facts, 'data-n="4"' ) && strpos( $facts, '>Giá<' ) < strpos( $facts, '>Vị trí<' ) && str_contains( $facts, 'is-missing' ) && str_contains( $facts, 'facts__more' ), 'facts: Giá before Vị trí, missing price, empty dropped' );
$adv = velis_advisor( get_post( 3 ) );
$check( str_contains( $adv, 'class="advisor"' ) && str_contains( $adv, 'data-open-form' ) && str_contains( $adv, 'data-mini-form hidden' ) && str_contains( $adv, 'name="interest" value="Dự án 3"' ), 'advisor + short form' );
$form = velis_form_html( 'TGC' );
$check( str_contains( $form, 'section section--dark' ) && str_contains( $form, 'name="page-url"' ) && str_contains( $form, 'name="utm"' ) && str_contains( $form, 'data-cf7="20800"' ), 'form keeps CF7 + hidden fields' );
$check( '' === velis_compare_html( array( get_post( 1 ) ), array( 'A' => fn( $p ) => 'x' ), 'c' ), 'compare needs 2 records' );
$gal = velis_gallery_html( array( 10, 11 ), 'TGC' );
$check( str_contains( $gal, 'gallery__track' ) && str_contains( $gal, 'data-counter>1/2' ) && 1 === substr_count( $gal . velis_photo_grid( array( array( 11, '' ) ) ), '<dialog class="lightbox"' ), 'gallery + one lightbox per page' );
$zones = velis_zone_listing( get_post( 1 ), array( get_post( 6 ), get_post( 7 ) ) );
$check( str_contains( $zones, 'data-filter=".zones"' ) && str_contains( $zones, 'class="grid zones"' ), 'zone filter (mockup)' );
$check( str_contains( velis_section_nav( array( 'a' => 'A', 'b' => 'B' ) ), 'class="tabs"' ) && str_contains( velis_breadcrumb_html( array( array( 'Trang chủ', '/' ), array( 'Dự án', '' ) ) ), 'class="crumbs"' ), 'tabs + crumbs' );
$toc = velis_toc( '<h2>A</h2><p>x</p><h2>B</h2><h2>C</h2>', 1300 )[0];
$check( str_starts_with( $toc, '<div class="faq"><details data-toc>' ), 'table of contents = FAQ row' );
$check( str_contains( velis_text_page( '<p>x</p>', '<aside class="page__side"></aside>' ), 'class="wrap page"' ) && str_contains( velis_text_page( '<p>x</p>' ), 'class="wrap--read"' ), 'text page: 2 columns only with a side card' );
$check( str_contains( velis_search_form( 's' ), 'class="field"' ) && str_contains( velis_search_form( 's' ), 'class="btn"' ), 'search form = form row components' );
$all = $card . $grid . $facts . $adv . $form . $gal . $zones . $home . $toc;
$check( ! preg_match( '/class="[^"]*\bv-/', $all ), 'no old v- class left' );
// static scan: no `v-` class name anywhere in the theme (PHP, block templates, JS selectors, CSS)
$root = __DIR__ . '/../../theme/velis';
foreach ( new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root, FilesystemIterator::SKIP_DOTS ) ) as $f ) {
	if ( preg_match( '/\.(php|html|js|css)$/', $f ) && ! str_ends_with( $f, '.min.css' ) ) {
		$src = file_get_contents( $f );
		$check( ! preg_match( '/class="[^"]*\bv-|\.v-[a-z]|[\'"]v-[a-z][a-z-]*[\'"]/', $src ), 'old v- class in ' . substr( $f, strlen( $root ) + 1 ) );
	}
}
echo "ui render: all checks passed\n";
