<?php
// php tools/tests/theme-seo-test.php — theme helpers with WordPress stubs: post kind guess, title/meta fitting, TOC ids.
define( 'ABSPATH', __DIR__ );
foreach ( array( 'add_action', 'add_filter' ) as $f ) {
	eval( "function $f() {}" );
}
function wp_strip_all_tags( $s ) { return trim( strip_tags( $s ) ); }
function sanitize_title( $s ) { $s = strtr( mb_strtolower( $s ), array( 'ý' => 'y', 'á' => 'a', 'ỏ' => 'o', 'ể' => 'e', 'ậ' => 'a', 'đ' => 'd' ) ); return trim( preg_replace( '/[^a-z0-9]+/', '-', $s ), '-' ); }
function esc_attr( $s ) { return htmlspecialchars( $s, ENT_QUOTES ); }
function esc_html( $s ) { return htmlspecialchars( $s, ENT_QUOTES ); }
function apply_filters( $h, $v ) { return $v; }
require __DIR__ . '/../../theme/velis/inc/data.php';
require __DIR__ . '/../../theme/velis/inc/ui.php';
require __DIR__ . '/../../theme/velis/inc/seo.php';
$check = function ( $ok, $msg ) { if ( ! $ok ) { fwrite( STDERR, "FAIL: $msg\n" ); exit( 1 ); } };

$check( 'so-sanh' === velis_guess_kind( 'So sánh The Privé và Palm River' ), 'so sánh' );
$check( 'phan-tich' === velis_guess_kind( 'Shophouse SOHO có nên đầu tư hay không' ), '"hay" alone is not a comparison' );
$check( 'huong-dan' === velis_guess_kind( 'Thủ tục mua căn hộ cho người nước ngoài' ), 'hướng dẫn' );
$check( 'tin' === velis_guess_kind( 'Cập nhật tiến độ Persa Place tháng 10' ), 'tin tiến độ' );
$check( 'nhan-dinh' === velis_guess_kind( 'Thị trường căn hộ khu Đông 2027' ), 'nhận định' );

$t = velis_fit( 'Masteri Cosmo Central – The Global City: giá, mặt bằng, pháp lý' );
$check( mb_strlen( $t ) <= 60 && str_starts_with( $t, 'Masteri Cosmo Central' ), 'title fitted: ' . $t );
$check( 'The Privé: giá, mặt bằng, pháp lý' === velis_fit( 'The Privé: giá, mặt bằng, pháp lý' ), 'short title untouched' );
$d = velis_clip( str_repeat( 'Persa Place của Gamuda Land, ', 10 ) );
$check( mb_strlen( $d ) <= 155 && str_ends_with( $d, '…' ), 'meta clipped at a word: ' . $d );

list( $toc, $html ) = velis_toc( '<h2>Giá</h2><p>a</p><h2>Giá</h2><h3 id="x">Sub</h3><h2>Pháp lý</h2>', 1500 );
$check( str_contains( $html, '<h2 id="gia">' ) && str_contains( $html, '<h2 id="gia-2">' ) && str_contains( $html, '<h3 id="x">' ), 'unique heading ids, existing ids kept' );
$check( 3 === substr_count( $toc, '<li>' ), 'TOC lists H2 only' );
list( $toc ) = velis_toc( '<h2>a</h2><h2>b</h2><h2>c</h2>', 800 );
$check( '' === $toc, 'no TOC under 1.200 words' );
$check( '<p class="v-card__title">x</p>' === velis_heading_to_p( '<h3 class="v-card__title">x</h3>' ), 'embedded card title is not a heading' );
$check( '<h2 class="a">T</h2><h2>U</h2>' === velis_content( '<h1 class="a">T</h1><h2>U</h2>' ), 'content H1 demoted' );
echo "theme seo: all checks passed\n";
