<?php
/**
 * Velis · Đầu trang – khung chứa màn đầu (2026-11-27, người dùng chốt: màn đầu không phụ thuộc JS). In cùng cấu trúc hàng / section của
 * WPBakery (CSS sẵn có của velis-hero / velis-home-hero dùng lại) nhưng KHÔNG có data-vc-full-width: rộng hết khung bằng CSS (.velis-dau-trang, velis.css).
 */
defined( 'ABSPATH' ) || exit;
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
$id   = $atts['el_id'] ? ' id="' . esc_attr( $atts['el_id'] ) . '"' : '';
$cls  = trim( 'velis-dau-trang ' . $atts['el_class'] );
$cot  = '<div class="wpb_column vc_column_container vc_col-sm-12"><div class="vc_column-inner"><div class="wpb_wrapper">' . wpb_js_remove_wpautop( $content ) . '</div></div></div>';
if ( 'khoi' === $atts['kieu'] ) {
	echo '<section' . $id . ' class="vc_section ' . esc_attr( $cls ) . '"><div class="vc_row wpb_row vc_row-fluid">' . $cot . '</div></section>'; // phpcs:ignore
} else {
	echo '<div' . $id . ' class="vc_row wpb_row vc_row-fluid ' . esc_attr( $cls ) . '">' . $cot . '</div>'; // phpcs:ignore
}
