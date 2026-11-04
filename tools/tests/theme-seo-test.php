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
function wp_parse_url( $u, $c = -1 ) { return parse_url( $u, $c ); }
function wp_get_attachment_url( $id ) { return 'https://x.vn/wp-content/uploads/2026/04/the-prive.webp'; }
function remove_accents( $s ) { return strtr( $s, array( 'ă' => 'a', 'ộ' => 'o', 'é' => 'e', 'ư' => 'u' ) ); }
require __DIR__ . '/../../theme/velis/inc/data.php';
require __DIR__ . '/../../theme/velis/inc/ui.php';
require __DIR__ . '/../../theme/velis/inc/seo.php';
$check = function ( $ok, $msg ) { if ( ! $ok ) { fwrite( STDERR, "FAIL: $msg\n" ); exit( 1 ); } };


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
$check( 'Năm 2027' === velis_short( 'Năm 2027 (Hoàn thiện nội thất chuẩn Châu Âu và nhiều tiện ích khác)' ), 'short keeps the first clause' );
$check( mb_strlen( velis_short( str_repeat( 'Đường Đỗ Xuân Hợp, ', 5 ) ) ) <= 46, 'short cuts at a word' );
$html = '<figure class="wp-caption"><img src="https://x.vn/wp-content/uploads/2026/04/the-prive-1024x683.webp" alt=""></figure><p>Văn bản</p><img src="https://x.vn/a.webp">';
$check( '<p>Văn bản</p><img src="https://x.vn/a.webp">' === velis_strip_dup_image( $html, 7 ), 'first image = featured (other size) is removed' );
$other = str_replace( 'the-prive-1024', 'khac-1024', $html );
$check( $other === velis_strip_dup_image( $other, 7 ), 'different file kept' );
$check( 'can ho palm river' === velis_fold( 'Căn hộ  Palm River!' ), 'fold' );
echo "theme seo: all checks passed\n";
