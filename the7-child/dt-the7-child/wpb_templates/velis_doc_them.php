<?php
/** Velis · Đọc thêm – thẻ link giữa bài (tiêu đề bài đích + 1 dòng người đọc sẽ biết thêm gì); tối đa 2 thẻ mỗi bài. */
defined( 'ABSPATH' ) || exit;
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
$dich = velis_bai_dich( $atts['bai'] );
if ( ! $dich || (int) $atts['bai'] === get_the_ID() || ! velis_doc_them_con_cho() ) {
	return;
}
?>
<aside class="velis-doc-them" aria-label="Đọc thêm">
	<p class="velis-doc-them__nhan">Đọc thêm</p>
	<a class="velis-doc-them__link" href="<?php echo esc_url( $dich[0] ); ?>"><?php echo esc_html( $dich[1] ); ?></a>
	<?php if ( $atts['mo_ta'] ) : ?><p class="velis-doc-them__mo-ta"><?php echo esc_html( $atts['mo_ta'] ); ?></p><?php endif; ?>
</aside>
