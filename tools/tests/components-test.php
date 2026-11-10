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
$check( false === strpos( $all, 'class="source"' ), 'no note when nothing hidden' );
$check( false !== strpos( $html, 'class="source"' ) && false !== strpos( $html, '<div class="table-wrap"><table>' ), 'mockup table markup' );
$check( '' === velis_area( '', '' ), 'empty area renders nothing' );
$check( false !== strpos( velis_area( '75,8 m²', '84,9 m²' ), '84,9 m² tim tường' ), 'secondary gross area' );
$check( false !== strpos( velis_area( '', '49 m²' ), 'tim tường' ), 'gross only is labelled' );
$h = fn( $l, $t ) => '<!-- wp:heading' . ( 3 === $l ? ' {"level":3}' : '' ) . " -->\n<h$l class=\"wp-block-heading\">$t</h$l>\n<!-- /wp:heading -->\n";
$src = '<p>Mở đầu.</p>' . $h( 2, 'CĂN HỘ X' ) . '<p>Giới thiệu.</p>' . $h( 2, 'THÔNG TIN TỔNG QUAN X' ) . '<p>Bảng.</p>' . $h( 2, 'VỊ TRÍ X Ở ĐÂU? VÌ SAO NÊN MUA' ) . '<p>Gần sông.</p>' . $h( 3, 'Kết nối' ) . '<p>10 phút.</p>'
	. $h( 2, 'TẠI SAO NÊN MUA X' ) . '<p>Vì A.</p>' . $h( 2, 'VÌ SAO X PHÙ HỢP VỚI NGƯỜI MUA Ở?' ) . '<p>Vì B.</p>' . $h( 2, 'CÂU HỎI THƯỜNG GẶP' ) . '<details><summary>Hỏi?</summary><p>Đáp.</p></details>' . $h( 3, 'Bài viết liên quan' ) . '<ul><li>a</li></ul>';
$c = velis_chunks( $src );
$check( array( 'tong-quan', 'vi-tri', 'goc-nhin', 'hoi-dap', 'bai-viet' ) === array_keys( $c ), 'slots by heading' );
$check( 'VỊ TRÍ X Ở ĐÂU? VÌ SAO NÊN MUA' === $c['vi-tri']['title'] && false !== strpos( $c['vi-tri']['html'], 'Kết nối' ), 'location heading wins, H3 stays in its slot' );
$check( 'THÔNG TIN TỔNG QUAN X' === $c['tong-quan']['title'] && false === strpos( $c['tong-quan']['html'], 'TỔNG QUAN X' ), 'overview H2 is the section title, not repeated' );
$check( false !== strpos( $c['tong-quan']['html'], 'CĂN HỘ X' ) && false !== strpos( $c['goc-nhin']['html'], 'PHÙ HỢP VỚI' ), 'unmatched H2 to tổng quan; second H2 of a slot kept' );
$words = fn( $s ) => count( preg_split( '/\s+/u', trim( strip_tags( $s ) ), -1, PREG_SPLIT_NO_EMPTY ) );
$check( $words( $src ) === array_sum( array_map( fn( $x ) => $words( $x['title'] ) + $words( $x['html'] ), $c ) ), 'no word lost or added' );
$check( array() === velis_chunks( '' ), 'empty content, no slot' );
$check( 'a0cXs21Ib9Q' === velis_youtube_id( 'https://youtu.be/a0cXs21Ib9Q' ) && 'a0cXs21Ib9Q' === velis_youtube_id( 'https://www.youtube.com/watch?feature=x&v=a0cXs21Ib9Q' ), 'youtube id from short and watch URLs' );
$check( '' === velis_youtube_id( 'https://vimeo.com/123' ), 'not youtube' );
$yt = velis_youtube_facade( 'a0cXs21Ib9Q' );
$check( false === strpos( $yt, '<iframe' ) && false !== strpos( $yt, 'href="https://www.youtube.com/watch?v=a0cXs21Ib9Q"' ) && false !== strpos( $yt, 'width="480"' ), 'facade: link + sized thumbnail, no iframe' );
$check( velis_auto_caption( 'The Privé 2' ) && velis_auto_caption( 'Giới thiệu 2' ) && velis_auto_caption( 'Vị trí dự án Spring Ville 3' ) && velis_auto_caption( 'the-prive-1024x683.webp' ) && velis_auto_caption( 'phoi-canh_1' ), 'auto captions hidden' );
$check( ! velis_auto_caption( 'Phối cảnh tòa Cloud 9 nhìn từ sông Giồng Ông Tố' ) && ! velis_auto_caption( 'Tiến độ tháng 4/2026' ), 'real captions kept' );
$rel = velis_strip_related( '<p>A</p><h3 class="wp-block-heading">Bài viết liên quan</h3><ul><li><a href="/x">X</a></li></ul><h2>Hỏi đáp</h2><p>B</p>' );
$check( '<p>A</p><h2>Hỏi đáp</h2><p>B</p>' === $rel, 'old related list removed up to the next heading' );
$check( '<h2>Phân tích</h2>' === velis_strip_related( '<h2>Phân tích</h2>' ), 'other headings untouched' );
$check( '<p>Giới thiệu.</p>' === velis_strip_contact( '<p>Giới thiệu.</p><p>Liên hệ ngay với chúng tôi:</p><ul><li>Địa chỉ: 34 Lương Định Của</li><li>Hotline: 0911237979</li></ul>' ), 'old contact list + lead-in removed' );
$check( '<ul><li>Một</li></ul>' === velis_strip_contact( '<ul><li>Một</li></ul>' ), 'other lists kept' );
$check( 2560 === velis_max_candidate( 'a.webp 1200w, b.webp 2560w, c.webp 300w' ) && 768 === velis_max_candidate( '', 768 ), 'widest srcset candidate' );
list( $rest, $imgs ) = velis_take_images( '<p>A</p><!-- wp:image {"id":5} --><figure class="wp-block-image"><img class="wp-image-5" alt=""/><figcaption>Tháng 4/2026</figcaption></figure><!-- /wp:image --><p>B</p>' );
$check( '<p>A</p><p>B</p>' === $rest && array( array( 5, 'Tháng 4/2026' ) ) === $imgs, 'progress photos taken out of the text with their caption' );
$run = velis_sentence_run( 'Một hai ba. Bốn năm sáu bảy tám chín mười. Mười một!', 7 );
$check( 'Bốn năm sáu bảy tám chín mười.' === $run, 'longest run of whole sentences within the word limit' );
$check( '400px, 100vw' === velis_sizes( '400px, 100vw' ), 'sizes: no zoom, no margin → unchanged (X-01: frame × DPR)' );
$check( 'calc(1.15 * (400px)), calc(1.15 * (100vw))' === velis_sizes( '400px, 100vw', 1, true ), 'sizes: LCP pick margin on every slot' );
$check( '(min-width: 768px) calc(1.12 * (min(720px, 1200px))), calc(1.12 * (min(100vw - 32px, 1200px)))' === velis_sizes( '(min-width: 768px) min(720px, 1200px), min(100vw - 32px, 1200px)', 1.12 ), 'sizes: crop zoom only, media kept, commas inside min() not split' );
$check( 'Bàn giao từ tháng 11/2023' === velis_label_value( 'Bàn giao', 'Từ tháng 11/2023' ) && 'Bàn giao dự kiến 2027' === velis_label_value( 'Bàn giao', 'Dự kiến 2027' ), 'common first word lower case' );
$check( 'Bàn giao Masteri 2027' === velis_label_value( 'Bàn giao', 'Masteri 2027' ) && 'Bàn giao Quận 2' !== velis_label_value( 'Bàn giao', 'Quý 2/2027' ), 'proper nouns kept' );
foreach ( range( 1, 13 ) as $n ) { // last row of the construction grid never holds one photo (≥ 768 px)
	list( $cols, $wide ) = velis_photo_cols( $n );
	$last = ( $n + ( $wide ? 1 : 0 ) ) % $cols ?: $cols;
	$check( 1 === $n || 1 !== $last, "photo grid $n: last row has $last of $cols" );
}
$check( array( 1, false ) === velis_photo_cols( 1 ) && array( 2, false ) === velis_photo_cols( 4 ) && array( 3, true ) === velis_photo_cols( 5 ) && array( 3, false ) === velis_photo_cols( 6 ) && array( 3, true ) === velis_photo_cols( 7 ), 'photo grid columns per the brief' );
echo "components: all checks passed\n";
