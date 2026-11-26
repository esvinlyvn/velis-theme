<?php
/** Velis · Trả lời nhanh – H2 câu hỏi + ô nền nhẹ (câu trả lời chính) + dòng "Nguồn · Cập nhật dd/mm/yyyy · Phân tích: <tác giả>". */
defined( 'ABSPATH' ) || exit;
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
$chu  = wpb_js_remove_wpautop( $content, true );
if ( '' === trim( wp_strip_all_tags( $chu ) ) ) {
	return;
}
$nhan  = $atts['nhan'] ? $atts['nhan'] : 'Trả lời nhanh';
$nguon = $atts['nguon'] ? $atts['nguon'] : 'Tổng hợp từ thông tin chủ đầu tư công bố';
$tg    = get_post_field( 'post_author', get_the_ID() );
?>
<?php if ( $atts['cau_hoi'] ) : ?><h2 class="velis-tra-loi__hoi"><?php echo esc_html( $atts['cau_hoi'] ); ?></h2><?php endif; ?>
<aside class="velis-tra-loi" aria-label="<?php echo esc_attr( $nhan ); ?>">
	<p class="velis-tra-loi__nhan"><?php echo esc_html( $nhan ); ?></p>
	<?php echo $chu; // phpcs:ignore ?>
	<p class="velis-tra-loi__nguon">Nguồn: <?php echo esc_html( $nguon ); ?> · Cập nhật <time datetime="<?php echo esc_attr( get_the_modified_date( 'c' ) ); ?>"><?php echo esc_html( get_the_modified_date( 'd/m/Y' ) ); ?></time> · Phân tích: <a href="<?php echo esc_url( get_author_posts_url( $tg ) ); ?>"><?php echo esc_html( get_the_author_meta( 'display_name', $tg ) ); ?></a></p>
</aside>
<?php
// Mục lục Easy TOC đứng SAU ô (Easy TOC tự chèn trước tiêu đề đầu tiên = câu hỏi này → tắt chèn tự động ở bài có ô, in ở đây; trang có Mục lục Velis thì không)
if ( is_singular( 'post' ) && shortcode_exists( 'ez-toc' ) && ! has_shortcode( (string) get_post_field( 'post_content', get_the_ID() ), 'velis_muc_luc' ) ) {
	echo do_shortcode( '[ez-toc]' ); // phpcs:ignore
}
