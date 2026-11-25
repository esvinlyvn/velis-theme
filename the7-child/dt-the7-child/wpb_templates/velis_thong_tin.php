<?php
/** Velis · Thông tin dự án – lưới nhãn / giá trị (velis.css mục 3b). */
defined( 'ABSPATH' ) || exit;
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
$muc  = (array) vc_param_group_parse_atts( $atts['muc'] );
if ( ! $muc ) {
	return;
}
echo '<dl class="velis-thong-tin velis-thong-tin--cot-' . ( '2' === $atts['cot'] ? '2' : '3' ) . '">';
foreach ( $muc as $m ) {
	if ( empty( $m['nhan'] ) && empty( $m['gia_tri'] ) ) {
		continue;
	}
	echo '<div class="velis-thong-tin__o"><dt>' . esc_html( $m['nhan'] ?? '' ) . '</dt><dd>' . velis_so( esc_html( $m['gia_tri'] ?? '' ) ) . '</dd></div>'; // phpcs:ignore WordPress.Security.EscapeOutput -- đã esc_html, velis_so chỉ bọc số
}
echo '</dl>';
