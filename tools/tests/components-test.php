<?php
// php tools/tests/components-test.php — checks velis_table() hiding rules and velis_area().
define( 'ABSPATH', __DIR__ );
function wp_strip_all_tags( $s ) { return strip_tags( $s ); }
function esc_attr( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES ); }
function esc_html( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES ); }
require __DIR__ . '/../../theme/velis/inc/components.php';

$html = velis_table( array(
	'caption' => 'T',
	'cols'    => array( 'a' => array( 'Diện tích', 'num' ), 'b' => array( 'Giá từ', 'num' ), 'c' => array( 'Ghi chú', 'text' ) ),
	'rows'    => array(
		array( 'label' => 'Căn 1', 'a' => '49 m²', 'b' => '', 'c' => 'x' ),
		array( 'label' => 'Căn 2', 'a' => '', 'b' => ' ', 'c' => '' ),
	),
) );
$check = function ( $ok, $msg ) { if ( ! $ok ) { fwrite( STDERR, "FAIL: $msg\n" ); exit( 1 ); } };
$check( false === strpos( $html, '>Giá từ</th>' ), 'empty column hidden' );
$check( false === strpos( $html, '>Căn 2</th>' ), 'empty row hidden' );
$check( false !== strpos( $html, 'Chưa công bố: giá từ, căn 2.' ), 'note lists hidden column and row' );
$check( false !== strpos( $html, 'data-label="Diện tích"' ), 'cells carry labels for mobile cards' );
$all = velis_table( array( 'caption' => 'T', 'cols' => array( 'a' => array( 'A' ) ), 'rows' => array( array( 'label' => 'R', 'a' => '1' ) ) ) );
$check( false === strpos( $all, 'v-source' ), 'no note when nothing hidden' );
$check( '' === velis_area( '', '' ), 'empty area renders nothing' );
$check( false !== strpos( velis_area( '75,8 m²', '84,9 m²' ), '84,9 m² tim tường' ), 'secondary gross area' );
$check( false !== strpos( velis_area( '', '49 m²' ), 'tim tường' ), 'gross only is labelled' );
$h = fn( $l, $t ) => '<!-- wp:heading' . ( 3 === $l ? ' {"level":3}' : '' ) . " -->\n<h$l class=\"wp-block-heading\">$t</h$l>\n<!-- /wp:heading -->\n";
$src = '<p>Mở đầu.</p>' . $h( 2, 'CĂN HỘ X' ) . '<p>Giới thiệu.</p>' . $h( 2, 'VỊ TRÍ X Ở ĐÂU? VÌ SAO NÊN MUA' ) . '<p>Gần sông.</p>' . $h( 3, 'Kết nối' ) . '<p>10 phút.</p>'
	. $h( 2, 'TẠI SAO NÊN MUA X' ) . '<p>Vì A.</p>' . $h( 2, 'VÌ SAO X PHÙ HỢP VỚI NGƯỜI MUA Ở?' ) . '<p>Vì B.</p>' . $h( 2, 'CÂU HỎI THƯỜNG GẶP' ) . '<details><summary>Hỏi?</summary><p>Đáp.</p></details>' . $h( 3, 'Bài viết liên quan' ) . '<ul><li>a</li></ul>';
$c = velis_chunks( $src );
$check( array( 'tong-quan', 'vi-tri', 'goc-nhin', 'hoi-dap', 'bai-viet' ) === array_keys( $c ), 'slots by heading' );
$check( 'VỊ TRÍ X Ở ĐÂU? VÌ SAO NÊN MUA' === $c['vi-tri']['title'] && false !== strpos( $c['vi-tri']['html'], 'Kết nối' ), 'location heading wins, H3 stays in its slot' );
$check( false !== strpos( $c['tong-quan']['html'], 'CĂN HỘ X' ) && false !== strpos( $c['goc-nhin']['html'], 'PHÙ HỢP VỚI' ), 'unmatched H2 to tổng quan; second H2 of a slot kept' );
$words = fn( $s ) => count( preg_split( '/\s+/u', trim( strip_tags( $s ) ), -1, PREG_SPLIT_NO_EMPTY ) );
$check( $words( $src ) === array_sum( array_map( fn( $x ) => $words( $x['title'] ) + $words( $x['html'] ), $c ) ), 'no word lost or added' );
$check( array() === velis_chunks( '' ), 'empty content, no slot' );
$check( 'a0cXs21Ib9Q' === velis_youtube_id( 'https://youtu.be/a0cXs21Ib9Q' ) && 'a0cXs21Ib9Q' === velis_youtube_id( 'https://www.youtube.com/watch?feature=x&v=a0cXs21Ib9Q' ), 'youtube id from short and watch URLs' );
$check( '' === velis_youtube_id( 'https://vimeo.com/123' ), 'not youtube' );
$yt = velis_youtube_facade( 'a0cXs21Ib9Q' );
$check( false === strpos( $yt, '<iframe' ) && false !== strpos( $yt, 'href="https://www.youtube.com/watch?v=a0cXs21Ib9Q"' ) && false !== strpos( $yt, 'width="480"' ), 'facade: link + sized thumbnail, no iframe' );
$check( velis_auto_caption( 'The Privé 2' ) && velis_auto_caption( 'the-prive-1024x683.webp' ) && velis_auto_caption( 'phoi-canh_1' ), 'auto captions hidden' );
$check( ! velis_auto_caption( 'Phối cảnh tòa Cloud 9 nhìn từ sông Giồng Ông Tố' ) && ! velis_auto_caption( 'Tiến độ tháng 4/2026' ), 'real captions kept' );
echo "components: all checks passed\n";
