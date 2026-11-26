<?php
/** Velis · Trả lời nhanh – ô nền nhẹ đầu bài: câu trả lời chính (2–4 câu / 3–5 gạch đầu dòng) cho ai chỉ cần thông tin đó. */
defined( 'ABSPATH' ) || exit;
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
$chu  = wpb_js_remove_wpautop( $content, true );
if ( '' === trim( wp_strip_all_tags( $chu ) ) ) {
	return;
}
$nhan = $atts['nhan'] ? $atts['nhan'] : 'Trả lời nhanh';
?>
<aside class="velis-tra-loi" aria-label="<?php echo esc_attr( $nhan ); ?>">
	<p class="velis-tra-loi__nhan"><?php echo esc_html( $nhan ); ?></p>
	<?php echo $chu; // phpcs:ignore ?>
</aside>
