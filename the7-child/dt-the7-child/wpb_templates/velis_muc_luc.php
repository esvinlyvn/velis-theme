<?php
/** Velis · Mục lục – tiêu đề H2 của các khối Velis trên trang; máy tính mở 2 cột, điện thoại thu gọn (JS functions.php). */
defined( 'ABSPATH' ) || exit;
$atts  = vc_map_get_attributes( $this->getShortcode(), $atts );
$items = velis_muc_luc_items( get_post_field( 'post_content', get_the_ID() ) );
if ( ! $items ) {
	return;
}
?>
<details class="velis-muc-luc" open>
	<summary><?php echo esc_html( $atts['tieu_de'] ? $atts['tieu_de'] : 'Nội dung chính' ); ?></summary>
	<ol><?php foreach ( $items as $i ) { echo '<li><a href="#' . esc_attr( $i['neo'] ) . '">' . esc_html( $i['tieu_de'] ) . '</a></li>'; } ?></ol>
</details>
